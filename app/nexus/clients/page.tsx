import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Nexus } from '@/components/partner/Nexus';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus clients stays server-routed as a temporary public preview while the build-in-progress CRM surface remains noindex and interactive behavior stays in a client leaf.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Clients',
  description:
    'Preview client records, session history, and protocol adherence inside the Hylono Nexus clinic workspace while the build is in progress.',
  path: '/nexus/clients',
  forceNoIndex: true,
});

type NexusClientsPageSearchParams = Promise<{
  action?: string | string[];
  patient?: string | string[];
}>;

const getFirstParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function NexusClientsPageRoute({
  searchParams,
}: {
  searchParams: NexusClientsPageSearchParams;
}) {
  await connection();
  const resolvedSearchParams = await searchParams;
  const initialSelectedClientId = getFirstParamValue(resolvedSearchParams.patient);
  const initialRegistrationOpen =
    getFirstParamValue(resolvedSearchParams.action) === 'new';

  return (
    <Nexus
      initialSelectedClientId={initialSelectedClientId}
      initialRegistrationOpen={initialRegistrationOpen}
    />
  );
}
