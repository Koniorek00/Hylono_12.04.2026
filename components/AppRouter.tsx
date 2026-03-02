"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { Navbar, Footer } from './Layout';
import { Breadcrumbs } from './navigation/Breadcrumbs';
import { CartSidebar } from './Cart';
import { SEO, pageSEO } from './SEO';
import { TechType, NavigateFunction } from '../types';
import { TECH_DETAILS } from '../constants';
import { DAY_THEME } from '../constants/themes';
import { OnboardingFlow } from './OnboardingFlow';
import { LoginModal } from './AuthComponents';
import { FeatureGate } from './FeatureGate';
import { GatedView } from './GatedView';
import { ErrorBoundary, NotFoundPage } from './ErrorPage';

// Lazy Load Pages
const Home = dynamic(() => import('./Home').then(m => ({ default: m.Home })), { loading: () => <LoadingScreen /> });
const TechDetail = dynamic(() => import('./TechDetail').then(m => ({ default: m.TechDetail })), { loading: () => <LoadingScreen /> });
const ZoneBuilder = dynamic(() => import('./ZoneBuilder').then(m => ({ default: m.ZoneBuilder })), { loading: () => <LoadingScreen /> });
const StorePage = dynamic(() => import('./StorePage').then(m => ({ default: m.StorePage })), { loading: () => <LoadingScreen /> });

const AboutPage = dynamic(() => import('./AboutPage').then(m => ({ default: m.AboutPage })), { loading: () => <LoadingScreen /> });
const ContactPage = dynamic(() => import('./ContactPage').then(m => ({ default: m.ContactPage })), { loading: () => <LoadingScreen /> });
const FAQPage = dynamic(() => import('./FAQPage').then(m => ({ default: m.FAQPage })), { loading: () => <LoadingScreen /> });
const BlogPage = dynamic(() => import('./BlogPage').then(m => ({ default: m.BlogPage })), { loading: () => <LoadingScreen /> });
const BlogArticle = dynamic(() => import('./BlogArticle').then(m => ({ default: m.BlogArticle })), { loading: () => <LoadingScreen /> });
const ResearchHub = dynamic(() => import('./ResearchHub').then(m => ({ default: m.ResearchHub })), { loading: () => <LoadingScreen /> });
const PrivacyPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.PrivacyPage })), { loading: () => <LoadingScreen /> });
const TermsPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.TermsPage })), { loading: () => <LoadingScreen /> });
const ShippingPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.ShippingPage })), { loading: () => <LoadingScreen /> });
const AccountPage = dynamic(() => import('./AuthComponents').then(m => ({ default: m.AccountPage })), { loading: () => <LoadingScreen /> });
const CheckoutPage = dynamic(() => import('./CheckoutPage').then(m => ({ default: m.CheckoutPage })), { loading: () => <LoadingScreen /> });
const RentalCheckoutPage = dynamic(() => import('./RentalCheckoutPage').then(m => ({ default: m.RentalCheckoutPage })), { loading: () => <LoadingScreen /> });
const WishlistPage = dynamic(() => import('./Wishlist').then(m => ({ default: m.WishlistPage })), { loading: () => <LoadingScreen /> });
const WarrantyPage = dynamic(() => import('./WarrantyPage').then(m => ({ default: m.WarrantyPage })), { loading: () => <LoadingScreen /> });
const LoyaltyProgram = dynamic(() => import('./LoyaltyProgram').then(m => ({ default: m.LoyaltyProgram })), { loading: () => <LoadingScreen /> });
const RewardsPage = dynamic(() => import('./RewardsPage').then(m => ({ default: m.RewardsPage })), { loading: () => <LoadingScreen /> });
const AffiliatePage = dynamic(() => import('./AffiliatePage').then(m => ({ default: m.AffiliatePage })), { loading: () => <LoadingScreen /> });
const PressPage = dynamic(() => import('./PressPage').then(m => ({ default: m.PressPage })), { loading: () => <LoadingScreen /> });
const PressHubPage = dynamic(() => import('./PressHubPage').then(m => ({ default: m.PressHubPage })), { loading: () => <LoadingScreen /> });
const CareersPage = dynamic(() => import('./CareersPage').then(m => ({ default: m.CareersPage })), { loading: () => <LoadingScreen /> });
const PartnerPortal = dynamic(() => import('./PartnerPortal').then(m => ({ default: m.PartnerPortal })), { loading: () => <LoadingScreen /> });
const PartnerLocator = dynamic(() => import('./PartnerLocator').then(m => ({ default: m.PartnerLocator })), { loading: () => <LoadingScreen /> });
const SupportPage = dynamic(() => import('./SupportPage').then(m => ({ default: m.SupportPage })), { loading: () => <LoadingScreen /> });
const HelpCenterPage = dynamic(() => import('./HelpCenterPage').then(m => ({ default: m.HelpCenterPage })), { loading: () => <LoadingScreen /> });

