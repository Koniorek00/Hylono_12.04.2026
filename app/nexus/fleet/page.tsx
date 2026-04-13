import type { Metadata } from 'next';
import { connection } from 'next/server';
import { FleetHealth } from '@/components/partner/FleetHealth';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus fleet stays server-routed as a temporary public preview while the build-in-progress operations dashboard remains noindex and interactive behavior stays in a client leaf.]
// Rendering strategy: request-time server routing via `connection()` keeps fleet operations session-aware while maintenance interactions stay inside the client leaf.

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Fleet',
  description:
    'Preview device status, maintenance logs, and service health across the Hylono clinic fleet while the build is in progress.',
  path: '/nexus/fleet',
  forceNoIndex: true,
});

type NexusFleetPageSearchParams = Promise<{
  action?: string | string[];
  device?: string | string[];
}>;

const getFirstParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function NexusFleetPageRoute({
  searchParams,
}: {
  searchParams: NexusFleetPageSearchParams;
}) {
  await connection();
  const resolvedSearchParams = await searchParams;

  return (
    <FleetHealth
      initialSelectedDeviceId={getFirstParamValue(resolvedSearchParams.device)}
      initialLogAction={getFirstParamValue(resolvedSearchParams.action) === 'log'}
    />
  );
}
