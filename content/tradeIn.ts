export const tradeInContent = {
  title: 'Trade-In Program',
  subtitle:
    'Exchange your old device for a discount on a new purchase or rental.',
  categories: [
    { value: 'hbot', label: 'Hyperbaric chamber' },
    { value: 'h2', label: 'Hydrogen generator' },
    { value: 'rlt', label: 'RLT/NIR panel' },
    { value: 'pemf', label: 'PEMF device' },
    { value: 'other', label: 'Other' },
  ],
  conditions: [
    { value: 'excellent', label: 'Fully functional, very good condition' },
    { value: 'good', label: 'Working, visible signs of use' },
    { value: 'fair', label: 'Working with limitations' },
    { value: 'poor', label: 'Not working' },
  ],
  submitLabel: 'Submit for valuation',
  disclaimer:
    "We'll respond within 48 hours with a proposed trade-in value. No obligation.",
} as const;
