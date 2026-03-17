import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Login',
  description: 'Sign in to access your Hylono account and continue to your protected dashboard area.',
  path: '/login',
  forceNoIndex: true,
});

// [DECISION: SSR because authentication entry experiences are user-state aware.]
export default function LoginPageRoute() {
  return <LoginClient />;
}
