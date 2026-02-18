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

export const COPY_LIBRARY: Record<string, { title: string; body: string; caption: string; hashtags: string }> = {
    'promotion-HBOT': {
        title: 'Revitalize Your Health',
        body: 'Experience the power of Hyperbaric Oxygen Therapy. Boost energy, recover faster, and enhance your wellness journey today. Limited time offer available.',
        caption: 'Feeling drained? 🔋 Recharge at the cellular level with Hyperbaric Oxygen Therapy. 💨\n\nIncreased oxygen = Increased energy, faster recovery, and better sleep. ✨\n\nClaim your intro offer via the link in bio! 👇',
        hashtags: '#HBOT #OxygenTherapy #Biohacking #Wellness #Recovery'
    },
    'education-HBOT': {
        title: 'The Science of Oxygen',
        body: 'Did you know? Hyperbaric Oxygen Therapy delivers up to 15x more oxygen to your tissues, promoting deep cellular healing and cognitive sharpness.',
        caption: 'Did you know? 🧠 Your brain uses 20% of your body\'s oxygen.\n\nHBOT drives oxygen into plasma, lymph, and bone marrow—healing tissues that regular breathing can\'t reach. 🔬\n\nLearn more about the science of healing at our clinic.',
        hashtags: '#ScienceFacts #HBOT #Hyperbaric #HealthOptimization #BrainHealth'
    },
    'launch-HBOT': {
        title: 'New at Our Clinic',
        body: 'We are thrilled to introduce state-of-the-art Hyperbaric Oxygen Therapy. Elevate your recovery with appropriate clinical technology.',
        caption: '📢 BIG NEWS: Hyperbaric Oxygen Therapy has arrived! 🚀\n\nExperience the therapy used by top athletes and wellness experts to stay at their peak. 🏆\n\nBookings are now OPEN. DM us or check the link in bio to grab your spot!',
        hashtags: '#NewService #HBOT #ClinicLaunch #WellnessJourney #Biohacking'
    },
    'event-HBOT': {
        title: 'Oxygen Deep Dive',
        body: 'Join us for an exclusive evening learning about the benefits of pressure and oxygen. Live demos, Q&A, and exclusive booking perks.',
        caption: 'You\'re invited! 💌 Join us for an exclusive look at the power of Hyperbaric Oxygen.\n\n🍷 Sips, snacks, and deep dives into pressure therapy.\n\n📍 Link in bio to RSVP (Spots are limited!)',
        hashtags: '#WellnessEvent #OpenHouse #HBOT #CommunityHealth #Oxygen'
    },
    // PEMF
    'promotion-PEMF': {
        title: 'Recharge Your Cells',
        body: 'Pulsed Electromagnetic Field therapy mimics the earth\'s natural frequency to reset your body\'s battery. 50% off your first session.',
        caption: 'Low battery? 🪫 Recharge your body\'s cells with PEMF Therapy. ⚡\n\nReset your natural rhythm, reduce inflammation, and feel optimized in just 12 minutes. ⏱️\n\nTap the link in bio to book your recharge session!',
        hashtags: '#PEMF #EnergyHealing #Biohacking #CellularHealth #VibrationTherapy'
    },
    'education-PEMF': {
        title: 'Frequency Healing',
        body: 'PEMF therapy enhances cellular metabolism and oxygenation. A non-invasive way to reduce inflammation and optimize performance.',
        caption: 'Good vibes only. 🌊 PEMF therapy uses safe electromagnetic frequencies to stimulate cell repair and reduce pain. \n\nIt\'s like a charger for your human battery. 🔋\n\nCurious? Read more on our website.',
        hashtags: '#FrequencyMedicine #PEMF #PainRelief #HolisticHealth #Science'
    },
    // RLT
    'promotion-RLT': {
        title: 'Light Up Your Wellbeing',
        body: 'Discover the rejuvenating power of Red Light Therapy. Improve skin health, reduce pain, and boost collagen production.',
        caption: 'Glow from the inside out. ✨ Red Light Therapy is your secret weapon for collagen, recovery, and energy. 💡\n\nTry it this week and see the difference. Book now via link in bio!',
        hashtags: '#RedLightTherapy #Skincare #Collagen #Biohacking #RLT'
    },
    'education-RLT': {
        title: 'Powered by Light',
        body: 'Red and Near-Infrared wavelengths penetrate deep into tissue to stimulate mitochondrial function. Feel the glow from the inside out.',
        caption: 'Not all light is created equal. ☀️ Red and Near-Infrared light penetrates deep to power up your mitochondria (your cell\'s power plant). 🏭\n\nMore cellular energy = Better health. Simple as that. 💡',
        hashtags: '#RLT #RedLight #Mitochondria #HealthTips #LightTherapy'
    },
    // Hydrogen
    'promotion-Hydrogen': {
        title: 'The Ultimate Antioxidant',
        body: 'Molecular Hydrogen is the smallest, most powerful antioxidant. Neutralize free radicals and reduce oxidative stress instantly.',
        caption: 'Meet the tiny molecule with BIG impact. 💧 Molecular Hydrogen neutralizes oxidative stress instantly.\n\nDetox, recover, and protect your cells. 🛡️\n\nAvailable now at our clinic!',
        hashtags: '#MolecularHydrogen #Antioxidant #Detox #Biohacking #HydrogenWater'
    },
    'education-Hydrogen': {
        title: 'Why Hydrogen?',
        body: 'Hydrogen water and inhalation therapy can selectively target harmful free radicals, protecting your cells and delaying aging.',
        caption: 'Rust happens. 🍂 Oxidative stress "rusts" our cells over time. \n\nHydrogen is the selective antioxidant that stops the rust without blocking beneficial processes. 🛑\n\nLearn the science at our clinic.',
        hashtags: '#AntiAging #HydrogenTherapy #ScienceOfHealth #Wellness #Longevity'
    },
    // Fallback
    'default': {
        title: 'Your Wellness Journey',
        body: 'Unlock your potential with our advanced bio-optimization therapies. Book your consultation today to learn more.',
        caption: 'Ready to optimize your health? 🌟 innovative therapies designed to help you look, feel, and perform your best.\n\nBook a consultation today! 👇',
        hashtags: '#Wellness #HealthOptimization #Biohacking #SelfCare'
    }
};

