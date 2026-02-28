import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description: 'Learn about Hylono’s mission, values, and team behind regenerative wellness technology.',
  path: '/about',
});

export default function AboutPageRoute() {
  return <AboutClient />;
}
