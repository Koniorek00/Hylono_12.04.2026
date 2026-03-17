import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Inter, Syncopate } from 'next/font/google';
import { siteEntity } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createOrganizationSchema, createWebSiteSchema } from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { Footer } from '@/src/components/layout/Footer';
import { GlobalOverlays } from '@/src/components/layout/GlobalOverlays';
import { Header } from '@/src/components/layout/Header';
import { RouteBreadcrumbs } from '@/src/components/layout/RouteBreadcrumbs';
import { ConsentAwareVercelTelemetry } from '@/src/components/providers/ConsentAwareVercelTelemetry';
import { Providers } from '@/src/components/providers/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const syncopate = Syncopate({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syncopate',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const DEFAULT_OG_IMAGE = '/og-image.svg';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06b6d4',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: siteEntity.name,
  manifest: '/site.webmanifest',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml', sizes: '180x180' }],
  },
  authors: [{ name: siteEntity.name, url: SITE_URL }],
  creator: siteEntity.name,
  publisher: siteEntity.name,
  title: {
    default: siteEntity.name,
    template: '%s | Hylono',
  },
  description: siteEntity.description,
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: siteEntity.name,
    title: siteEntity.name,
    description: siteEntity.description,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Hylono wellness technology systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hylono',
    creator: '@hylono',
    title: siteEntity.name,
    description: siteEntity.description,
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'Hylono wellness technology systems' }],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

interface RootLayoutContentProps {
  children: ReactNode;
}

function RootLayoutContent({ children }: RootLayoutContentProps) {
  const organizationSchema = createOrganizationSchema();
  const webSiteSchema = createWebSiteSchema();

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-organization" data={organizationSchema} />
        <StructuredData id="jsonld-website" data={webSiteSchema} />
      </Suspense>
      <Suspense fallback={null}>
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <RouteBreadcrumbs />
          <main className="relative z-0 pt-[72px] md:pt-[104px]">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Providers>
      </Suspense>
      <Suspense fallback={null}>
        <GlobalOverlays />
      </Suspense>
    </>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.className} ${syncopate.variable}`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Hylono Blog — Research Notes and Wellness Guidance"
          href={`${SITE_URL}/rss.xml`}
        />
      </head>
      <body className="antialiased">
        <noscript>
          <section
            aria-label="JavaScript disabled notice"
            className="mx-auto max-w-3xl px-6 py-10 text-slate-900"
          >
            <p className="text-2xl font-semibold">Hylono wellness platform</p>
            <p className="mt-3 text-base leading-7">
              JavaScript is currently disabled in your browser. Core page content can still be
              accessed, but some interactive features and guided flows require JavaScript.
            </p>
            <p className="mt-2 text-base leading-7">
              You can continue browsing key pages such as protocols, product details, research,
              rental options, and contact information.
            </p>
          </section>
        </noscript>
        <RootLayoutContent>{children}</RootLayoutContent>
        <ConsentAwareVercelTelemetry />
      </body>
    </html>
  );
}
