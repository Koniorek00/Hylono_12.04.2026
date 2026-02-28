import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { HelpClient } from './HelpClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Help Center',
  description: 'Access FAQs, contact support, and device assistance in the Hylono Help Center.',
  path: '/help',
});

type HelpTab = 'faq' | 'contact' | 'support';

const isHelpTab = (value: string): value is HelpTab => {
  return value === 'faq' || value === 'contact' || value === 'support';
};

export default async function HelpPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab;
  const initialTab: HelpTab = tab && isHelpTab(tab) ? tab : 'faq';

  return <HelpClient initialTab={initialTab} />;
}
