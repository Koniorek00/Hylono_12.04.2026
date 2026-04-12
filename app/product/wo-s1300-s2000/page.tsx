import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('wo-s1300-s2000');
}

export default function WoS1300S2000Page() {
  return <HydrogenPremiumPage slug="wo-s1300-s2000" />;
}
