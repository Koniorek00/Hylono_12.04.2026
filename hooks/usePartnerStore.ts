import { create } from 'zustand';

export type PartnerColor = string; // Hex

export type CampaignGoal = 'launch' | 'education' | 'promotion' | 'event';
export type CampaignFormat = 'social-square' | 'social-story' | 'print-poster' | 'print-flyer';
export type Modality = 'HBOT' | 'PEMF' | 'RLT' | 'Hydrogen';
export type Theme = 'modern' | 'luxury' | 'bold';

export interface PartnerProfile {
    logoUrl: string | null;
    brandColor: PartnerColor;
    secondaryColor: string;
    clinicName: string;
    address: string;
    website: string;
    bookingUrl: string;
    socialInstagram: string;
    socialFacebook: string;
}

export type LayoutVariation = 0 | 1 | 2; // 0: Standard/Overlay, 1: Split, 2: Frame

export const COPY_LIBRARY: Record<
    string,
    { title: string; body: string; caption: string; hashtags: string }
> = {
    'promotion-HBOT': {
        title: 'Revitalize Your Routine',
        body: 'Experience Hyperbaric Oxygen Therapy in a guided wellness setting. Support energy, recovery, and a more structured routine today. Limited-time introductory offer available.',
        caption:
            'Feeling drained? Recharge your routine with Hyperbaric Oxygen Therapy.\n\nMore oxygen support can fit recovery planning, energy routines, and better wind-down habits.\n\nClaim your introductory offer via the link in bio.',
        hashtags: '#HBOT #OxygenSupport #Biohacking #Wellness #Recovery',
    },
    'education-HBOT': {
        title: 'The Science of Oxygen',
        body: 'Did you know? Hyperbaric Oxygen Therapy delivers up to 15x more oxygen to your tissues, supporting recovery-focused routines and cognitive sharpness.',
        caption:
            "Did you know? Your brain uses 20% of your body's oxygen.\n\nHBOT drives oxygen into plasma, lymph, and bone marrow, supporting areas that regular breathing cannot reach as directly.\n\nLearn more about oxygen session science at our clinic.",
        hashtags: '#ScienceFacts #HBOT #Hyperbaric #HealthOptimization #BrainHealth',
    },
    'launch-HBOT': {
        title: 'New at Our Clinic',
        body: 'We are thrilled to introduce state-of-the-art Hyperbaric Oxygen Therapy. Elevate your recovery with professionally guided wellness technology.',
        caption:
            'Big news: Hyperbaric Oxygen Therapy has arrived.\n\nExperience the modality used by top athletes and wellness experts to stay at their peak.\n\nBookings are now open. DM us or check the link in bio to reserve your spot.',
        hashtags: '#NewService #HBOT #ClinicLaunch #WellnessJourney #Biohacking',
    },
    'event-HBOT': {
        title: 'Oxygen Deep Dive',
        body: 'Join us for an exclusive evening learning about the benefits of pressure and oxygen. Live demos, Q&A, and exclusive booking perks.',
        caption:
            "You're invited. Join us for an exclusive look at the role of Hyperbaric Oxygen.\n\nEnjoy refreshments and practical sessions on pressure-based wellness routines.\n\nUse the link in bio to RSVP. Spots are limited.",
        hashtags: '#WellnessEvent #OpenHouse #HBOT #CommunityHealth #Oxygen',
    },
    'promotion-PEMF': {
        title: 'Recharge Your Cells',
        body: "Pulsed Electromagnetic Field sessions follow the earth's natural frequency patterns to support your body's recharge routine. 50% off your first session.",
        caption:
            "Low battery? Recharge your routine with PEMF sessions.\n\nReset your natural rhythm, support comfort, and feel more organised in just 12 minutes.\n\nTap the link in bio to book your session.",
        hashtags: '#PEMF #RecoverySupport #Biohacking #CellularHealth #VibrationTherapy',
    },
    'education-PEMF': {
        title: 'Frequency Support',
        body: 'PEMF sessions are designed to support cellular metabolism and oxygenation. A non-invasive way to support comfort and optimize performance routines.',
        caption:
            "Good vibes only. PEMF sessions use safe electromagnetic frequencies to support recovery-focused routines and everyday comfort.\n\nIt's like a charger for your human battery.\n\nCurious? Read more on our website.",
        hashtags: '#FrequencyWellness #PEMF #ComfortSupport #HolisticHealth #Science',
    },
    'promotion-RLT': {
        title: 'Light Up Your Wellbeing',
        body: 'Discover the restorative potential of Red Light Therapy. Support skin vitality, routine comfort, and collagen-focused care.',
        caption:
            'Glow from the inside out. Red Light Therapy can support collagen routines, recovery planning, and day-to-day energy.\n\nTry it this week and see whether it fits your routine. Book now via the link in bio.',
        hashtags: '#RedLightTherapy #Skincare #Collagen #Biohacking #RLT',
    },
    'education-RLT': {
        title: 'Powered by Light',
        body: 'Red and near-infrared wavelengths penetrate deep into tissue to stimulate mitochondrial function. Feel the glow from the inside out.',
        caption:
            "Not all light is created equal. Red and near-infrared light reaches deep enough to support your mitochondria, the cell's power plant.\n\nMore cellular energy can support better routines.\n\nLearn more on our website.",
        hashtags: '#RLT #RedLight #Mitochondria #HealthTips #LightTherapy',
    },
    'promotion-Hydrogen': {
        title: 'The Ultimate Antioxidant',
        body: 'Molecular Hydrogen is a compact antioxidant-support modality. Help manage oxidative stress and recovery routines with flexible session options.',
        caption:
            'Meet the tiny molecule with big impact. Molecular Hydrogen supports recovery planning around oxidative stress.\n\nUse it to explore a more structured wellness routine.\n\nAvailable now at our clinic.',
        hashtags: '#MolecularHydrogen #Antioxidant #RecoverySupport #Biohacking #HydrogenWater',
    },
    'education-Hydrogen': {
        title: 'Why Hydrogen?',
        body: 'Hydrogen water and inhalation sessions can selectively target harmful free radicals, supporting your cells and healthy ageing routines.',
        caption:
            'Oxidative stress can wear down cells over time.\n\nHydrogen is a selective antioxidant that may help manage that wear without blocking useful processes.\n\nLearn the science at our clinic.',
        hashtags: '#HealthyAgeing #HydrogenSessions #ScienceOfHealth #Wellness #Longevity',
    },
    default: {
        title: 'Your Wellness Journey',
        body: 'Unlock your potential with advanced bio-optimization sessions. Book a consultation today to learn more.',
        caption:
            'Ready to optimize your routine? Explore guided sessions designed to help you look, feel, and perform at your best.\n\nBook a consultation today.',
        hashtags: '#Wellness #HealthOptimization #Biohacking #SelfCare',
    },
};