interface PartnerStore {
    // Partner Identity
    profile: PartnerProfile;
    setProfile: (profile: Partial<PartnerProfile>) => void;

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

export const usePartnerStore = create<PartnerStore>((set) => ({
    profile: {
        logoUrl: null,
        brandColor: '#0ea5e9', // Default Cyan
        secondaryColor: '#0f172a', // Default Slate
        clinicName: '',
        address: '',
        website: '',
        bookingUrl: '',
        socialInstagram: '',
        socialFacebook: '',
    },
    setProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),

    currentStep: 1,
    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

    campaignGoal: 'promotion',
    setCampaignGoal: (campaignGoal) => set({ campaignGoal }),
    format: 'social-square',
    setFormat: (format) => set({ format }),
    modality: 'HBOT',
    setModality: (modality) => set({ modality }),
    theme: 'modern',
    setTheme: (theme) => set({ theme }),
    layoutVariation: 0,
    setLayoutVariation: (layoutVariation) => set({ layoutVariation }),

    selectedTemplateId: 't2',

    customTitle: '',
    setCustomTitle: (text) => set({ customTitle: text }),
    customBody: '',
    setCustomBody: (text) => set({ customBody: text }),

    backgroundImage: null,
    setBackgroundImage: (url) => set({ backgroundImage: url }),
    showQrCode: true,
    setShowQrCode: (show) => set({ showQrCode: show }),
    showLogo: true,
    setShowLogo: (show) => set({ showLogo: show }),
    showHeatmap: false,
    setShowHeatmap: (show) => set({ showHeatmap: show }),
    showVerifiedBadge: true,
    setShowVerifiedBadge: (show) => set({ showVerifiedBadge: show }),
}));
