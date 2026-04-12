import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  DEFAULT_AUTH_SUCCESS_PATH,
  resolveLoginRedirectPath,
} from '@/lib/auth-redirect';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Login',
  description: 'Sign in to access your Hylono account and continue to your protected dashboard area.',
  path: '/login',
  forceNoIndex: true,
});

// [DECISION: SSR because authentication entry experiences are user-state aware.]
export default async function LoginPageRoute({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    next?: string | string[];
  }>;
}) {
  const session = await auth();
  const resolvedSearchParams = await searchParams;
  const callbackPath = resolveLoginRedirectPath(resolvedSearchParams, {
    baseUrl: process.env.AUTH_URL ?? env.NEXTAUTH_URL ?? env.NEXT_PUBLIC_SITE_URL,
    fallbackPath: DEFAULT_AUTH_SUCCESS_PATH,
  });

  if (session?.user?.email) {
    redirect(callbackPath);
  }

  return <LoginClient callbackPath={callbackPath} />;
}
