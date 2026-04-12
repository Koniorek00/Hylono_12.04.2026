import { conditionGoals, type ConditionGoalPage } from './conditions';
import { protocolBySlug } from './protocols';

export interface TopicalGraphLink {
  href: string;
  label: string;
}

export interface TopicalGraphJourney {
  slug: ConditionGoalPage['slug'];
  title: string;
  summary: string;
  condition: TopicalGraphLink;
  research: TopicalGraphLink;
  product: TopicalGraphLink;
  protocol?: TopicalGraphLink;
  action: TopicalGraphLink;
}

interface FooterTopicalGraphSection {
  title: string;
  links: TopicalGraphLink[];
}

const MODALITY_TO_PRODUCT_ROUTE: Record<
  ConditionGoalPage['modalities'][number]['slug'],
  string
> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
  RLT: 'rlt',
  PEMF: 'pemf',
};

const MODALITY_TO_PRODUCT_LABEL: Record<
  ConditionGoalPage['modalities'][number]['slug'],
  string
> = {
  HBOT: 'HBOT hub',
  H2: 'Hydrogen hub',
  RLT: 'Red-light hub',
  PEMF: 'PEMF hub',
};

const ACTION_BY_CONDITION: Record<ConditionGoalPage['slug'], TopicalGraphLink> = {
  recovery: { href: '/rental', label: 'Explore rentals' },
  sleep: { href: '/rental', label: 'Explore rentals' },
  stress: { href: '/contact', label: 'Talk to Hylono' },
  comfort: { href: '/contact', label: 'Ask for guidance' },
  vitality: { href: '/rental', label: 'Explore rentals' },
};

const dedupeLinks = (links: TopicalGraphLink[]): TopicalGraphLink[] => {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
};

export const homepagePrimaryLinks: TopicalGraphLink[] = [
  { href: '/store', label: 'Store hub' },
  { href: '/conditions', label: 'Condition guides' },
  { href: '/research', label: 'Research hub' },
  { href: '/protocols', label: 'Protocol library' },
  { href: '/rental', label: 'Rental options' },
];

export const storePlanningLinks: TopicalGraphLink[] = [
  { href: '/conditions', label: 'Condition guides' },
  { href: '/protocols', label: 'Protocol library' },
  { href: '/research', label: 'Research hub' },
  { href: '/rental', label: 'Rental hub' },
  { href: '/contact', label: 'Talk to Hylono' },
];

export const goalJourneys: TopicalGraphJourney[] = conditionGoals.map((goal) => {
  const primaryModality = goal.modalities[0];
  const primaryProductRoute = primaryModality
    ? MODALITY_TO_PRODUCT_ROUTE[primaryModality.slug]
    : undefined;
  const primaryProtocolSlug = goal.protocolSlugs[0];
  const primaryProtocol = primaryProtocolSlug
    ? protocolBySlug[primaryProtocolSlug]
    : undefined;

  return {
    slug: goal.slug,
    title: goal.title,
    summary: goal.subtitle,
    condition: {
      href: `/conditions/${goal.slug}`,
      label: `${goal.title} guide`,
    },
    research: {
      href: '/research',
      label: 'Research hub',
    },
    product: {
      href: primaryProductRoute ? `/product/${primaryProductRoute}` : '/store',
      label: primaryModality
        ? MODALITY_TO_PRODUCT_LABEL[primaryModality.slug]
        : 'Store hub',
    },
    protocol: primaryProtocol
      ? {
          href: `/protocols/${primaryProtocol.slug}`,
          label: primaryProtocol.title,
        }
      : undefined,
    action: ACTION_BY_CONDITION[goal.slug],
  };
});

const protocolJourneyLinks = dedupeLinks(
  goalJourneys
    .map((journey) => journey.protocol)
    .filter((journey): journey is TopicalGraphLink => Boolean(journey))
);

export const footerTopicalGraphSections: FooterTopicalGraphSection[] = [
  {
    title: 'Core Hubs',
    links: dedupeLinks([...homepagePrimaryLinks, { href: '/help', label: 'Help center' }]),
  },
  {
    title: 'Condition Guides',
    links: goalJourneys.map((journey) => journey.condition),
  },
  {
    title: 'Protocols',
    links: protocolJourneyLinks,
  },
  {
    title: 'Trust & Policies',
    links: [
      { href: '/about', label: 'About Hylono' },
      { href: '/faq', label: 'FAQ' },
      { href: '/help', label: 'Help center' },
      { href: '/contact', label: 'Contact' },
      { href: '/press', label: 'Press' },
    ],
  },
];

export const getProductTopicalLinks = (
  productSlug: string,
  relatedProtocolSlugs: string[] = []
): TopicalGraphLink[] => {
  const normalizedProductHref = `/product/${productSlug.toLowerCase()}`;
  const journeyConditionLinks = goalJourneys
    .filter((journey) => journey.product.href === normalizedProductHref)
    .map((journey) => journey.condition);
  const journeyProtocolLinks = goalJourneys
    .filter((journey) => journey.product.href === normalizedProductHref)
    .map((journey) => journey.protocol)
    .filter((journey): journey is TopicalGraphLink => Boolean(journey));
  const relatedProtocolLinks = relatedProtocolSlugs
    .map((slug) => protocolBySlug[slug])
    .filter((protocol): protocol is NonNullable<typeof protocol> => Boolean(protocol))
    .map((protocol) => ({
      href: `/protocols/${protocol.slug}`,
      label: protocol.title,
    }));

  return dedupeLinks([
    ...journeyConditionLinks,
    ...journeyProtocolLinks,
    ...relatedProtocolLinks,
    { href: '/research', label: 'Research evidence' },
    { href: '/rental', label: 'Rental planning' },
    { href: '/contact', label: 'Talk to Hylono' },
  ]);
};
