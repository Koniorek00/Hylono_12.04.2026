import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { env } from '@/lib/env';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  secret:
    env.NEXTAUTH_SECRET ??
    (env.NODE_ENV === 'development'
      ? 'hylono-dev-auth-secret-change-in-production'
      : undefined),
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

        return {
          id: parsed.data.email,
          email: parsed.data.email,
          name: parsed.data.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  trustHost: true,
});