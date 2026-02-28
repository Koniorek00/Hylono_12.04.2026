import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { SupportClient } from './SupportClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Support',
  description: 'Get device support, troubleshooting guidance, and direct help from the Hylono support team.',
  path: '/support',
});

export default function SupportPageRoute() {
  return <SupportClient />;
}
