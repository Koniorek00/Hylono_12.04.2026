import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { AccountClient } from './AccountClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Account',
  description: 'Manage your Hylono account, profile details, and access settings in one place.',
  path: '/account',
});

export default function AccountPageRoute() {
  return <AccountClient />;
}
