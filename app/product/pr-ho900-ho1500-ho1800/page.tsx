import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('pr-ho900-ho1500-ho1800');
}

export default function PrHo900Ho1500Ho1800Page() {
  return <HydrogenPremiumPage slug="pr-ho900-ho1500-ho1800" />;
}
