'use client';

import { Footer as LegacyFooter } from '../../../components/Layout';

export function Footer() {
  return <LegacyFooter setCurrentPage={() => {
    // Navigation migration is handled in a later step.
  }} />;
}
