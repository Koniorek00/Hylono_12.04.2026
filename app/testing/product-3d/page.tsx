import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import Product3DAssetLab from './Product3DAssetLab';

export const metadata: Metadata = createPageMetadata({
  title: 'Product 3D Asset Test | Hylono',
  description:
    'Private Hylono test page for a best-effort rotatable pseudo-3D product asset generated from a single supplied PNG image.',
  path: '/testing/product-3d',
  forceNoIndex: true,
});

// [DECISION: SSG because this is a private noindex lab route with a static server shell and an isolated client-side interaction leaf.]
export default function Product3DTestPage() {
  return <Product3DAssetLab />;
}
