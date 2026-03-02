/**
 * POST /api/contact
 * Handles contact form submissions.
 * Validates input, sanitizes fields, and sends notification email.
 */

import { z } from 'zod';
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
            email: email.trim().toLowerCase(),
            subject: subject ? sanitizeText(subject, 200) : `Contact: ${inquiryType}`,
            message: sanitizeText(message, 5000),
            phone: phone ? sanitizeText(phone, 30) : undefined,
            company: company ? sanitizeText(company, 100) : undefined,
            inquiryType,
        };

        // Generate a simple ticket ID for tracking
        const ticketId = `HYL-${Date.now().toString(36).toUpperCase()}`;

        // --- Send notification email ---
        // TODO: Replace with your transactional email provider (Resend, Postmark, SendGrid).
        //
        // Example with Resend:
        // const resendApiKey = env.RESEND_API_KEY;
        // await fetch('https://api.resend.com/emails', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${resendApiKey}`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         from: 'noreply@hylono.com',
        //         to: 'hello@hylono.com',
        //         reply_to: sanitized.email,
        //         subject: `[${ticketId}] ${sanitized.subject}`,
        //         text: `
        //             From: ${sanitized.name} <${sanitized.email}>
        //             Company: ${sanitized.company ?? 'N/A'}
        //             Phone: ${sanitized.phone ?? 'N/A'}
        //             Inquiry Type: ${sanitized.inquiryType}
        //             Ticket: ${ticketId}
        //
        //             ${sanitized.message}
        //         `,
        //     }),
        // });

        console.warn(`[contact] New inquiry ${ticketId} from ${sanitized.email} (${sanitized.inquiryType})`);

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