const HHOCarKitPage = dynamic(() => import('./HHOCarKitPage').then(m => ({ default: m.HHOCarKitPage })), { loading: () => <LoadingScreen /> });

const FiresafePage = dynamic(() => import('./FiresafePage').then(m => ({ default: m.FiresafePage })), { loading: () => <LoadingScreen /> });
const MeridianPage = dynamic(() => import('./MeridianPage').then(m => ({ default: m.MeridianPage })), { loading: () => <LoadingScreen /> });
const PartnerStudio = dynamic(() => import('./partner/PartnerStudio').then(m => ({ default: m.PartnerStudio })), { loading: () => <LoadingScreen /> });
const DashboardHome = dynamic(() => import('./partner/DashboardHome').then(m => ({ default: m.DashboardHome })), { loading: () => <LoadingScreen /> });
const Academy = dynamic(() => import('./partner/Academy').then(m => ({ default: m.Academy })), { loading: () => <LoadingScreen /> });
const FleetHealth = dynamic(() => import('./partner/FleetHealth').then(m => ({ default: m.FleetHealth })), { loading: () => <LoadingScreen /> });
const ProtocolPrescriber = dynamic(() => import('./partner/ProtocolPrescriber').then(m => ({ default: m.ProtocolPrescriber })), { loading: () => <LoadingScreen /> });
const Nexus = dynamic(() => import('./partner/Nexus').then(m => ({ default: m.Nexus })), { loading: () => <LoadingScreen /> });
const SupplyShop = dynamic(() => import('./partner/SupplyShop'), { loading: () => <LoadingScreen /> });
const ReferralConnect = dynamic(() => import('./partner/ReferralConnect'), { loading: () => <LoadingScreen /> });
const ClientDocs = dynamic(() => import('./partner/ClientDocs'), { loading: () => <LoadingScreen /> });

const LearningHub = dynamic(() => import('./LearningHub').then(m => ({ default: m.LearningHub })), { loading: () => <LoadingScreen /> });
const ProtocolExplorer = dynamic(() => import('./ProtocolExplorer').then(m => ({ default: m.ProtocolExplorer })), { loading: () => <LoadingScreen /> });
const PartnerProfile = dynamic(() => import('./partner/PartnerProfile').then(m => ({ default: m.PartnerProfile })), { loading: () => <LoadingScreen /> });
const TeamDashboard = dynamic(() => import('./partner/TeamDashboard').then(m => ({ default: m.TeamDashboard })), { loading: () => <LoadingScreen /> });


// NOTE: GuaranteePage redirects to WarrantyPage.

// New Pages (Tasks 3 and 4)
const GuaranteePage = dynamic(() => import('./GuaranteePage').then(m => ({ default: m.GuaranteePage })), { loading: () => <LoadingScreen /> });
const ConditionsPage = dynamic(() => import('./ConditionsPage').then(m => ({ default: m.ConditionsPage })), { loading: () => <LoadingScreen /> });

// ── Batch 1: Legal Extensions ────────────────────────────────────────────────
const ReturnsPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.ReturnsPage })), { loading: () => <LoadingScreen /> });
const CookiePolicyPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.CookiePolicyPage })), { loading: () => <LoadingScreen /> });
const DisclaimerPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.DisclaimerPage })), { loading: () => <LoadingScreen /> });
const AccessibilityPage = dynamic(() => import('./LegalPages').then(m => ({ default: m.AccessibilityPage })), { loading: () => <LoadingScreen /> });

