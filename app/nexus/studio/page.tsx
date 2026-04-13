import type { Metadata } from 'next';
import { connection } from 'next/server';
import { PartnerStudio } from '@/components/partner/PartnerStudio';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus studio stays server-routed as a temporary public preview while the build-in-progress creation tool remains noindex and interactive behavior stays in a client leaf.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Studio',
  description:
    'Preview clinic-ready marketing assets, branded collateral, and campaign materials inside Hylono Nexus while the build is in progress.',
  path: '/nexus/studio',
  forceNoIndex: true,
});

type NexusStudioPageSearchParams = Promise<{
  action?: string | string[];
}>;

const getFirstParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function NexusStudioPageRoute({
  searchParams,
}: {
  searchParams: NexusStudioPageSearchParams;
}) {
  await connection();
  const resolvedSearchParams = await searchParams;

  return (
    <PartnerStudio
      startFresh={getFirstParamValue(resolvedSearchParams.action) === 'new'}
    />
  );
}
