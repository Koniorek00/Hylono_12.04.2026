import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { WishlistClient } from './WishlistClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Wishlist',
  description: 'Save preferred Hylono products and revisit your shortlist whenever you are ready.',
  path: '/wishlist',
});

export default function WishlistPageRoute() {
  return <WishlistClient />;
}
