/**
 * POST /api/contact
 * Handles contact form submissions.
 * Validates input, sanitizes fields, and sends notification email.
 */

import { z } from 'zod';
import { env } from '@/lib/env';
import { ensureDatabaseReady, getDb, isDatabaseConfigured } from '@/lib/db/client';
import { contactInquiriesTable } from '@/lib/db/schema';
import { dispatchIntakeEventToN8n } from '@/lib/integrations/n8n';
import { syncAndNotifySubscriberViaNovu } from '@/lib/integrations/novu';
import { syncPersonAndFollowUpToTwenty } from '@/lib/integrations/twenty';
import { readJsonBody, sanitizeText, validationErrorResponse } from '../_shared/validation';

interface ContactRequest {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
    company?: string;
    inquiryType?: 'general' | 'rental' | 'b2b' | 'support' | 'press';
}

interface ContactResponse {
    success: boolean;
    message: string;
    ticketId?: string;
}

interface ResendSendPayload {
    from: string;
    to: string[];
    reply_to: string;
    subject: string;
    text: string;
}

const COMMON_EMAIL_DOMAINS = new Set([
    'gmail.com',
    'googlemail.com',
    'hotmail.com',
    'icloud.com',
    'interia.pl',
    'o2.pl',
    'outlook.com',
    'proton.me',
    'protonmail.com',
    'wp.pl',
    'yahoo.com',
]);

function inferCompanyNameFromEmail(email: string): string | undefined {
    const domain = email.trim().toLowerCase().split('@')[1];

    if (!domain || COMMON_EMAIL_DOMAINS.has(domain)) {
        return undefined;
    }

    return domain;
}

const contactSchema = z.object({
    name: z.string().trim().min(2, 'Please enter your full name (minimum 2 characters).').max(100),
    email: z.string().trim().email('Please enter a valid email address.'),
    subject: z.string().trim().max(200).optional(),
    message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(5000, 'Message cannot exceed 5,000 characters.'),
    phone: z.string().trim().max(30).optional(),
    company: z.string().trim().max(100).optional(),
    inquiryType: z.enum(['general', 'rental', 'b2b', 'support', 'press']).optional().default('general'),
}) satisfies z.ZodType<ContactRequest>;

