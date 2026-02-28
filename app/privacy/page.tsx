import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { PrivacyClient } from './PrivacyClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'Review how Hylono processes, protects, and governs your data in line with GDPR principles.',
  path: '/privacy',
});

export default function PrivacyPageRoute() {
  return <PrivacyClient />;
}