interface PartnerStore {
    // Partner Identity
    profile: PartnerProfile;
    setProfile: (profile: Partial<PartnerProfile>) => void;
    resetCampaign: () => void;

    // Wizard State
    currentStep: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Campaign Strategy
    campaignGoal: CampaignGoal;
    setCampaignGoal: (goal: CampaignGoal) => void;
    format: CampaignFormat;
    setFormat: (format: CampaignFormat) => void;
    modality: Modality;
    setModality: (modality: Modality) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    layoutVariation: LayoutVariation;
    setLayoutVariation: (variation: LayoutVariation) => void;

    // Canvas State
    selectedTemplateId: string | null; // Keep for backward compatibility/selection tracking
    customTitle: string;
    setCustomTitle: (text: string) => void;
    customBody: string;
    setCustomBody: (text: string) => void;

    // Visual Assets
    backgroundImage: string | null;
    setBackgroundImage: (url: string | null) => void;
    showQrCode: boolean;
    setShowQrCode: (show: boolean) => void;
    showLogo: boolean;
    setShowLogo: (show: boolean) => void;
    showHeatmap: boolean;
    setShowHeatmap: (show: boolean) => void;
    showVerifiedBadge: boolean;
    setShowVerifiedBadge: (show: boolean) => void;
}

const INITIAL_PROFILE: PartnerProfile = {
    logoUrl: null,
    brandColor: '#0ea5e9', // Default Cyan
    secondaryColor: '#0f172a', // Default Slate
    clinicName: '',
    address: '',
    website: '',
    bookingUrl: '',
    socialInstagram: '',
    socialFacebook: '',
};

const createInitialCampaignState = () => ({
    profile: INITIAL_PROFILE,
    currentStep: 1,
    campaignGoal: 'promotion' as CampaignGoal,
    format: 'social-square' as CampaignFormat,
    modality: 'HBOT' as Modality,
    theme: 'modern' as Theme,
    layoutVariation: 0 as LayoutVariation,
    selectedTemplateId: 't2',
    customTitle: '',
    customBody: '',
    backgroundImage: null,
    showQrCode: true,
    showLogo: true,
    showHeatmap: false,
    showVerifiedBadge: true,
});

export const usePartnerStore = create<PartnerStore>((set) => ({
    ...createInitialCampaignState(),
    setProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),
    resetCampaign: () => set(createInitialCampaignState()),

    setStep: (step) => set({ currentStep: Math.min(3, Math.max(1, step)) }),
    nextStep: () => set((state) => ({ currentStep: Math.min(3, state.currentStep + 1) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

    setCampaignGoal: (campaignGoal) => set({ campaignGoal }),
    setFormat: (format) => set({ format }),
    setModality: (modality) => set({ modality }),
    setTheme: (theme) => set({ theme }),
    setLayoutVariation: (layoutVariation) => set({ layoutVariation }),

    setCustomTitle: (text) => set({ customTitle: text }),
    setCustomBody: (text) => set({ customBody: text }),

    setBackgroundImage: (url) => set({ backgroundImage: url }),
    setShowQrCode: (show) => set({ showQrCode: show }),
    setShowLogo: (show) => set({ showLogo: show }),
    setShowHeatmap: (show) => set({ showHeatmap: show }),
    setShowVerifiedBadge: (show) => set({ showVerifiedBadge: show }),
}));
