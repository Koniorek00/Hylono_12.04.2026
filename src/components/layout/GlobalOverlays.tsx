'use client';

import { CookieConsent } from '../../../components/CookieConsent';
import { ExitIntent } from '../../../components/ExitIntent';
import { MultitoolContainer } from '../ui/Multitool';

export function GlobalOverlays() {
  return (
    <>
      <CookieConsent />
      <ExitIntent />
      <MultitoolContainer showFab={false} />
    </>
  );
}
