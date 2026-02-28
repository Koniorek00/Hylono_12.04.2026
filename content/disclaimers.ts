/**
 * Medical Disclaimers - Single Source of Truth
 * 
 * These disclaimers comply with:
 * - EU Medical Device Regulation (MDR) 2017/745 Article 7
 * - Advertising Standards Authority guidelines
 * - General Product Safety Regulation (GPSR)
 * 
 * @module content/disclaimers
 */

export const disclaimers = {
  /**
   * General site-wide disclaimer
   * Use on: Home page, landing pages, general content
   */
  general:
    'Hylono products are wellness devices designed to support general wellbeing. Information on this website is for educational purposes only and does not constitute medical advice. These products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any new wellness routine, especially if you have a pre-existing medical condition or are taking medication.',

  /**
   * Research and evidence pages disclaimer
   * Use on: Research hub, evidence summaries, study references
   */
  research:
    'Research summaries and study references are provided for educational purposes only. Individual results may vary and the findings described may not apply to every individual. These summaries are based on published peer-reviewed studies and are not a substitute for professional medical advice. The products described have not been evaluated by the European Medicines Agency. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.',

  /**
   * Product Detail Page (PDP) disclaimer
   * Use on: Product pages, checkout, cart
   */
  pdp:
    'Product information is intended to support informed wellness decisions. Individual outcomes vary based on protocol adherence, baseline health status, and lifestyle factors. The stated benefits reflect general research findings and user experiences, not guaranteed results. This product is a wellness device and is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use, particularly if you are pregnant, have a pacemaker, or have any medical implants.',

  /**
   * Protocol and usage guide disclaimer
   * Use on: Protocol pages, usage guides, session schedules
   */
  protocol:
    'These protocols are educational wellness schedules designed to support recovery, vitality, and performance routines. They are not medical prescriptions and should not replace professional medical treatment. The suggested protocols are based on general wellness principles and individual research findings. Not intended to diagnose, treat, cure, or prevent any disease. Always consult your healthcare provider before beginning any new wellness protocol.',

  /**
   * Testimonial and review disclaimer
   * Use on: Testimonial pages, review sections, case studies
   */
  testimonial:
    'Testimonials and reviews reflect individual experiences and are not representative of all users. Individual results vary based on personal health status, consistency of use, and other factors. These accounts are not intended to make medical claims or guarantee similar results. Not intended to diagnose, treat, cure, or prevent any disease.',

  /**
   * Financing and pricing disclaimer
   * Use on: Financing pages, pricing tables, rental pages
   */
  financing:
    'Financing options are subject to credit approval and terms may vary by provider. Monthly payment examples are estimates and actual payments may differ. Rental terms and conditions apply. Prices and availability subject to change without notice. Consult the relevant provider for specific terms and conditions.',

  /**
   * Contraindication summary disclaimer
   * Use on: Safety sections, contraindication pages
   */
  safety:
    'This list of contraindications and safety notes is not exhaustive. Always read the user manual thoroughly before use. If you experience any discomfort or adverse effects during use, discontinue immediately and consult a healthcare professional. Keep all wellness devices away from children and use only as directed.',

  /**
   * CE Mark compliance notice
   * Use on: Product specifications, compliance sections
   */
  ceMark:
    'Products bearing the CE mark comply with applicable EU directives and regulations. The CE mark indicates conformity with health, safety, and environmental protection standards for products sold within the European Economic Area. For specific compliance documentation, refer to the product documentation or contact support.',

  /**
   * Short inline disclaimer for compact UI elements
   * Use on: Cards, mobile views, tight spaces
   */
  short:
    'Wellness device. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider.',

  /**
   * Footer disclaimer for legal section
   * Use on: Footer, legal pages
   */
  footer:
    'Hylono Systems wellness products are designed to support general wellbeing and are not medical devices as defined by EU MDR 2017/745. The information provided on this website is for educational purposes only. Always read the user manual and consult a healthcare professional before use. Product specifications, pricing, and availability subject to change. © 2026 Hylono Systems. All rights reserved.',
} as const;

/**
 * Disclaimer types for type-safe usage
 */
export type DisclaimerType = keyof typeof disclaimers;

/**
 * Get disclaimer by type with optional override text
 */
export const getDisclaimer = (type: DisclaimerType, overrideText?: string): string => {
  return overrideText || disclaimers[type];
};

/**
 * Required disclaimer contexts mapped to types
 */
export const DISCLAIMER_CONTEXTS = {
  productDetail: 'pdp',
  researchArticle: 'research',
  protocolPage: 'protocol',
  testimonialSection: 'testimonial',
  financingPage: 'financing',
  safetySection: 'safety',
  ceCompliance: 'ceMark',
  footerSection: 'footer',
} as const;

/**
 * EU MDR Article 7 Compliance Statement
 * Required for products that could be confused with medical devices
 */
export const MDR_COMPLIANCE_STATEMENT = 
  'This product is not a medical device within the meaning of EU Regulation 2017/745 (MDR). ' +
  'It is a wellness device intended for general wellbeing purposes only. ' +
  'The product has not been assessed for medical efficacy and is not intended for medical use.';

/**
 * Disclaimer for research citations
 */
export const CITATION_DISCLAIMER = 
  'Study citations are provided for transparency. Inclusion of a study does not imply endorsement of its findings ' +
  'or guarantee of product efficacy. Research methodology and participant characteristics may not reflect your individual situation.';