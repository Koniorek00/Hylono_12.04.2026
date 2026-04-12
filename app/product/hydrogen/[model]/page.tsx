import { notFound, permanentRedirect } from 'next/navigation';
import {
  getHydrogenPremiumPath,
  hydrogenPremiumAliasToSlug,
} from '@/content/hydrogen-premium-2026';

type Params = Promise<{ model: string }>;

// [DECISION: SSG alias route that permanently consolidates legacy hydrogen model paths onto the new dedicated static PDPs.]

export function generateStaticParams() {
  return Object.keys(hydrogenPremiumAliasToSlug).map((model) => ({ model }));
}

export default async function HydrogenModelAliasPage({ params }: { params: Params }) {
  const { model } = await params;
  const targetSlug = hydrogenPremiumAliasToSlug[model.toLowerCase()];

  if (!targetSlug) {
    notFound();
  }

  permanentRedirect(getHydrogenPremiumPath(targetSlug));
}
