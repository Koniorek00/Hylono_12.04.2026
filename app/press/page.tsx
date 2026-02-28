import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { PressClient } from './PressClient';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Press & Media',
  description: 'Access Hylono press releases, media assets, and company facts for editorial coverage.',
  path: '/press',
});

export default function PressPageRoute() {
  return <PressClient />;
}
