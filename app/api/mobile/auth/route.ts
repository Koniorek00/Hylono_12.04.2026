import { z } from 'zod';
import {
  createRateLimitResponse,
  consumeRateLimit,
} from '@/app/api/_shared/rate-limit';
import {
  readJsonBody,
  validationErrorResponse,
} from '@/app/api/_shared/validation';
import { verifyConfiguredCredentials } from '@/lib/auth-credentials';
import {
  isMobileAuthConfigured,
  issueMobileAuthSession,
  type MobileAuthSessionResponse,
} from '@/lib/mobile-auth';

interface MobileAuthRouteResponse {
  success: boolean;
  message: string;
  session?: MobileAuthSessionResponse;
  fieldErrors?: Record<string, string[]>;
}

const mobileAuthSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter a password.'),
});

const MOBILE_AUTH_RATE_LIMIT = {
  bucket: 'mobile-auth',
  limit: 5,
  windowMs: 10 * 60 * 1000,
} as const;

export async function POST(request: Request): Promise<Response> {
  const rateLimitState = consumeRateLimit(request, MOBILE_AUTH_RATE_LIMIT);
  if (!rateLimitState.allowed) {
    return createRateLimitResponse(
      rateLimitState,
      'Too many sign-in attempts. Please wait a few minutes and try again.'
    );
  }

  if (!isMobileAuthConfigured()) {
    return Response.json(
      {
        success: false,
        message: 'Mobile auth is not configured on this deployment.',
      } satisfies MobileAuthRouteResponse,
      { status: 503 }
    );
  }

  const rawBody = await readJsonBody(request);
  const parsed = mobileAuthSchema.safeParse(rawBody);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const verification = verifyConfiguredCredentials(parsed.data);

  if (verification.status === 'not_configured') {
    return Response.json(
      {
        success: false,
        message: 'Mobile auth is not configured on this deployment.',
      } satisfies MobileAuthRouteResponse,
      { status: 503 }
    );
  }

  if (verification.status !== 'success') {
    return Response.json(
      {
        success: false,
        message: 'Invalid email or password.',
      } satisfies MobileAuthRouteResponse,
      { status: 401 }
    );
  }

  const session = issueMobileAuthSession({
    email: verification.email,
    name: verification.name,
  });

  if (!session) {
    return Response.json(
      {
        success: false,
        message: 'Mobile auth is not configured on this deployment.',
      } satisfies MobileAuthRouteResponse,
      { status: 503 }
    );
  }

  return Response.json(
    {
      success: true,
      message: 'Mobile session ready.',
      session,
    } satisfies MobileAuthRouteResponse,
    { status: 200 }
  );
}
