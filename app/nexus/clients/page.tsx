import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Nexus } from '@/components/partner/Nexus';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus clients is a private clinic CRM surface rendered server-first with a client module for filtering and record interaction.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Clients',
  description:
    'Review client records, session history, and protocol adherence inside the Hylono Nexus clinic workspace.',
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
