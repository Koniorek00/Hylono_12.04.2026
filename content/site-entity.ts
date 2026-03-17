export const siteEntity = {
  name: 'Hylono',
  legalName: 'Hylono',
  description:
    'Hylono is a European wellness-technology platform focused on guided device access, protocol planning, and conservative evidence-informed education.',
  supportEmail: 'support@hylono.com',
  contactEmail: 'contact@hylono.com',
  supportHours: 'Monday to Friday, 09:00 to 18:00 CET',
  serviceArea: 'European Union',
  supportCoverageLabel: 'EU support coverage',
  trustPagePaths: [
    '/about',
    '/help',
    '/faq',
    '/contact',
    '/returns',
    '/shipping',
    '/warranty',
    '/privacy',
    '/terms',
  ],
} as const;

export const siteOwnership = {
  editorial: {
    label: 'Editorial oversight',
    team: 'Hylono Editorial Team',
  },
  research: {
    label: 'Evidence review',
    team: 'Hylono Research Review',
  },
  commerce: {
    label: 'Commerce support',
    team: 'Hylono Commerce & Support',
  },
} as const;
