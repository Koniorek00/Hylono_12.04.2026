/**
 * POST /api/booking
 * Handles consultation/demo booking requests.
 * Validates input and creates a booking record.
 */

import { z } from 'zod';
import { env } from '@/lib/env';
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

function isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    // Must be in the future
    return date > new Date();
}

const bookingSchema = z.object({
    name: z.string().trim().min(2, 'Please enter your full name.').max(100),
    email: z.string().trim().email('Please enter a valid email address.'),
    phone: z.string().trim().max(30).optional(),
    preferredDate: z.string().trim().optional().refine((date) => !date || isValidDate(date), {
        message: 'Preferred date must be a future date.',
    }),
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
            email: email.trim().toLowerCase(),
            phone: phone ? sanitizeText(phone, 30) : undefined,
            preferredDate,
            preferredTime,
            timezone,
            techInterest: techInterest ? sanitizeText(techInterest, 50) : undefined,
            notes: notes ? sanitizeText(notes, 1000) : undefined,
            bookingType,
        };

        // Generate booking reference
        const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}`;

        if (!env.DATABASE_URL) {
            return Response.json(
                {
                    success: false,
                    message: 'Booking endpoint is not implemented on this environment.',
                } satisfies BookingResponse,
                { status: 501 }
            );
        }

        // --- Create booking record ---
        // TODO: Integrate with your calendar/booking system.
        // Options:
        //   - Calendly API: Create an invitee for a specific event type
        //   - Cal.com API: Create a booking
        //   - Google Calendar API: Create an event with attendee
        //   - Store in Prisma DB: await prisma.booking.create({ data: { ...sanitized, ref: bookingRef } })
        //
        // Also send confirmation email to the customer:
        // await sendEmail({
        //     to: sanitized.email,
        //     subject: `[${bookingRef}] Your Hylono consultation is confirmed`,
        //     template: 'booking-confirmation',
        //     data: { name: sanitized.name, date: sanitized.preferredDate, ref: bookingRef },
        // });

        console.info(`[booking] Booking request accepted ${bookingRef}: ${sanitized.bookingType} for ${sanitized.email}`);

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
