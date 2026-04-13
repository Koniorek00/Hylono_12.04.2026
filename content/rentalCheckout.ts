export const rentalCheckoutContent = {
  title: 'Rental request summary',
  terms: [
    'Minimum period: {selectedPlan.minPeriod}',
    'Service and support: included',
    'Payment method and delivery timing are confirmed after operator review',
    'Return, extension, and buy-later options depend on the selected agreement',
  ],
  termsAcceptance: 'I accept the rental program terms.',
  intendedUse:
    "I confirm that I have reviewed the product's intended use and proper usage information.",
  paymentButtonPrefix: 'Submit rental request',
  depositNote:
    'Deposit and first invoice are confirmed after operator review. Refund timing depends on post-rental inspection and the applicable agreement.',
} as const;
