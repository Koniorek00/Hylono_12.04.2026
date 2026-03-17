import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { AccountClient } from './AccountClient';

// [DECISION: account route uses dynamic user session context and is treated as SSR by default runtime behavior; reverse if route is redesigned to fully static public profile content.]

export const metadata: Metadata = createPageMetadata({
  title: 'Account',
  description: 'Manage your Hylono account, profile details, and access settings in one place.',
  path: '/account',
  forceNoIndex: true,
});

export default function AccountPageRoute() {
  return <AccountClient />;
}
