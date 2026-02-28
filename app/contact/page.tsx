import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description: 'Contact Hylono support and speak with our bio-optimization specialists.',
  path: '/contact',
});

export default function ContactPageRoute() {
  return <ContactClient />;
}
