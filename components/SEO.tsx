import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    noIndex?: boolean;
}

// Dynamic SEO Component - updates meta tags per page
export const SEO: React.FC<SEOProps> = ({
    title = 'Hylono | Advanced Bio-Optimization Technology',
    description = 'Premium hyperbaric chambers, PEMF, red light therapy & hydrogen generators for cellular regeneration.',
    keywords = 'hyperbaric chamber, HBOT, PEMF, red light therapy, bio-optimization',
    canonical = 'https://hylono.com',
    ogImage = 'https://hylono.com/og-image.jpg',
    noIndex = false
}) => {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Helper to update or create meta tag
        const updateMeta = (name: string, content: string, property = false) => {
            const attr = property ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        // SEO Meta Tags
        updateMeta('description', description);
        updateMeta('keywords', keywords);
        updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

        // Open Graph
        updateMeta('og:title', title, true);
        updateMeta('og:description', description, true);
        updateMeta('og:image', ogImage, true);
        updateMeta('og:url', canonical, true);
        updateMeta('og:type', (keywords?.includes('article') ? 'article' : 'website'), true);

        // Twitter
        updateMeta('twitter:title', title);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', ogImage);

        // Canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = canonical;

    }, [title, description, keywords, canonical, ogImage, noIndex]);

    return null;
};

