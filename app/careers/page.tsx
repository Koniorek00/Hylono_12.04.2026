import type { Metadata } from 'next';
import { CareersClient } from './CareersClient';
import { createPageMetadata } from '@/lib/seo-metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Careers | Hylono',
  description:
    'Explore Hylono careers information and contact the team about current opportunities.',
  path: '/careers',
  forceNoIndex: true,
});

// [DECISION: SSG because the careers route renders a static informational shell and remains noindex while not part of the canonical public SEO graph.]
// Rendering strategy: server-rendered wrapper around the existing client page so the route resolves without promoting it as indexable content.
export default function CareersPageRoute() {
  return <CareersClient />;
}
