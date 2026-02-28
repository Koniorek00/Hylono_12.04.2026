import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/providers/Providers';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { GlobalOverlays } from '../components/layout/GlobalOverlays';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Hylono',
  description: 'Hylono bio-optimization systems and wellness technologies.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <GlobalOverlays />
      </body>
    </html>
  );
}
