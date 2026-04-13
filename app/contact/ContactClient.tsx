'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { buildContactPrefill } from '@/lib/contact-prefill';
import { ContactPage } from '../../components/ContactPage';

export function ContactClient() {
  const searchParams = useSearchParams();
  const prefill = useMemo(() => buildContactPrefill(searchParams), [searchParams]);

  return <ContactPage prefill={prefill} />;
}
