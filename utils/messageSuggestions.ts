/**
 * Message Suggestions Utility
 * Quick-select templates and conversation starters for the smart messaging interface
 */

export interface MessageTemplate {
  id: string;
  label: string;
  icon: string;
  template: string;
  category: 'inquiry' | 'pricing' | 'support' | 'protocol';
}

export interface QuickTag {
  id: string;
  label: string;
  color: string;
  defaultMessage: string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'product-inquiry',
    label: 'Product Inquiry',
    icon: 'Package',
    template: "I'd like to learn more about [PRODUCT]. Could you please provide more details about its features and benefits?",
    category: 'inquiry',
  },
  {
    id: 'pricing-question',
    label: 'Pricing Question',
    icon: 'CreditCard',
    template: "What are the pricing options for [PRODUCT]? I'm interested in understanding the financing and rental plans available.",
    category: 'pricing',
  },
  {
    id: 'protocol-guidance',
    label: 'Protocol Guidance',
    icon: 'BookOpen',
    template: "Can you help me understand the recommended protocols for [CONDITION/GOAL]? I'd like to know which products would work best for my needs.",
    category: 'protocol',
  },
  {
    id: 'technical-support',
    label: 'Technical Support',
    icon: 'Wrench',
    template: "I need help with my [PRODUCT]. I'm experiencing an issue with [DESCRIPTION] and would appreciate guidance on how to resolve it.",
    category: 'support',
  },
  {
    id: 'financing-options',
    label: 'Financing Options',
    icon: 'Wallet',
    template: "I'm interested in exploring financing options for [PRODUCT]. Could you explain the available payment plans and eligibility requirements?",
    category: 'pricing',
  },
  {
    id: 'rental-inquiry',
    label: 'Rental Inquiry',
    icon: 'Calendar',
    template: "I'd like to rent [PRODUCT] for [DURATION]. Can you provide information about rental terms, deposits, and delivery options?",
    category: 'pricing',
  },
  {
    id: 'comparison-help',
    label: 'Product Comparison',
    icon: 'GitCompare',
    template: "I'm trying to decide between [PRODUCT A] and [PRODUCT B]. Could you help me understand the key differences and which would be better for [GOAL]?",
    category: 'inquiry',
  },
  {
    id: 'trade-in',
    label: 'Trade-In Question',
    icon: 'RefreshCw',
    template: "I have a [CURRENT DEVICE] and I'm interested in the trade-in program for [NEW PRODUCT]. What are the eligibility requirements and trade-in value?",
    category: 'pricing',
  },
];

export const QUICK_TAGS: QuickTag[] = [
  { id: 'pricing', label: 'Pricing', color: 'emerald', defaultMessage: 'I have a question about pricing for ' },
  { id: 'availability', label: 'Availability', color: 'blue', defaultMessage: 'Is this product currently available? ' },
  { id: 'specs', label: 'Technical Specs', color: 'violet', defaultMessage: 'I have a question about the technical specifications of ' },
  { id: 'protocols', label: 'Protocols', color: 'cyan', defaultMessage: 'What protocols are recommended for use with ' },
  { id: 'financing', label: 'Financing', color: 'amber', defaultMessage: 'I\'m interested in financing options for ' },
  { id: 'rental', label: 'Rental', color: 'rose', defaultMessage: 'I\'d like to know about rental options for ' },
  { id: 'support', label: 'Support', color: 'orange', defaultMessage: 'I need technical support for ' },
  { id: 'trade-in', label: 'Trade-In', color: 'slate', defaultMessage: 'I\'m interested in the trade-in program for ' },
];

export const TAG_COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-100 hover:border-emerald-300',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100 hover:border-blue-300',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    hover: 'hover:bg-violet-100 hover:border-violet-300',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-100 hover:border-cyan-300',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100 hover:border-amber-300',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-100 hover:border-rose-300',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100 hover:border-orange-300',
  },
  slate: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-100 hover:border-slate-300',
  },
};

/**
 * Generate a contextual message based on selected product and tag
 */
export function generateContextualMessage(
  tag: QuickTag,
  productTitle?: string,
  protocolTitle?: string
): string {
  let message = tag.defaultMessage;
  
  if (productTitle) {
    message += productTitle;
  } else if (protocolTitle) {
    message += protocolTitle;
  } else {
    message = message.trimEnd() + ' your products';
  }
  
  return message;
}

/**
 * Get template with placeholders replaced
 */
export function fillTemplate(
  templateId: string,
  replacements: Record<string, string>
): string {
  const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
  if (!template) return '';
  
  let result = template.template;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(`[${key}]`, value);
  });
  
  return result;
}