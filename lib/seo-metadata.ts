import type { Metadata } from 'next';
import { env } from '@/lib/env';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const OG_IMAGE_PATH = '/og-image.svg';

interface CreatePageMetadataInput {
  title: string;
  description: string;
  path: string;
  forceNoIndex?: boolean;
  ogImagePath?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article';
}

const normalizeDescription = (description: string): string => {
  const cleaned = description.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 160) {
    return cleaned;
  }

  const truncated = cleaned.slice(0, 157);
  const lastSentenceBreak = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('; ')
  );
  const lastSpace = truncated.lastIndexOf(' ');
  const cutPoint =
    lastSentenceBreak >= 120 ? lastSentenceBreak + 1 : lastSpace >= 120 ? lastSpace : 157;

  return `${truncated.slice(0, cutPoint).trimEnd().replace(/[.,;:!?-]+$/, '')}...`;
};

export function createPageMetadata({
  title,
  description,
  path,
  forceNoIndex = false,
  ogImagePath = OG_IMAGE_PATH,
  ogImageAlt = 'Hylono premium bio-optimization technologies',
  ogType = 'website',
}: CreatePageMetadataInput): Metadata {
  const canonical = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const normalizedDescription = normalizeDescription(description);
  const resolvedTitle: Metadata['title'] = /hylono/i.test(title) ? { absolute: title } : title;

  return {
    title: resolvedTitle,
    description: normalizedDescription,
    robots: forceNoIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      locale: 'en_GB',
      url: canonical,
      siteName: 'Hylono',
      title,
      description: normalizedDescription,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hylono',
      creator: '@hylono',
      title,
      description: normalizedDescription,
      images: [{ url: ogImagePath, alt: ogImageAlt }],
    },
  };
}
