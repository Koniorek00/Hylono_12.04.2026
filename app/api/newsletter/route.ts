/**
 * POST /api/newsletter
 * Handles newsletter subscription requests.
 * Validates input, sanitizes email, and stores/forwards to email provider.
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';
import { ensureDatabaseReady, getDb, isDatabaseConfigured } from '@/lib/db/client';
import { newsletterSubscriptionsTable } from '@/lib/db/schema';
import { dispatchIntakeEventToN8n } from '@/lib/integrations/n8n';
import { syncAndNotifySubscriberViaNovu } from '@/lib/integrations/novu';
import { syncPersonToTwenty } from '@/lib/integrations/twenty';
import { fetchWithTimeout } from '../_shared/http';
import { consumeRateLimit, createRateLimitResponse } from '../_shared/rate-limit';
import { readJsonBody, sanitizeText, validationErrorResponse } from '../_shared/validation';

interface NewsletterRequest {
    email: string;
    firstName?: string;
    source?: string; // e.g. "footer", "exit-intent", "blog"
}

interface NewsletterResponse {
    success: boolean;
    message: string;
}

interface ResendAudiencePayload {
    email: string;
    first_name?: string;
    unsubscribed: boolean;
}

const newsletterSchema = z.object({
    email: z.string().trim().email('Please enter a valid email address.').max(254, 'Email address is too long.'),
    firstName: z.string().trim().max(100).optional(),
    source: z.string().trim().max(100).optional().default('unknown'),
}) satisfies z.ZodType<NewsletterRequest>;

const NEWSLETTER_RATE_LIMIT = {
    bucket: 'newsletter',
    limit: 8,
    windowMs: 10 * 60 * 1000,
} as const;

export async function POST(request: Request): Promise<Response> {
    try {
        const rateLimitState = consumeRateLimit(request, NEWSLETTER_RATE_LIMIT);
        if (!rateLimitState.allowed) {
            return createRateLimitResponse(
                rateLimitState,
                'Too many newsletter requests. Please wait a few minutes and try again.'
            );
        }

        const rawBody = await readJsonBody(request);
        const parsed = newsletterSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const { email, firstName, source = 'unknown' } = parsed.data;

        const sanitizedEmail = sanitizeText(email, {
            maxLength: 254,
            context: 'email',
        });
        const sanitizedFirstName = firstName?.trim()
            ? sanitizeText(firstName, 100)
            : undefined;

        if (!isDatabaseConfigured()) {
            console.error('[newsletter] DATABASE_URL missing; cannot persist subscription');
            return Response.json(
                {
                    success: false,
                    message: 'Newsletter subscription is temporarily unavailable. Please try again shortly.',
                } satisfies NewsletterResponse,
                { status: 503 }
            );
        }

        await ensureDatabaseReady();
        const db = getDb();

        const persistedAt = new Date();

        await db
            .insert(newsletterSubscriptionsTable)
            .values({
                id: crypto.randomUUID(),
                email: sanitizedEmail,
                firstName: sanitizedFirstName,
                source,
                providerSynced: false,
                updatedAt: persistedAt,
            })
            .onConflictDoUpdate({
                target: newsletterSubscriptionsTable.email,
                set: {
                    firstName: sanitizedFirstName,
                    source,
                    providerSynced: false,
                    updatedAt: persistedAt,
                },
            });

        const resendApiKey = env.RESEND_API_KEY;
        const resendAudienceId = env.RESEND_AUDIENCE_ID;

        let providerSynced = false;

        if (resendApiKey && resendAudienceId) {
            const audiencePayload: ResendAudiencePayload = {
                email: sanitizedEmail,
                ...(sanitizedFirstName ? { first_name: sanitizedFirstName } : {}),
                unsubscribed: false,
            };

            try {
                const audienceResponse = await fetchWithTimeout(
                    `https://api.resend.com/audiences/${resendAudienceId}/contacts`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(audiencePayload),
                    }
                );

                if (!audienceResponse.ok && audienceResponse.status !== 409) {
                    const audienceErrorText = await audienceResponse.text();
                    console.error('[newsletter] Resend audience upsert failed', {
                        source,
                        status: audienceResponse.status,
                        body: audienceErrorText,
                    });
                } else {
                    providerSynced = true;
                }
            } catch (error) {
                console.error('[newsletter] Resend audience upsert failed', {
                    source,
                    error,
                });
            }
        }

        const updatedAt = new Date();

        await db
            .update(newsletterSubscriptionsTable)
            .set({
                providerSynced,
                updatedAt,
            })
            .where(eq(newsletterSubscriptionsTable.email, sanitizedEmail));

        await Promise.allSettled([
            dispatchIntakeEventToN8n({
                target: 'newsletter',
                eventType: 'newsletter.subscribed',
                payload: {
                    email: sanitizedEmail,
                    firstName: sanitizedFirstName,
                    providerSynced,
                    source,
                },
            }),
            syncPersonToTwenty({
                email: sanitizedEmail,
                firstName: sanitizedFirstName,
                source: `newsletter:${source}`,
            }),
            syncAndNotifySubscriberViaNovu({
                email: sanitizedEmail,
                firstName: sanitizedFirstName,
                source: `newsletter:${source}`,
                title: 'Newsletter subscription confirmed',
                message: `You are subscribed to Hylono updates from the ${source} flow. We will use this channel for product, protocol, and research updates.`,
                data: {
                    providerSynced,
                    source,
                },
                payload: {
                    providerSynced,
                    source,
                },
            }),
        ]);

        // Non-PII operational log (keep for observability until provider integration is wired)
        console.info(`[newsletter] Subscription accepted: source=${source}`);

        const responseStatus = providerSynced ? 200 : 202;
        const responseMessage = providerSynced
            ? 'You are subscribed to Hylono updates.'
            : 'Your subscription request is saved, but email delivery sync is temporarily delayed.';

        return Response.json(
            { success: true, message: responseMessage } satisfies NewsletterResponse,
            { status: responseStatus }
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
