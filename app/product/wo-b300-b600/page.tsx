import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('wo-b300-b600');
}

export default function WoB300B600Page() {
  return <HydrogenPremiumPage slug="wo-b300-b600" />;
}
