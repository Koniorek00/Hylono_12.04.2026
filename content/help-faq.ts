export interface HelpFaqItem {
  q: string;
  a: string;
}

export interface HelpFaqCategory {
  category: string;
  evidenceSource?: string;
  items: HelpFaqItem[];
}

export const HELP_FAQ_DATA: HelpFaqCategory[] = [
  {
    category: 'About Hylono',
    items: [
      {
        q: 'What is Hylono?',
        a: 'Hylono is a wellness technology platform focused on oxygen, light, signal, and hydrogen routines designed to support recovery and everyday wellbeing at home or in professional settings.',
      },
      {
        q: 'What does “Where Mind Connects with Matter” mean?',
        a: 'It reflects our practical approach: combine clear protocols, consistent routines, and measurable progress so clients can build structured wellness habits over time.',
      },
      {
        q: 'Are these medical devices?',
        a: 'Our core range is positioned as wellness technology. For model-specific compliance documents, our team can share available certifications and intended-use documentation.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes. We ship across EU markets and selected international destinations. Delivery windows depend on product size, logistics route, and installation needs.',
      },
    ],
  },
  {
    category: 'Science & Protocols',
    evidenceSource: 'See Research Hub: /research',
    items: [
      {
        q: 'What is the Superhuman Protocol?',
        a: 'It is an ordered routine combining magnetism, oxygen, and light exposures. Many users apply this sequence to support energy management and recovery structure.',
      },
      {
        q: 'What are contraindications and safety considerations?',
        a: 'Each modality has specific suitability criteria and setup precautions. Always review device manuals and consult a qualified healthcare professional before starting a new protocol.',
      },
      {
        q: 'How often should I use the systems?',
        a: 'Frequency depends on goals, tolerance, and schedule. Many clients begin with 3–5 weekly sessions and adjust gradually using guided protocol plans.',
      },
      {
        q: 'Can I combine multiple technologies?',
        a: 'Yes. Combination routines are common and may support a more structured wellness program when sequencing and recovery windows are planned correctly.',
      },
    ],
  },
  {
    category: 'Products & Purchasing',
    items: [
      {
        q: 'How do I choose the right product?',
        a: 'Use our planner tools and consultation process to match modality, usage context, and budget with your priorities.',
      },
      {
        q: 'Can I try before buying?',
        a: 'Yes. Selected devices are available in rental programs so you can validate fit and consistency before deciding on purchase.',
      },
      {
        q: 'What warranty coverage do you provide?',
        a: 'Warranty terms vary by product line and are documented in each product specification. Our support team handles warranty guidance directly.',
      },
      {
        q: 'Is financing available?',
        a: 'Yes. Financing and rental plans are available for selected products, subject to provider terms and local eligibility.',
      },
    ],
  },
  {
    category: 'Shipping & Support',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Small devices usually ship faster than large systems requiring freight handling. Exact timelines are confirmed at checkout or during consultation.',
      },
      {
        q: 'Do you provide installation and setup?',
        a: 'For selected large systems we provide guided setup support, and all products include onboarding materials and remote assistance options.',
      },
      {
        q: 'How do I track my order?',
        a: 'Tracking information is shared after dispatch. For freight deliveries, logistics coordination is handled directly with the client.',
      },
      {
        q: 'What is your return policy?',
        a: 'Return and rental terms vary by product category. Our support team provides product-specific return conditions before finalizing your order.',
      },
    ],
  },
];