// Page-specific SEO configurations
export const pageSEO: Record<string, SEOProps> = {
    home: {
        title: 'Hylono | Advanced Bio-Optimization Technology | HBOT, PEMF, RLT',
        description: 'Premium hyperbaric chambers, PEMF devices, red light therapy & hydrogen generators. EU-based, verified technology for cellular regeneration.',
        canonical: 'https://hylono.com/'
    },
    store: {
        title: 'Shop Bio-Optimization Equipment | Hylono Store',
        description: 'Browse our collection of hyperbaric chambers, PEMF mats, red light panels, and hydrogen generators. Free EU shipping on orders over 5000 PLN.',
        keywords: 'buy hyperbaric chamber, PEMF mat price, red light therapy device, hydrogen generator, bio-optimization equipment Poland, wellness technology shop',
        canonical: 'https://hylono.com/store'
    },
    about: {
        title: 'About Hylono | Our Mission & Team',
        description: 'Learn about Hylono mission to democratize access to bio-optimization technology. Meet our team of wellness and technology experts.',
        keywords: 'Hylono company, bio-optimization mission, wellness technology team, regenerative health Poland, HBOT company',
        canonical: 'https://hylono.com/about'
    },
    contact: {
        title: 'Contact Hylono | Get in Touch',
        description: 'Contact our team for product inquiries, support, or partnership opportunities. Based in Warsaw, Poland.',
        keywords: 'contact Hylono, HBOT inquiry Warsaw, bio-optimization support Poland, wellness technology contact',
        canonical: 'https://hylono.com/contact'
    },
    faq: {
        title: 'FAQ | Frequently Asked Questions | Hylono',
        description: 'Find answers to common questions about hyperbaric chambers, PEMF therapy, red light therapy, and hydrogen generators.',
        keywords: 'HBOT FAQ, PEMF questions, red light therapy guide, hydrogen therapy answers, bio-optimization help',
        canonical: 'https://hylono.com/faq'
    },
    blog: {
        title: 'Blog | Bio-Optimization Insights | Hylono',
        description: 'Expert articles on HBOT, PEMF, red light therapy, and hydrogen therapy. Stay updated on wellness technology.',
        keywords: 'HBOT benefits articles, PEMF therapy research, red light science blog, hydrogen therapy guide, bio-optimization news',
        canonical: 'https://hylono.com/blog'
    },
    research: {
        title: "Clinical Research Hub | Hylono Science",
        description: "Explore the peer-reviewed studies and clinical validations behind Hylono's HBOT, PEMF, and RLT technologies.",
        keywords: "clinical studies, hbot research, pemf studies, medical validation",
        canonical: 'https://hylono.com/research'
    },
    protocols: {
        title: "The Protocol Codex | Hylono Bio-Architecture",
        description: "Browse our library of engineered bio-optimization stacks. scientifically designed sequences for Sleep, Recovery, and Cognitive Performance.",
        keywords: "biohacking protocols, sleep stack, recovery protocol, hylono stacks, bio-optimization",
        canonical: 'https://hylono.com/protocols'
    },
    privacy: {
        title: 'Privacy Policy | Hylono',
        description: 'Learn how Hylono protects your personal data. GDPR compliant privacy practices.',
        canonical: 'https://hylono.com/privacy'
    },
    terms: {
        title: 'Terms of Service | Hylono',
        description: 'Terms and conditions for using Hylono products and services.',
        canonical: 'https://hylono.com/terms'
    },
    shipping: {
        title: 'Shipping & Returns | Hylono',
        description: 'Shipping information and return policy for Hylono products. Free EU shipping available.',
        keywords: 'Hylono shipping, EU delivery bio-optimization, return policy wellness devices, free shipping Poland',
        canonical: 'https://hylono.com/shipping'
    },
    warranty: {
        title: 'Warranty & Service | Hylono',
        description: 'Comprehensive coverage for your Hylono systems. 2-year standard warranty and professional repairs.',
        keywords: 'hyperbaric chamber warranty, PEMF device service, bio-optimization repair, Hylono support guarantee',
        canonical: 'https://hylono.com/warranty'
    },
    careers: {
        title: 'Careers | Join Hylono',
        description: 'Build the future of human regeneration. Explore open roles at Hylono.',
        keywords: 'Hylono jobs, bio-optimization careers, wellness technology positions, regenerative health employment Poland',
        canonical: 'https://hylono.com/careers'
    },
    partners: {
        title: 'Partner With Hylono | Clinic & Distributor Portal',
        description: 'Grow your wellness business with premium bio-optimization technology. Join our global partner network.',
        keywords: 'Hylono partner program, HBOT clinic partnership, bio-optimization distributor, wellness franchise opportunity',
        canonical: 'https://hylono.com/partners'
    },
    affiliate: {
        title: 'Affiliate Program | Share Hylono',
        description: 'Join the Hylono movement and earn commissions on successful referrals.',
        keywords: 'Hylono affiliate, bio-optimization referral program, wellness technology commission, HBOT affiliate marketing',
        canonical: 'https://hylono.com/affiliate'
    },
    press: {
        title: 'Press & Media | Hylono News',
        description: 'Latest updates, media kits, and press releases from Hylono Systems.',
        keywords: 'Hylono press release, bio-optimization news, wellness technology media, HBOT company announcements',
        canonical: 'https://hylono.com/press'
    },
    rewards: {
        title: 'Hylono Rewards | Loyalty Program',
        description: 'Earn points on every purchase. Bronze, Silver, Gold tiers with exclusive benefits.',
        keywords: 'Hylono loyalty program, bio-optimization rewards, wellness points system, customer benefits tier',
        canonical: 'https://hylono.com/rewards'
    },
    support: {
        title: 'Hylono Support | Help Center',
        description: 'Get expert assistance for your Hylono systems. Technical help, order tracking, and protocol guidance.',
        keywords: 'Hylono support, HBOT technical help, PEMF troubleshooting, bio-optimization customer service',
        canonical: 'https://hylono.com/support'
    },
    locator: {
        title: 'Find a Hylono Center | Partner Locator',
        description: 'Locate certified Hylono regeneration centers near you for professional sessions.',
        keywords: 'HBOT center near me, hyperbaric chamber Warsaw, bio-optimization clinic Poland, Hylono partner location, PEMF therapy near me',
        canonical: 'https://hylono.com/locator'
    },
    HBOT: {
        title: 'Hyperbaric Oxygen Therapy (mHBOT) | Hylono',
        description: 'Explore professional-grade hyperbaric chambers. Verified safety standards and repeatable protocol outcomes for cellular regeneration.',
        keywords: 'hyperbaric chamber, HBOT, oxygen therapy, pressure healing, Hylono HBOT',
        canonical: 'https://hylono.com/product/HBOT'
    },
    PEMF: {
        title: 'PEMF Therapy | Pulsed Electromagnetic Field | Hylono',
        description: 'Advanced PEMF technology for cellular energy and recovery. EU-verified devices for non-invasive regeneration.',
        keywords: 'PEMF mat, electromagnetic field therapy, cellular health, Hylono PEMF',
        canonical: 'https://hylono.com/product/PEMF'
    },
    RLT: {
        title: 'Red Light Therapy | Photobiomodulation | Hylono',
        description: 'Professional red and near-infrared light therapy. ATP production, skin renewal, and inflammation reduction.',
        keywords: 'red light therapy, RLT, photobiomodulation, light panels, Hylono RLT',
        canonical: 'https://hylono.com/product/RLT'
    },
    HYDROGEN: {
        title: 'Molecular Hydrogen Therapy | Hylono',
        description: 'High-purity molecular hydrogen generators. Selective antioxidant therapy for neuroprotection and systemic recovery.',
        keywords: 'hydrogen inhaler, molecular hydrogen, antioxidant therapy, Hylono hydrogen',
        canonical: 'https://hylono.com/product/HYDROGEN'
    },
    checkout: {
        title: 'Secure Checkout | Hylono',
        description: 'Complete your order for Hylono bio-optimization systems. Secure payment processing for premium wellness technology.',
        canonical: 'https://hylono.com/checkout',
        noIndex: true
    },
    builder: {
        title: 'Zone Configurator | Design Your Hylono Space',
        description: 'Custom build your bio-optimization zone. Select technology combinations for professional or home use.',
        keywords: 'bio-optimization zone design, HBOT room setup, wellness space configurator, regeneration zone builder',
        canonical: 'https://hylono.com/builder'
    },
    'HERO-4.6T2': {
        title: 'Hylono | Regeneration Architecture',
        description: 'The complete ecosystem of non-invasive regeneration technology — verified, accessible, deployable. Where mind connects with matter.',
        canonical: 'https://hylono.com/HERO-4.6T2'
    },
    meridian: {
        title: 'Hylono | Meridian',
        description: 'Where Mind Connects With Matter. The architecture of regeneration, made accessible.',
        canonical: 'https://hylono.com/meridian'
    },

    wishlist: {
        title: 'My Wishlist | Hylono',
        description: 'Saved bio-optimization systems and protocol configurations.',
        canonical: 'https://hylono.com/wishlist',
        noIndex: true
    },
    account: {
        title: 'My Account | Hylono',
        description: 'Manage your Hylono orders, active protocols, and device settings.',
        canonical: 'https://hylono.com/account',
        noIndex: true
    },
    // === PARTNER HUB ROUTES (All noIndex for internal tools) ===
    partner: {
        title: 'Partner Hub | Hylono',
        description: 'Access your Hylono Partner Dashboard for clinic management, training, and growth tools.',
        canonical: 'https://hylono.com/partner',
        noIndex: true
    },
    'partner-dashboard': {
        title: 'Partner Dashboard | Hylono',
        description: 'Your command center for managing Hylono clinic operations.',
        canonical: 'https://hylono.com/partner/dashboard',
        noIndex: true
    },
    'partner-studio': {
        title: 'Partner Studio | Hylono',
        description: 'Create professional marketing materials and bio-optimization content.',
        canonical: 'https://hylono.com/partner/studio',
        noIndex: true
    },
    'partner-academy': {
        title: 'Hylono Academy | Partner Training Hub',
        description: 'Master bio-optimization technology with guided micro-learning, certifications, and AI-powered tutoring.',
        keywords: 'HBOT training, PEMF certification, bio-optimization course, partner education',
        canonical: 'https://hylono.com/partner/academy',
        noIndex: true
    },
    'partner-fleet': {
        title: 'Fleet Health | Device Management Hub',
        description: 'Monitor and maintain your Hylono device fleet with real-time diagnostics.',
        canonical: 'https://hylono.com/partner/fleet',
        noIndex: true
    },
    'partner-protocols': {
        title: 'Protocol Prescriber | Hylono',
        description: 'Design and prescribe personalized bio-optimization treatment pathways.',
        canonical: 'https://hylono.com/partner/protocols',
        noIndex: true
    },
    'partner-nexus': {
        title: 'Nexus Clinical System | Hylono',
        description: 'Comprehensive client management and clinical assistant platform.',
        canonical: 'https://hylono.com/partner/nexus',
        noIndex: true
    },
    'partner-shop': {
        title: 'Supply Shop | Partner Store',
        description: 'Order consumables, accessories, and replacement parts for your Hylono systems.',
        canonical: 'https://hylono.com/partner/shop',
        noIndex: true
    },
    'partner-connect': {
        title: 'Referral Connect | Hylono',
        description: 'Manage home unit referrals and track commission earnings.',
        canonical: 'https://hylono.com/partner/connect',
        noIndex: true
    },
    'partner-docs': {
        title: 'Client Docs | Document Generator',
        description: 'Generate professional consent forms, waivers, and client documentation.',
        canonical: 'https://hylono.com/partner/docs',
        noIndex: true
    },
    'partner-profile': {
        title: 'Partner Profile | Hylono',
        description: 'View your certifications, skill progress, and learning history.',
        canonical: 'https://hylono.com/partner/profile',
        noIndex: true
    },
    'partner-team': {
        title: 'Team Dashboard | Hylono',
        description: 'Manage staff certifications, permissions, and training progress.',
        canonical: 'https://hylono.com/partner/team',
        noIndex: true
    },

};
