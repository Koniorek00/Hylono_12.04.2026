import { HydrogenPremiumPage, buildHydrogenPremiumMetadata } from '@/components/product/hydrogen-premium/HydrogenPremiumPage';

// [DECISION: SSG because this product page is a fixed, indexable hydrogen PDP with stable product data.]

export function generateMetadata() {
  return buildHydrogenPremiumMetadata('za-ho3000-ho3600');
}

export default function ZaHo3000Ho3600Page() {
  return <HydrogenPremiumPage slug="za-ho3000-ho3600" />;
}
