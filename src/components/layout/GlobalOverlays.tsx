'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CookieConsent = dynamic(
  () =>
    import('../../../components/CookieConsent').then((module) => ({
      default: module.CookieConsent,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const MultitoolContainer = dynamic(
  () =>
    import('../ui/Multitool/MultitoolContainer').then((module) => ({
      default: module.MultitoolContainer,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function GlobalOverlays() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const schedule =
      'requestIdleCallback' in window
        ? window.requestIdleCallback.bind(window)
        : (callback: () => void) => window.setTimeout(callback, 400);
    const cancel =
      'cancelIdleCallback' in window
        ? window.cancelIdleCallback.bind(window)
        : (handle: number) => window.clearTimeout(handle);

    const handle = schedule(() => {
      setIsReady(true);
    });

    return () => {
      cancel(handle);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <CookieConsent />
      <MultitoolContainer showFab={false} />
    </>
  );
}
