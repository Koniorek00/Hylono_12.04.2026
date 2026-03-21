import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { env } from '@/lib/env';
import { resolveAuthSecret } from '@/lib/auth-secret';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const PASSWORD_HASH_PREFIX = 'scrypt';

const verifyScryptPassword = (
  password: string,
  encodedHash: string
): boolean => {
  const [prefix, salt, hashHex] = encodedHash.split('$');

  if (
    prefix !== PASSWORD_HASH_PREFIX ||
    typeof salt !== 'string' ||
    typeof hashHex !== 'string' ||
    !salt ||
    !hashHex
  ) {
    return false;
  }

  try {
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(hashHex, 'hex');

    if (derived.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  secret: resolveAuthSecret({
    explicitSecret: env.NEXTAUTH_SECRET,
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
      authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const expectedEmail = env.AUTH_CREDENTIALS_EMAIL;
        const expectedHash = env.AUTH_CREDENTIALS_PASSWORD_HASH;

        if (!expectedEmail || !expectedHash) {
          console.warn('[auth] Credentials provider is disabled: missing auth env configuration.');
          return null;
        }

        const normalizedEmail = parsed.data.email.trim().toLowerCase();
        const normalizedExpectedEmail = expectedEmail.trim().toLowerCase();

        if (normalizedEmail !== normalizedExpectedEmail) {
          return null;
        }

        const isValidPassword = verifyScryptPassword(
          parsed.data.password,
          expectedHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: normalizedExpectedEmail,
          email: normalizedExpectedEmail,
          name: 'Hylono User',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  trustHost: true,
});
