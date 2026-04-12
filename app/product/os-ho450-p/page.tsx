import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('os-ho450-p');
}

export default function OsHo450PPage() {
  return <HydrogenPremiumPage slug="os-ho450-p" />;
}
