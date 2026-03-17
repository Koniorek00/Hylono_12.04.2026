/**
 * POST /api/booking
 * Handles consultation/demo booking requests.
 * Validates input and creates a booking record.
 */

import { z } from 'zod';
import { env } from '@/lib/env';
import { bookingRequestsTable } from '@/lib/db/schema';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { readJsonBody, sanitizeText, validationErrorResponse } from '../_shared/validation';

interface BookingRequest {
    name: string;
    email: string;
    phone?: string;
    preferredDate?: string; // ISO date string
    preferredTime?: string; // e.g. "10:00", "14:30"
    timezone?: string;
    techInterest?: string; // e.g. "HBOT", "PEMF", "RLT", "HYDROGEN"
    notes?: string;
    bookingType?: 'consultation' | 'demo' | 'rental-inquiry' | 'b2b';
}

interface BookingResponse {
    success: boolean;
    message: string;
    bookingRef?: string;
}

interface ResendSendPayload {
    from: string;
    to: string[];
    reply_to: string;
    subject: string;
    text: string;
}

const bookingSchema = z.object({
    name: z.string().trim().min(2, 'Please enter your full name.').max(100),
    email: z.string().trim().email('Please enter a valid email address.'),
    phone: z.string().trim().max(30).optional(),
    preferredDate: z.string().trim().max(100).optional(),
    preferredTime: z.string().trim().max(20).optional(),
    timezone: z.string().trim().max(80).optional().default('Europe/Amsterdam'),
    techInterest: z.string().trim().max(50).optional(),
    notes: z.string().trim().max(1000).optional(),
    bookingType: z.enum(['consultation', 'demo', 'rental-inquiry', 'b2b']).optional().default('consultation'),
}) satisfies z.ZodType<BookingRequest>;

export async function POST(request: Request): Promise<Response> {
    try {
        const rawBody = await readJsonBody(request);
        const parsed = bookingSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const body = parsed.data;
        const {
            name,
            email,
            phone,
            preferredDate,
            preferredTime,
            timezone = 'Europe/Amsterdam',
            techInterest,
            notes,
            bookingType = 'consultation',
        } = body;

        // --- Sanitize ---
        const sanitized = {
            name: sanitizeText(name, 100),
            email: sanitizeText(email, {
                maxLength: 254,
                context: 'email',
            }),
            phone: phone
                ? sanitizeText(phone, {
                    maxLength: 30,
                    context: 'phone',
                })
                : undefined,
            preferredDate,
            preferredTime,
            timezone,
            techInterest: techInterest ? sanitizeText(techInterest, 50) : undefined,
            notes: notes
                ? sanitizeText(notes, {
                    maxLength: 1000,
                    context: 'multiline',
                })
                : undefined,
            bookingType,
        };

        // Generate booking reference
        const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}`;

        if (!isDatabaseConfigured()) {
            console.error('[booking] DATABASE_URL missing; cannot persist booking request', {
                bookingRef,
            });

            return Response.json(
                {
                    success: false,
                    message: 'Booking channel is temporarily unavailable. Please try again shortly.',
                } satisfies BookingResponse,
                { status: 503 }
            );
        }

        const db = getDb();
        await db.insert(bookingRequestsTable).values({
            id: crypto.randomUUID(),
            bookingRef,
            name: sanitized.name,
            email: sanitized.email,
            phone: sanitized.phone,
            preferredDate: sanitized.preferredDate,
            preferredTime: sanitized.preferredTime,
            timezone: sanitized.timezone,
            techInterest: sanitized.techInterest,
            notes: sanitized.notes,
            bookingType: sanitized.bookingType,
        });

        const resendApiKey = env.RESEND_API_KEY;
        if (!resendApiKey) {
            return Response.json(
                {
                    success: true,
                    message: `Booking request received! Reference: ${bookingRef}. We'll confirm your slot within 24 hours.`,
                    bookingRef,
                } satisfies BookingResponse,
                { status: 202 }
            );
        }

        const bookingSummary = [
            `Booking reference: ${bookingRef}`,
            `Type: ${sanitized.bookingType}`,
            `Customer: ${sanitized.name} <${sanitized.email}>`,
            `Phone: ${sanitized.phone ?? 'N/A'}`,
            `Preferred date: ${sanitized.preferredDate ?? 'N/A'}`,
            `Preferred time: ${sanitized.preferredTime ?? 'N/A'}`,
            `Timezone: ${sanitized.timezone ?? 'N/A'}`,
            `Technology interest: ${sanitized.techInterest ?? 'N/A'}`,
            '',
            `Notes: ${sanitized.notes ?? 'N/A'}`,
        ].join('\n');

        const emailPayload: ResendSendPayload = {
            from: 'Hylono Booking <contact@hylono.eu>',
            to: ['contact@hylono.eu'],
            reply_to: sanitized.email,
            subject: `[${bookingRef}] ${sanitized.bookingType} request`,
            text: bookingSummary,
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
            console.error('[booking] Resend send failed', {
                bookingRef,
                status: resendResponse.status,
                body: resendErrorText,
            });

            return Response.json(
                {
                    success: true,
                    message: `Booking request received! Reference: ${bookingRef}. We'll confirm your slot within 24 hours.`,
                    bookingRef,
                } satisfies BookingResponse,
                { status: 202 }
            );
        }

        console.info(`[booking] Booking request accepted: ref=${bookingRef}, type=${sanitized.bookingType}`);

        return Response.json(
            {
                success: true,
                message: `Booking request received! Reference: ${bookingRef}. We'll confirm your slot within 24 hours.`,
                bookingRef,
            } satisfies BookingResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('[booking] Error processing booking:', error);
        return Response.json(
            { success: false, message: 'An unexpected error occurred. Please try again.' } satisfies BookingResponse,
            { status: 500 }
        );
    }
}

export function GET(): Response {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