// ── Batch 2: Commerce ────────────────────────────────────────────────────────
const OrderSuccessPage = dynamic(() => import('./OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })), { loading: () => <LoadingScreen /> });
const RentalLandingPage = dynamic(() => import('./RentalLandingPage').then(m => ({ default: m.RentalLandingPage })), { loading: () => <LoadingScreen /> });
const FinancingPage = dynamic(() => import('./FinancingPage').then(m => ({ default: m.FinancingPage })), { loading: () => <LoadingScreen /> });
const WholesalePage = dynamic(() => import('./WholesalePage').then(m => ({ default: m.WholesalePage })), { loading: () => <LoadingScreen /> });

// ── Batch 3: Content ─────────────────────────────────────────────────────────
const TestimonialsPage = dynamic(() => import('./TestimonialsPage').then(m => ({ default: m.TestimonialsPage })), { loading: () => <LoadingScreen /> });
const SitemapPage = dynamic(() => import('./SitemapPage').then(m => ({ default: m.SitemapPage })), { loading: () => <LoadingScreen /> });
const AdvisorsPage = dynamic(() => import('./AdvisorsPage').then(m => ({ default: m.AdvisorsPage })), { loading: () => <LoadingScreen /> });
const VideoLibraryPage = dynamic(() => import('./VideoLibraryPage').then(m => ({ default: m.VideoLibraryPage })), { loading: () => <LoadingScreen /> });

// ── Batch 4: Growth ──────────────────────────────────────────────────────────
const ReferralPage = dynamic(() => import('./ReferralPage').then(m => ({ default: m.ReferralPage })), { loading: () => <LoadingScreen /> });
const UnsubscribePage = dynamic(() => import('./UnsubscribePage').then(m => ({ default: m.UnsubscribePage })), { loading: () => <LoadingScreen /> });
const PressKitPage = dynamic(() => import('./PressKitPage').then(m => ({ default: m.PressKitPage })), { loading: () => <LoadingScreen /> });
const TradeInPage = dynamic(() => import('./TradeInPage').then(m => ({ default: m.TradeInPage })), { loading: () => <LoadingScreen /> });

import { LazyErrorBoundary } from './LazyErrorBoundary';
import { addRecentPage } from '../utils/searchStorage';
import { ProductStructuredData, OrganizationStructuredData } from './StructuredData';
import { CustomCursor } from './shared/CustomCursor';
import { FloatingCTA } from './shared/FloatingCTA';
import { readPublicRuntimeEnv } from '../utils/featureFlagEnv';

const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 animate-pulse">Loading page...</p>
        </div>
    </div>
);

const resolveControlPanelUrl = (): string => {
    const fallback = `${globalThis.location.protocol}//${globalThis.location.hostname || 'localhost'}:3005/admin/stack`;

    if (typeof window === 'undefined') {
        return fallback;
    }

    const fromWindow = readPublicRuntimeEnv('NEXT_PUBLIC_CONTROL_PANEL_URL');
    if (typeof fromWindow === 'string' && fromWindow.trim().length > 0) {
        return fromWindow.trim().replace(/\/$/, '');
    }

    return fallback;
};

const AdminStackRedirect: React.FC = () => {
    const buildAdminStackUrl = () => resolveControlPanelUrl();

    useEffect(() => {
        const targetUrl = buildAdminStackUrl();

        const timer = window.setTimeout(() => {
            window.open(targetUrl, '_self');
        }, 1200);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6 py-14 bg-slate-50">
            <div className="max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Control Panel has moved</h1>
                <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
                    Redirecting you to the dedicated control-panel app:
                    <span className="block mt-2 font-mono text-slate-900">{buildAdminStackUrl()}</span>
                </p>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => window.open(buildAdminStackUrl(), '_self')}
                        className="w-full min-h-11 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Open Control Panel
                    </button>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                    If the panel does not open, start control-panel on port 3005:
                    <span className="block mt-1 font-mono text-slate-700">cd /d "f:\ag projects\Hylono_MAIN\control-panel" && npm run dev</span>
                </p>
            </div>
        </div>
    );
};

export const AppRouter: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [loaded, setLoaded] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [ownedTech, setOwnedTech] = useState<TechType[]>([TechType.HBOT]);
    const theme = DAY_THEME;

    const pathParts = pathname.split('/').filter(Boolean);
    
    // Track navbar visibility for breadcrumb positioning
    const [navbarHidden, setNavbarHidden] = useState(false);
    const lastScrollY = useRef(0);
    const { scrollY } = useScroll();

    // Same scroll detection logic as Navbar to sync visibility state
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = lastScrollY.current;
        // Hide when scrolling down past 80px, show when scrolling up
        if (latest > previous && latest > 80) {
            setNavbarHidden(true);
        } else {
            setNavbarHidden(false);
        }
        lastScrollY.current = latest;
    });

    const currentPage = pathParts[0] || 'home';
    const techSlug = pathParts[0] === 'product' ? pathParts[1] : null;
    const selectedTech = techSlug ? (Object.values(TechType).find(t => t === techSlug) || null) : null;

    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setLoaded(true);
    }, []);

    const navigate: NavigateFunction = useCallback((page, tech, mode) => {
        let nextPath = page === 'home' ? '/' :
            page === 'detail' && tech ? `/product/${tech}` :
                `/${page}`;

        if (mode === 'expert') {
            nextPath += `?view=science`;
        }

        router.push(nextPath);
        window.scrollTo(0, 0);
    }, [router]);

    // Track page visits for recent pages
    useEffect(() => {
        if (pathname === '/') return; // Skip home page

        // Get page title from current route
        const getPageTitle = (): string => {
            if (currentPage === 'product' && selectedTech) {
                const techDetail = TECH_DETAILS[selectedTech];
                return techDetail?.name || selectedTech;
            }
            if (currentPage === 'protocols' && pathParts[1]) {
                return `Protocol: ${pathParts[1]}`;
            }
            if (currentPage === 'conditions' && pathParts[1]) {
                return pathParts[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            }
            if (currentPage === 'blog' && pathParts[1]) {
                return `Blog: ${pathParts[1]}`;
            }
            // Capitalize and format page name
            return currentPage.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        };

        const title = getPageTitle();
        addRecentPage(pathname, title);
    }, [pathname, currentPage, selectedTech, pathParts]);

    useEffect(() => {
        const isLegacyChambersRoute = /^\/chambers(?:3|4|5)?(?:\/.*)?$/.test(pathname);
        const isLegacyBuilderRoute = pathname === '/builder';

        if (isLegacyChambersRoute) {
            const redirectPath = '/product/hbot';
            router.replace(redirectPath);
            window.scrollTo(0, 0);
        } else if (isLegacyBuilderRoute) {
            const redirectPath = '/wellness-planner';
            router.replace(redirectPath);
            window.scrollTo(0, 0);
        }
    }, [pathname, router]);

    const handleTechSelect = useCallback((type: TechType) => {
        navigate('detail', type);
    }, [navigate]);

    const handleBack = useCallback(() => {
        navigate('home');
    }, [navigate]);

    const handleSignupSuccess = useCallback(() => {
        setShowLogin(false);
        setShowOnboarding(true);
    }, []);

    const renderContent = () => (
        <LazyErrorBoundary>
                {currentPage === 'home' && <Home onSelectTech={handleTechSelect} onLaunchBuilder={() => navigate('wellness-planner')} />}
                {currentPage === 'product' && selectedTech && <TechDetail techId={selectedTech} onBack={handleBack} onJumpToTech={handleTechSelect} onNavigate={navigate as any} ownedTech={ownedTech} />}
                {currentPage === 'product' && !selectedTech && <NotFoundPage onNavigate={navigate as any} />}
                {currentPage === 'wellness-planner' && (
                    <FeatureGate flag="feature_builder" fallback={<NotFoundPage onNavigate={navigate as any} />}>
                        <ZoneBuilder onComplete={() => navigate('store')} />
                    </FeatureGate>
                )}
                {currentPage === 'store' && <StorePage onNavigate={navigate as any} onSelectTech={handleTechSelect} onNavigateChambers={() => navigate('detail', TechType.HBOT)} />}
                {currentPage === 'checkout' && <CheckoutPage onNavigate={navigate as any} />}
                {currentPage === 'rental' && pathParts[1] === 'checkout' && <RentalCheckoutPage onNavigate={navigate as any} />}
                {currentPage === 'rental' && pathParts[1] !== 'checkout' && (
                    <FeatureGate flag="feature_rental_landing" fallback={<NotFoundPage onNavigate={navigate as any} />}>
                        <RentalLandingPage onNavigate={navigate as any} />
                    </FeatureGate>
                )}
                {currentPage === 'about' && <AboutPage />}
                {/* ── Help Center (Consolidated) ─────────────────────────────────────── */}
                {currentPage === 'help' && (
                    <HelpCenterPage 
                        initialTab={
                            (searchParams.get('tab') as 'faq' | 'contact' | 'support') || 'faq'
                        } 
                    />
                )}
                {/* Legacy redirects to Help Center */}
                {currentPage === 'contact' && <HelpCenterPage initialTab="contact" />}
                {currentPage === 'faq' && <HelpCenterPage initialTab="faq" />}
                {currentPage === 'blog' && !pathParts[1] && <BlogPage onNavigate={navigate as any} />}
                {currentPage === 'blog' && pathParts[1] && <BlogArticle slug={pathParts[1]} onBack={handleBack} onNavigate={navigate as any} />}
                {currentPage === 'research' && <ResearchHub />}
                {currentPage === 'protocols' && !pathParts[1] && (
                    <FeatureGate flag="feature_protocols_listing" fallback={<NotFoundPage onNavigate={navigate as any} />}>
                        <ProtocolExplorer onNavigate={navigate as any} />
                    </FeatureGate>
                )}
                {currentPage === 'protocols' && pathParts[1] && (
                    <FeatureGate flag="feature_protocols_detail" fallback={<NotFoundPage onNavigate={navigate as any} />}>
                        <ProtocolExplorer slug={pathParts[1]} onNavigate={navigate as any} />
                    </FeatureGate>
                )}
                {currentPage === 'learning' && <LearningHub />}
                {currentPage === 'privacy' && <PrivacyPage />}
                {currentPage === 'terms' && <TermsPage />}
                {currentPage === 'shipping' && <ShippingPage />}
                {currentPage === 'account' && <AccountPage onNavigate={navigate as any} ownedTech={ownedTech} />}
                {currentPage === 'wishlist' && <WishlistPage onNavigate={navigate as any} />}
                {/* Warranty is PUBLIC — customers must be able to read terms before purchasing */}
                {currentPage === 'warranty' && <WarrantyPage />}
                {/* ── Rewards (Consolidated: Referral + Loyalty) ────────────────────────── */}
                {currentPage === 'rewards' && (
                    <GatedView title="Rewards Program" description="Hylono Rewards are exclusive to active system owners and protocol practitioners." onRequestLogin={() => setShowLogin(true)}>
                        <RewardsPage onNavigate={navigate as any} />
                    </GatedView>
                )}
                {currentPage === 'affiliate' && (
                    <GatedView title="Affiliate Portal" description="The Hylono Affiliate Program is currently by-invitation only for certified bio-optimization experts." onRequestLogin={() => setShowLogin(true)}>
                        <AffiliatePage />
                    </GatedView>
                )}
                {/* ── Press Hub (Consolidated) ─────────────────────────────────────── */}
                {currentPage === 'press' && (
                    <PressHubPage 
                        initialTab={
                            (searchParams.get('tab') as 'overview' | 'releases' | 'assets') || 'overview'
                        }
                    />
                )}
                {currentPage === 'careers' && <CareersPage />}
                {currentPage === 'partners' && (
                    <GatedView
                        title="Partner Portal"
                        description="The Hylono Partner Portal is exclusively available to verified clinic partners and certified practitioners."
                        onRequestLogin={() => setShowLogin(true)}
                    >
                        <PartnerPortal />
                    </GatedView>
                )}
                {currentPage === 'locator' && <PartnerLocator />}
                {/* /support redirects to Help Center */}
                {currentPage === 'support' && <HelpCenterPage initialTab="support" />}
                {currentPage === 'hho-car-kit' && <HHOCarKitPage onBack={handleBack} onNavigate={navigate as any} />}
                {currentPage === 'firesafe' && <FiresafePage />}
                {currentPage === 'meridian' && <MeridianPage />}
                {/* /onboarding as inline page route */}
                {currentPage === 'onboarding' && <OnboardingFlow onComplete={() => navigate('home')} />}
                {/* /guarantee → redirect to WarrantyPage (GuaranteePage not yet created) */}
                {currentPage === 'guarantee' && <GuaranteePage />}
                {/* Task 4: /conditions and /conditions/:slug */}
                {currentPage === 'conditions' && (
                    <FeatureGate flag="feature_condition_pages" fallback={<NotFoundPage onNavigate={navigate as any} />}>
                        <ConditionsPage slug={pathParts[1]} onNavigate={navigate as any} />
                    </FeatureGate>
                )}

                {/* ── Batch 1: Legal Extensions ───────────────────────────────────────── */}
                {currentPage === 'returns' && <ReturnsPage />}
                {currentPage === 'cookie-policy' && <CookiePolicyPage />}
                {currentPage === 'disclaimer' && <DisclaimerPage />}
                {currentPage === 'accessibility' && <AccessibilityPage />}

                {/* ── Batch 2: Commerce ───────────────────────────────────────────────── */}
                {currentPage === 'order-success' && <OrderSuccessPage onNavigate={navigate as any} />}
                {currentPage === 'financing' && <FinancingPage onNavigate={navigate as any} />}
                {currentPage === 'wholesale' && <WholesalePage onNavigate={navigate as any} />}

                {/* ── Batch 3: Content ────────────────────────────────────────────────── */}
                {currentPage === 'testimonials' && <TestimonialsPage onNavigate={navigate as any} />}
                {currentPage === 'sitemap' && <SitemapPage onNavigate={navigate as any} />}
                {currentPage === 'advisors' && <AdvisorsPage onNavigate={navigate as any} />}
                {currentPage === 'videos' && <VideoLibraryPage onNavigate={navigate as any} />}

                {/* ── Batch 4: Growth ─────────────────────────────────────────────────── */}
                {currentPage === 'referral' && <ReferralPage onNavigate={navigate as any} />}
                {currentPage === 'unsubscribe' && <UnsubscribePage onNavigate={navigate as any} />}
                {currentPage === 'press-kit' && <PressKitPage onNavigate={navigate as any} />}
                {currentPage === 'trade-in' && <TradeInPage onNavigate={navigate as any} />}

                {currentPage === 'partner-studio' && <PartnerStudio />}
                {currentPage === 'partner' && (
                    <GatedView
                        title="Partner Dashboard"
                        description="The Hylono Partner Dashboard is exclusively available to verified clinic partners and certified practitioners."
                        onRequestLogin={() => setShowLogin(true)}
                    >
                        {(() => {
                            const subPage = (pathParts[1] || 'dashboard').toLowerCase();
                            if (subPage === 'studio') return <PartnerStudio />;
                            if (subPage === 'academy') return <Academy />;
                            if (subPage === 'fleet') return <FleetHealth />;
                            if (subPage === 'protocols') return <ProtocolPrescriber />;
                            if (subPage === 'nexus') return <Nexus />;
                            if (subPage === 'shop') return <SupplyShop />;
                            if (subPage === 'connect') return <ReferralConnect />;
                            if (subPage === 'docs') return <ClientDocs />;
                            if (subPage === 'profile') return <PartnerProfile />;
                            if (subPage === 'team') return <TeamDashboard />;
                            return <DashboardHome />;
                        })()}
                    </GatedView>
                )}
                {currentPage === 'admin' && <AdminStackRedirect />}
                {![
                    'home', 'product', 'wellness-planner',
                    'store', 'checkout', 'rental', 'about', 'contact', 'faq', 'blog', 'research', 'protocols',
                    'privacy', 'terms', 'shipping', 'account', 'wishlist', 'warranty', 'rewards', 'affiliate',
                    'press', 'careers', 'partners', 'locator', 'support', 'partner-studio', 'partner',
                    'hho-car-kit', 'firesafe', 'meridian',
                    'onboarding', 'guarantee', 'conditions', 'learning', 'help',
                    'admin',
                    // Batch 1: Legal
                    'returns', 'cookie-policy', 'disclaimer', 'accessibility',
                    // Batch 2: Commerce
                    'order-success', 'financing', 'wholesale',
                    // Batch 3: Content
                    'testimonials', 'sitemap', 'advisors', 'videos',
                    // Batch 4: Growth
                    'referral', 'unsubscribe', 'press-kit', 'trade-in',
                ].includes(currentPage) && (
                        <NotFoundPage onNavigate={navigate as any} />
                    )}
        </LazyErrorBoundary>
    );

    const getSEOKey = () => {
        if (techSlug) return techSlug;
        if (currentPage === 'partner' && pathParts[1]) {
            return `partner-${pathParts[1].toLowerCase()}`;
        }
        return currentPage;
    };
    const seoKey = getSEOKey();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme.background} ${theme.text} ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:shadow-lg focus:font-medium focus:text-sm"
            >
                Skip to main content
            </a>
            <SEO {...(pageSEO[seoKey] || pageSEO[currentPage] || pageSEO.home)} />

            {/* Structured Data — injected per route for SEO rich snippets */}
            {currentPage === 'home' && <OrganizationStructuredData />}
            {currentPage === 'product' && selectedTech && <ProductStructuredData techId={selectedTech} />}

            {currentPage !== 'partner-studio' && currentPage !== 'partner' && currentPage !== 'meridian' && <Navbar
                setCurrentPage={(page) => {
                    if (page === 'tech') {
                        document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
                        if (currentPage !== 'home') navigate('home');
                    } else if (page === 'home') {
                        handleBack();
                    } else if (page === 'login') {
                        setShowLogin(true);
                    } else if (page === 'cart') {
                        setShowCart(true);
                    } else {
                        navigate(page);
                    }
                }}
                currentPage={currentPage}
                onSelectTech={handleTechSelect}
                onOpenCart={() => setShowCart(true)}
                onOpenLogin={() => setShowLogin(true)}
            />}

            {currentPage !== 'home' && currentPage !== 'meridian' && !currentPage.includes('partner') && (
                <>
                    <div className="h-[68px] md:h-[72px]" />
                    <div 
                        className={`sticky z-40 py-2.5 transition-all duration-500 ease-out ${
                            navbarHidden ? 'top-0' : 'top-[68px] md:top-[72px]'
                        }`}
                    >
                        {/* Clean white background with subtle shadow for separation */}
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
                        {/* Clear separator lines */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200" />
                        {/* Subtle shadow for depth separation */}
                        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-slate-100/50 pointer-events-none" />
                        <div className="relative">
                            <Breadcrumbs pathParts={pathParts} onNavigate={navigate as any} />
                        </div>
                    </div>
                </>
            )}

            <div>
                <main id="main-content" className="relative z-10" tabIndex={-1}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage + (selectedTech || '')}
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
                            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(2px)' }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {currentPage !== 'partner-studio' && currentPage !== 'partner' && currentPage !== 'meridian' && <Footer setCurrentPage={navigate} />}

                {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSignupSuccess={handleSignupSuccess} />}
                {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}
                <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); navigate('checkout'); }} />

                {/* Floating rental CTA — appears after scrolling past hero */}
                {currentPage === 'home' && (
                    <FloatingCTA onNavigate={navigate as any} />
                )}
            </div>

        </div>
    );
};

