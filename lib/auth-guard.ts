import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { buildLoginRedirectPath } from '@/lib/auth-redirect';

export async function requireAuthenticatedSession(pathname: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(buildLoginRedirectPath(pathname));
  }

  return session;
}