export async function POST(request: Request): Promise<Response> {
    try {
        const rawBody = await readJsonBody(request);
        const parsed = contactSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const body = parsed.data;
        const { name, email, message, subject, phone, company, inquiryType = 'general' } = body;

        // --- Sanitize ---
        const sanitized = {
            name: sanitizeText(name, 100),
            email: sanitizeText(email, {
                maxLength: 254,
                context: 'email',
            }),
            subject: subject ? sanitizeText(subject, 200) : `Contact: ${inquiryType}`,
            message: sanitizeText(message, {
                maxLength: 5000,
                context: 'multiline',
            }),
            phone: phone
                ? sanitizeText(phone, {
                    maxLength: 30,
                    context: 'phone',
                })
                : undefined,
            company: company ? sanitizeText(company, 100) : undefined,
            inquiryType,
        };
        const inferredCompanyName = sanitized.company ?? inferCompanyNameFromEmail(sanitized.email);

        // Generate a simple ticket ID for tracking
        const ticketId = `HYL-${Date.now().toString(36).toUpperCase()}`;

        if (!isDatabaseConfigured()) {
            console.error('[contact] DATABASE_URL missing; cannot persist contact inquiry', {
                ticketId,
            });

            return Response.json(
                {
                    success: false,
                    message: 'Contact channel is temporarily unavailable. Please try again shortly.',
                } satisfies ContactResponse,
                { status: 503 }
            );
        }

        await ensureDatabaseReady();
        const db = getDb();
        await db.insert(contactInquiriesTable).values({
            id: crypto.randomUUID(),
            ticketId,
            name: sanitized.name,
            email: sanitized.email,
            subject: sanitized.subject,
            message: sanitized.message,
            phone: sanitized.phone,
            company: sanitized.company,
            inquiryType: sanitized.inquiryType,
        });

        await Promise.allSettled([
            dispatchIntakeEventToN8n({
                target: 'contact',
                eventType: 'contact.created',
                payload: {
                    ticketId,
                    ...sanitized,
                },
            }),
            syncPersonAndFollowUpToTwenty({
                email: sanitized.email,
                fullName: sanitized.name,
                phone: sanitized.phone,
                companyName: inferredCompanyName,
                source: `contact:${sanitized.inquiryType}`,
                taskTitle: `Contact follow-up ${ticketId}`,
                taskBodyText: [
                    `Ticket: ${ticketId}`,
                    `Inquiry type: ${sanitized.inquiryType}`,
                    `Subject: ${sanitized.subject}`,
                    `Name: ${sanitized.name}`,
                    `Email: ${sanitized.email}`,
                    `Phone: ${sanitized.phone ?? 'N/A'}`,
                    `Company: ${inferredCompanyName ?? 'N/A'}`,
                    '',
                    sanitized.message,
                ].join('\n'),
            }),
            syncAndNotifySubscriberViaNovu({
                email: sanitized.email,
                fullName: sanitized.name,
                phone: sanitized.phone,
                source: `contact:${sanitized.inquiryType}`,
                title: 'Contact request received',
                message: `Thanks for reaching out to Hylono. Your request is recorded under ${ticketId} and we will review "${sanitized.subject}" shortly.`,
                data: {
                    ticketId,
                    company: sanitized.company ?? null,
                    inquiryType: sanitized.inquiryType,
                    subject: sanitized.subject,
                },
                payload: {
                    ticketId,
                    inquiryType: sanitized.inquiryType,
                    subject: sanitized.subject,
                    company: sanitized.company ?? null,
                },
            }),
        ]);

        const resendApiKey = env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.warn('[contact] RESEND_API_KEY missing; contact persisted without outbound notification', {
                ticketId,
            });

            return Response.json(
                {
                    success: true,
                    message: `Thank you, ${sanitized.name}! Your request has been received. We'll respond within 1 business day. Reference: ${ticketId}`,
                    ticketId,
                } satisfies ContactResponse,
                { status: 202 }
            );
        }

        const outboundMessage = [
            `From: ${sanitized.name} <${sanitized.email}>`,
            `Company: ${sanitized.company ?? 'N/A'}`,
            `Phone: ${sanitized.phone ?? 'N/A'}`,
            `Inquiry Type: ${sanitized.inquiryType}`,
            `Ticket: ${ticketId}`,
            '',
            sanitized.message,
        ].join('\n');

        const emailPayload: ResendSendPayload = {
            from: 'Hylono Contact <contact@hylono.eu>',
            to: ['contact@hylono.eu'],
            reply_to: sanitized.email,
            subject: `[${ticketId}] ${sanitized.subject}`,
            text: outboundMessage,
        };

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload),
        });

        if (!resendResponse.ok) {
            const resendErrorText = await resendResponse.text();
            console.error('[contact] Resend send failed', {
                ticketId,
                status: resendResponse.status,
                body: resendErrorText,
            });

            return Response.json(
                {
                    success: true,
                    message: `Thank you, ${sanitized.name}. Your request has been recorded under ${ticketId}; our team will follow up soon.`,
                    ticketId,
                } satisfies ContactResponse,
                { status: 202 }
            );
        }

        console.info(`[contact] Contact inquiry accepted: ticket=${ticketId}, type=${sanitized.inquiryType}`);

        return Response.json(
            {
                success: true,
                message: `Thank you, ${sanitized.name}! We'll respond within 1 business day. Reference: ${ticketId}`,
                ticketId,
            } satisfies ContactResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('[contact] Error processing contact form:', error);
        return Response.json(
            { success: false, message: 'An unexpected error occurred. Please try again.' } satisfies ContactResponse,
            { status: 500 }
        );
    }
}

export function GET(): Response {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
