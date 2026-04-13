import arcjet, { detectBot, fixedWindow, shield } from '@arcjet/next';
import NextAuth from 'next-auth';
import { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { verifyConfiguredCredentials } from '@/lib/auth-credentials';
import {
  DEFAULT_AUTH_SUCCESS_PATH,
  getSafeAuthRedirectUrl,
} from '@/lib/auth-redirect';
import { env } from '@/lib/env';
import { resolveAuthSecret } from '@/lib/auth-secret';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const ARCJET_KEY = env.ARCJET_KEY;
const ARCJET_MODE = ARCJET_KEY ? 'LIVE' : 'DRY_RUN';
const SIGN_IN_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
} as const;

class AccessDeniedCredentialsSignin extends CredentialsSignin {
  code = 'access_denied';
}

class RateLimitedCredentialsSignin extends CredentialsSignin {
  code = 'rate_limited';
}

interface SignInRateLimitEntry {
  count: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __hylonoSignInRateLimitStore:
    | Map<string, SignInRateLimitEntry>
    | undefined;
}

const signInProtection = ARCJET_KEY
  ? arcjet({
      key: ARCJET_KEY,
      characteristics: ['ip.src'],
      rules: [
        shield({ mode: ARCJET_MODE }),
        detectBot({ mode: ARCJET_MODE, allow: [] }),
        fixedWindow({ mode: ARCJET_MODE, window: '10m', max: 10 }),
      ],
    })
  : null;

const getSignInRateLimitStore = (): Map<string, SignInRateLimitEntry> => {
  if (!globalThis.__hylonoSignInRateLimitStore) {
    globalThis.__hylonoSignInRateLimitStore = new Map<
      string,
      SignInRateLimitEntry
    >();
  }

  return globalThis.__hylonoSignInRateLimitStore;
};

const getRequestIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
};

const consumeSignInRateLimit = (
  request: Request,
  email: string
): { allowed: boolean; retryAfterSeconds: number } => {
  const store = getSignInRateLimitStore();
  const now = Date.now();
  const key = `${getRequestIp(request)}:${email}`;
  const existingEntry = store.get(key);

  const entry =
    existingEntry && existingEntry.resetAt > now
      ? existingEntry
      : { count: 0, resetAt: now + SIGN_IN_RATE_LIMIT.windowMs };

  entry.count += 1;
  store.set(key, entry);

  return {
    allowed: entry.count <= SIGN_IN_RATE_LIMIT.limit,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1000)
    ),
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  secret: resolveAuthSecret({
    explicitSecret: process.env.AUTH_SECRET ?? env.NEXTAUTH_SECRET,
    nodeEnv: env.NODE_ENV,
    allowProductionFallback: process.env.VERCEL !== '1',
  }),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials, request) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const verification = verifyConfiguredCredentials(parsed.data);

        if (verification.status === 'not_configured') {
          console.warn('[auth] Credentials provider is disabled: missing auth env configuration.');
          return null;
        }

        const normalizedEmail = parsed.data.email.trim().toLowerCase();
        const rateLimitState = consumeSignInRateLimit(request, normalizedEmail);

        if (!rateLimitState.allowed) {
          console.warn('[auth] Sign-in rate limit exceeded.', {
            email: normalizedEmail,
            retryAfterSeconds: rateLimitState.retryAfterSeconds,
          });
          throw new RateLimitedCredentialsSignin();
        }

        if (signInProtection) {
          const decision = await signInProtection.protect(request);

          if (decision.isDenied()) {
            console.warn('[auth] Sign-in denied by Arcjet.', {
              email: normalizedEmail,
              conclusion: decision.conclusion,
            });
            throw new AccessDeniedCredentialsSignin();
          }
        }

        if (verification.status !== 'success') {
          return null;
        }

        return {
          id: verification.email,
          email: verification.email,
          name: verification.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return getSafeAuthRedirectUrl(
        url,
        baseUrl,
        DEFAULT_AUTH_SUCCESS_PATH
      );
    },
  },
  trustHost:
    env.NODE_ENV !== 'production' ||
    process.env.VERCEL === '1' ||
    process.env.AUTH_TRUST_HOST === 'true' ||
    Boolean(process.env.AUTH_URL ?? env.NEXTAUTH_URL),
});
