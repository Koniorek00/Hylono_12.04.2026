import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ProtocolsClient } from './ProtocolsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Protocols',
  description: 'Explore structured Hylono usage protocols for recovery, stress, sleep, and vitality goals.',
  path: '/protocols',
});

export default function ProtocolsPageRoute() {
  return <ProtocolsClient />;
}
