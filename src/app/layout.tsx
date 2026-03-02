import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { connection } from 'next/server';
import { env } from '@/lib/env';
import './globals.css';
import { Providers } from '../components/providers/Providers';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { GlobalOverlays } from '../components/layout/GlobalOverlays';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Hylono',
  description: 'Hylono bio-optimization systems and wellness technologies.',
};

interface RootLayoutProps {
  children: ReactNode;
}

interface RootLayoutContentProps {
  children: ReactNode;
}

async function RootLayoutContent({ children }: RootLayoutContentProps) {
  await connection();

  return (
    <>
      <Providers>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </Providers>
      <Suspense fallback={null}>
        <GlobalOverlays />
      </Suspense>
    </>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <noscript>
          <main className="mx-auto max-w-3xl px-6 py-10 text-slate-900">
            <h1 className="text-2xl font-semibold">Hylono wellness platform</h1>
            <p className="mt-3 text-base leading-7">
              JavaScript is currently disabled in your browser. Core page content can still be
              accessed, but some interactive features and guided flows require JavaScript.
            </p>
            <p className="mt-2 text-base leading-7">
              You can continue browsing key pages such as protocols, product details, research,
              rental options, and contact information.
            </p>
          </main>
        </noscript>
        <Suspense fallback={null}>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
