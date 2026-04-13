import type { ReactNode } from 'react';

// [DECISION: nexus layout stays server-rendered without a global auth gate so the temporary /nexus preview can stay public while private child tools enforce authentication individually.]
export default function NexusLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
