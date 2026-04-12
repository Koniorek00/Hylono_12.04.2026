import type { ReactNode } from 'react';
import { requireAuthenticatedSession } from '@/lib/auth-guard';

// [DECISION: nexus layout stays server-enforced because partner workspace routes must not render without a verified session.]
export default async function NexusLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuthenticatedSession('/nexus');
  return children;
}
