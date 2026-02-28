export const orderSuccessContent = {
  hero: {
    badge: 'Order Confirmed',
    title: 'Thank you for your order',
    subtitle: 'Confirmation details have been sent to your email.',
    orderReferencePrefix: 'Order reference:',
  },
  setup: {
    title: 'Continue your setup',
    description:
      'Use the onboarding plan to prepare your space, review the starter protocol, and get the most from your first sessions.',
    openOnboarding: 'Open onboarding plan',
    contactSupport: 'Contact support',
  },
  nextTitle: "What's next?",
  steps: [
    'Confirmation email',
    'Preparation and shipping',
    'Delivery + instruction',
    'First session with starter protocol',
  ],
  onboardingButton: 'See your full getting started plan →',
  documentsTitle: 'Documents',
  documents: {
    invoiceLabel: 'Invoice (PDF)',
    warrantyLabel: 'Warranty summary',
  },
  referralTitle: 'Share with friends',
  referralText:
    'Refer Hylono and get €150 credit toward your next purchase or rental.',
  referralButton: 'Share your referral link →',
} as const;
