'use client';

import { HelpCenterPage } from '@/components/HelpCenterPage';

type HelpTab = 'faq' | 'contact' | 'support';

export function HelpClient({ initialTab }: { initialTab: HelpTab }) {
  return <HelpCenterPage initialTab={initialTab} />;
}
