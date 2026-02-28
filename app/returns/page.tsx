import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ReturnsClient } from './ReturnsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Returns & Refunds',
  description: 'Read Hylono return eligibility, collection flow, and refund processing timelines for device purchases.',
  path: '/returns',
});

export default function ReturnsPageRoute() {
  return <ReturnsClient />;
}