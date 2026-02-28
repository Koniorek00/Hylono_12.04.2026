import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { CookiePolicyClient } from './CookiePolicyClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Cookie Policy',
  description: 'Understand how Hylono uses essential and analytics cookies, and how to control your cookie preferences.',
  path: '/cookie-policy',
});

export default function CookiePolicyPageRoute() {
  return <CookiePolicyClient />;
}