import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.eu';
const OG_IMAGE_PATH = '/og-image.svg';

interface CreatePageMetadataInput {
  title: string;
  description: string;
  path: string;
}

const normalizeDescription = (description: string): string => {
  const cleaned = description.replace(/\s+/g, ' ').trim();
  const suffix =
    " Discover Hylono's evidence-informed wellness technologies, rental options, and guidance designed to support wellbeing.";

  let result = cleaned;
  if (result.length < 150) {
    result = `${result}${suffix}`;
  }

  while (result.length < 150) {
    result = `${result} In Europe.`;
  }

  if (result.length > 160) {
    result = `${result.slice(0, 157).trimEnd()}...`;
  }

  return result;
};

export function createPageMetadata({ title, description, path }: CreatePageMetadataInput): Metadata {
  const canonical = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const normalizedDescription = normalizeDescription(description);

  return {
    title,
    description: normalizedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Hylono',
      title,
      description: normalizedDescription,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: 'Hylono premium bio-optimization technologies',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: normalizedDescription,
      images: [OG_IMAGE_PATH],
    },
  };
}