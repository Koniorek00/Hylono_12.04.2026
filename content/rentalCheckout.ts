export const rentalCheckoutContent = {
  title: 'Rental summary',
  terms: [
    'Minimum period: {selectedPlan.minPeriod}',
    'Service and support: included',
    'Buy with a discount: 70% of payments credited toward purchase price',
    'Returns: we arrange courier pickup',
  ],
  termsAcceptance: 'I accept the rental program terms.',
  intendedUse:
    "I confirm that I have reviewed the product's intended use and proper usage information.",
  paymentButtonPrefix: 'Submit rental request',
  depositNote:
    'Deposit and first invoice are confirmed after operator review. The deposit is returned within 14 days of device inspection after rental ends.',
} as const;
