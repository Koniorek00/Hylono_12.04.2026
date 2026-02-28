export const featureFlags = {
  // PDP
  feature_pdp_dual_track: false,
  feature_pdp_financing_drawer: false,
  feature_pdp_trust_hierarchy: false,
  feature_pdp_spec_annotations: false,
  feature_pdp_protocols: false,
  feature_pdp_evidence: false,
  feature_pdp_documents: false,
  feature_pdp_contraindications: false,
  feature_pdp_sticky_cta: false,
  feature_pdp_advisor_cta: false,
  feature_pdp_tradein: false,

  // Rental
  feature_rental_landing: true,
  feature_rental_checkout: false,
  feature_account_rentals: false,

  // Protocols
  feature_protocols_listing: false,
  feature_protocols_detail: false,

  // Builder
  feature_builder: true,

  // Goals/Conditions
  feature_condition_pages: false,

  // Navigation
  feature_nav_goals: false,
  feature_header_trust: false,

  // Search
  feature_search_enhanced: true,

  // Store
  feature_store_filters: false,
  feature_store_cards: false,

  // Content-Commerce
  feature_content_commerce: false,

  // Homepage
  feature_homepage_enhancements: false,

  // Other pages
  feature_advisors_page: false,
  feature_tradein_page: false,
  feature_financing_page: false,
  feature_onboarding: false,
  feature_referral: false,
  feature_research_library: false,
  feature_videos_page: false,

  // Checkout
  feature_checkout_trust: false,
  feature_order_confirmation_enhanced: false,
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export type Batch4FeatureFlag = Extract<
  FeatureFlagName,
  | 'feature_advisors_page'
  | 'feature_financing_page'
  | 'feature_tradein_page'
  | 'feature_rental_checkout'
  | 'feature_account_rentals'
  | 'feature_onboarding'
  | 'feature_referral'
  | 'feature_order_confirmation_enhanced'
  | 'feature_research_library'
  | 'feature_videos_page'
  | 'feature_checkout_trust'
>;

const getEnvKey = (flagName: string): string => `NEXT_PUBLIC_FLAG_${flagName.toUpperCase()}`;
const getStorageKey = (flagName: string): string => `HYLO_${flagName}`;

export const isFeatureEnabled = (flagName: string): boolean => {
  if (!Object.prototype.hasOwnProperty.call(featureFlags, flagName)) {
    return false;
  }

  if (typeof window !== 'undefined') {
    const localOverride = window.localStorage.getItem(getStorageKey(flagName));
    if (localOverride === 'true') return true;
    if (localOverride === 'false') return false;
  }

  const envValue = process.env[getEnvKey(flagName)];
  if (envValue === 'true') return true;
  if (envValue === 'false') return false;

  return featureFlags[flagName as FeatureFlagName];
};

export const setFeatureOverride = (flagName: string, value: boolean | null): void => {
  if (typeof window === 'undefined') return;
  if (!Object.prototype.hasOwnProperty.call(featureFlags, flagName)) return;

  const storageKey = getStorageKey(flagName);

  if (value === null) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, String(value));
};

export const isTypedFeatureEnabled = (flag: FeatureFlagName): boolean => isFeatureEnabled(flag);
export const setTypedFeatureOverride = (flag: FeatureFlagName, value: boolean | null): void => {
  setFeatureOverride(flag, value);
};

export const isBatch4FeatureEnabled = (flag: Batch4FeatureFlag): boolean => isFeatureEnabled(flag);
export const setBatch4FeatureOverride = (flag: Batch4FeatureFlag, value: boolean | null): void => {
  setFeatureOverride(flag, value);
};
