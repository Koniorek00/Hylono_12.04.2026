import type { ReactNode } from 'react';
import { requireAuthenticatedSession } from '@/lib/auth-guard';

// [DECISION: account layout stays server-enforced because private account content must not render without a verified session.]
export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuthenticatedSession('/account');
  return children;
}
