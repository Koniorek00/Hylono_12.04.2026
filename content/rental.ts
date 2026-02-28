import { products } from './products';

export type RentalBudgetFilter = 'all' | 'upto-500' | '500-1000' | '1000-2000' | '2000-plus';
export type RentalTechnologyFilter = 'all' | 'mHBOT' | 'H2' | 'RLT' | 'PEMF';

export const rentalLandingContent = {
  hero: {
    title: 'Try before you buy',
    subtitle:
      'Regeneration technologies without the upfront investment. Flexible monthly plans and guided onboarding included.',
    cta: 'See available devices',
  },
  howItWorks: [
    {
      number: 1,
      title: 'Choose',
      text: 'Select a device and rental period based on your goals and budget.',
    },
    {
      number: 2,
      title: 'Receive',
      text: 'We deliver, set up, and walk you through first sessions with a starter protocol.',
    },
    {
      number: 3,
      title: 'Decide',
      text: 'After your period, return, extend, or buy. 70% of rental payments are credited toward purchase.',
    },
  ],
  comparisonRows: [
    { label: 'Upfront cost', purchase: 'Full price', rental: 'Deposit + 1 month' },
    { label: 'Commitment', purchase: 'None', rental: 'Minimum 1 month' },
    { label: 'Service', purchase: 'Warranty', rental: 'Included' },
    { label: 'Can I buy later?', purchase: '—', rental: 'Yes, with 70% credit' },
    { label: 'Best for', purchase: "I'm sure about my choice", rental: 'I want to try first' },
  ],
  faq: [
    {
      q: "What's the minimum rental period?",
      a: '1 month. You can extend monthly or choose a longer period for a discount.',
    },
    {
      q: 'What happens if the device breaks?',
      a: "Service is included in the rental price. We'll repair or replace the device at no extra cost.",
    },
    {
      q: 'Can I buy the device afterwards?',
      a: 'Yes. 70% of your rental payments are credited toward the purchase price.',
    },
    {
      q: 'How does the return work?',
      a: 'We arrange courier pickup. You just pack the device in its original packaging.',
    },
    {
      q: 'What does the deposit cover?',
      a: 'The deposit is refundable and covers potential damage beyond normal use. We return it within 14 days of device inspection.',
    },
  ],
  testimonials: [
    {
      id: 'rent-1',
      quote:
        'Rental was the easiest way to start. Setup support was excellent and we decided to buy after month three.',
      author: 'Anna, Warsaw',
    },
    {
      id: 'rent-2',
      quote:
        'I wanted to test mHBOT at home before full purchase. The rental path gave me confidence and flexibility.',
      author: 'Marek, Wrocław',
    },
  ],
  finalCta: {
    title: 'Not sure where to start?',
    primary: 'Configure a stack',
    secondary: 'Talk to an advisor',
  },
} as const;

const modalityDisplayMap: Record<string, RentalTechnologyFilter> = {
  mHBOT: 'mHBOT',
  H2_inhalation: 'H2',
  H2_water: 'H2',
  RLT_NIR: 'RLT',
  PEMF: 'PEMF',
  VNS: 'PEMF',
  O2: 'mHBOT',
};

export const rentalProducts = products
  .filter((product) => product.rentalEligible && product.rentalPlans?.length)
  .map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    modality: modalityDisplayMap[product.modality] ?? 'H2',
    rentalMonthly: Math.min(...(product.rentalPlans ?? []).map((plan) => plan.monthlyPrice)),
    available: true,
    image: product.images[0],
  }));
