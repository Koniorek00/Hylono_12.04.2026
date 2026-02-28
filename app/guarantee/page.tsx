import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { GuaranteeClient } from './GuaranteeClient';

export const metadata: Metadata = createPageMetadata({
  title: '30-Day Guarantee',
  description: 'Review Hylono’s 30-day transformation guarantee, return eligibility, and warranty coverage details.',
  path: '/guarantee',
});

export default function GuaranteePageRoute() {
  return <GuaranteeClient />;
}