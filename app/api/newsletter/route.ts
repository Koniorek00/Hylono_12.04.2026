/**
 * POST /api/newsletter
 * Handles newsletter subscription requests.
 * Validates input, sanitizes email, and stores/forwards to email provider.
 */

import { z } from 'zod';
import { readJsonBody, validationErrorResponse } from '../_shared/validation';

interface NewsletterRequest {
    email: string;
    firstName?: string;
    source?: string; // e.g. "footer", "exit-intent", "blog"
}

interface NewsletterResponse {
    success: boolean;
    message: string;
}

const newsletterSchema = z.object({
    email: z.string().trim().email('Please enter a valid email address.').max(254, 'Email address is too long.'),
    firstName: z.string().trim().max(100).optional(),
    source: z.string().trim().max(100).optional().default('unknown'),
}) satisfies z.ZodType<NewsletterRequest>;

export async function POST(request: Request): Promise<Response> {
    try {
        const rawBody = await readJsonBody(request);
        const parsed = newsletterSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const { email, source = 'unknown' } = parsed.data;
        const sanitizedEmail = email.trim().toLowerCase();

        // --- Send to email provider ---
        // TODO: Replace this block with your actual email provider integration.
        // Options:
        //   - Mailchimp: POST to /3.0/lists/{list_id}/members
        //   - Resend: POST to /audiences/{audience_id}/contacts
        //   - Brevo (Sendinblue): POST to /contacts
        //
        // Example with Resend:
        // const resendApiKey = process.env.RESEND_API_KEY;
        // const audienceId = process.env.RESEND_AUDIENCE_ID;
        // await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${resendApiKey}`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: sanitizedEmail,
        //         first_name: firstName?.trim(),
        //         unsubscribed: false,
        //     }),
        // });

        // Log for now (remove when real provider is wired)
        console.warn(`[newsletter] New subscription: ${sanitizedEmail} via ${source}`);

        return Response.json(
            { success: true, message: 'Thank you for subscribing! Check your inbox to confirm.' } satisfies NewsletterResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('[newsletter] Error processing subscription:', error);
        return Response.json(
            { success: false, message: 'An unexpected error occurred. Please try again.' } satisfies NewsletterResponse,
            { status: 500 }
        );
    }
}

// Reject non-POST methods
export function GET(): Response {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
