export interface InstallmentOption {
  months: number;
  monthlyAmount: number;
  interestRate: number;
}

export interface FinancingProduct {
  id: string;
  label: string;
  basePrice: number;
  installmentOptions: InstallmentOption[];
}

export const financingContent = {
  title: 'Financing options',
  subtitle:
    'No need to pay upfront. Spread the cost over convenient installments or use our rental program.',
  products: [
    {
      id: 'hbot-rental-plus',
      label: 'HBOT System Package',
      basePrice: 4990,
      installmentOptions: [
        { months: 6, monthlyAmount: 831.67, interestRate: 0 },
        { months: 12, monthlyAmount: 415.83, interestRate: 0 },
        { months: 24, monthlyAmount: 225.13, interestRate: 3.9 },
      ],
    },
    {
      id: 'pemf-pro',
      label: 'PEMF Performance Kit',
      basePrice: 2390,
      installmentOptions: [
        { months: 6, monthlyAmount: 398.33, interestRate: 0 },
        { months: 12, monthlyAmount: 199.17, interestRate: 0 },
        { months: 24, monthlyAmount: 107.9, interestRate: 3.9 },
      ],
    },
  ] as FinancingProduct[],
  rentalCtaText:
    'Instead of installments, you can rent a device from €89/mo. No commitment. With the option to buy.',
  rentalButton: 'Explore the rental program →',
  faq: [
    {
      q: 'Who is eligible for financing?',
      a: 'Eligibility depends on the financing partner checks and your local requirements.',
    },
    {
      q: 'What documents are needed?',
      a: 'Usually proof of identity and proof of address. The provider will confirm exact requirements during checkout.',
    },
    {
      q: 'Can I pay it off early?',
      a: 'In most plans yes. Final terms depend on the selected financing option and provider policy.',
    },
  ],
} as const;
