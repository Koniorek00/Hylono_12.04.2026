import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('os-h200-h300');
}

export default function OsH200H300Page() {
  return <HydrogenPremiumPage slug="os-h200-h300" />;
}
