import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { AccountClient } from '../account/AccountClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Login',
  description: 'Sign in to access your Hylono account and continue to your protected dashboard area.',
  path: '/login',
});

export default function LoginPageRoute() {
  return <AccountClient />;
}