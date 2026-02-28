'use client';

import dynamic from 'next/dynamic';

const PartnerLocator = dynamic(
  () => import('@/components/PartnerLocator').then((mod) => mod.PartnerLocator),
  { ssr: false },
);

export function LocatorClient() {
  return <PartnerLocator />;
}
