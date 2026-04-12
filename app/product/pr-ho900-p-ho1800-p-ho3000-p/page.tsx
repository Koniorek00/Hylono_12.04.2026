import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('pr-ho900-p-ho1800-p-ho3000-p');
}

export default function PrHo900PHo1800PHo3000PPage() {
  return <HydrogenPremiumPage slug="pr-ho900-p-ho1800-p-ho3000-p" />;
}
