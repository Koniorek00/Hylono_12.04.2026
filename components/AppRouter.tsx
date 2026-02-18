import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Navbar, Footer } from './Layout';
import { Breadcrumbs } from './navigation/Breadcrumbs';
import { CartSidebar } from './Cart';
import { SEO, pageSEO } from './SEO';
import { TechType, NavigateFunction } from '../types';
import { TECH_DETAILS } from '../constants';
import { DAY_THEME } from '../constants/themes';
import { useAuth } from '../context/AuthContext';
import { OnboardingFlow } from './OnboardingFlow';
import { LoginModal } from './AuthComponents';
import { isFeatureEnabled, FeatureFlag } from '../utils/featureFlags';
import { GatedView } from './GatedView';
import { ErrorBoundary, NotFoundPage } from './ErrorPage';

// Lazy Load Pages
const Home = React.lazy(() => import('./Home').then(m => ({ default: m.Home })));
const TechDetail = React.lazy(() => import('./TechDetail').then(m => ({ default: m.TechDetail })));
const ZoneBuilder = React.lazy(() => import('./ZoneBuilder').then(m => ({ default: m.ZoneBuilder })));
const StorePage = React.lazy(() => import('./StorePage').then(m => ({ default: m.StorePage })));

const AboutPage = React.lazy(() => import('./AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = React.lazy(() => import('./FAQPage').then(m => ({ default: m.FAQPage })));
const BlogPage = React.lazy(() => import('./BlogPage').then(m => ({ default: m.BlogPage })));
const BlogArticle = React.lazy(() => import('./BlogArticle').then(m => ({ default: m.BlogArticle })));
const ResearchHub = React.lazy(() => import('./ResearchHub').then(m => ({ default: m.ResearchHub })));
const PrivacyPage = React.lazy(() => import('./LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = React.lazy(() => import('./LegalPages').then(m => ({ default: m.TermsPage })));
const ShippingPage = React.lazy(() => import('./LegalPages').then(m => ({ default: m.ShippingPage })));
const AccountPage = React.lazy(() => import('./AuthComponents').then(m => ({ default: m.AccountPage })));
const CheckoutPage = React.lazy(() => import('./CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const RentalCheckoutPage = React.lazy(() => import('./RentalCheckoutPage').then(m => ({ default: m.RentalCheckoutPage })));
const WishlistPage = React.lazy(() => import('./Wishlist').then(m => ({ default: m.WishlistPage })));
const WarrantyPage = React.lazy(() => import('./WarrantyPage').then(m => ({ default: m.WarrantyPage })));
const LoyaltyProgram = React.lazy(() => import('./LoyaltyProgram').then(m => ({ default: m.LoyaltyProgram })));
const AffiliatePage = React.lazy(() => import('./AffiliatePage').then(m => ({ default: m.AffiliatePage })));
const PressPage = React.lazy(() => import('./PressPage').then(m => ({ default: m.PressPage })));
const CareersPage = React.lazy(() => import('./CareersPage').then(m => ({ default: m.CareersPage })));
const PartnerPortal = React.lazy(() => import('./PartnerPortal').then(m => ({ default: m.PartnerPortal })));
const PartnerLocator = React.lazy(() => import('./PartnerLocator').then(m => ({ default: m.PartnerLocator })));
const SupportPage = React.lazy(() => import('./SupportPage').then(m => ({ default: m.SupportPage })));

const PartnerStudio = React.lazy(() => import('./partner/PartnerStudio').then(m => ({ default: m.PartnerStudio })));
const DashboardHome = React.lazy(() => import('./partner/DashboardHome').then(m => ({ default: m.DashboardHome })));
const Academy = React.lazy(() => import('./partner/Academy').then(m => ({ default: m.Academy })));
const FleetHealth = React.lazy(() => import('./partner/FleetHealth').then(m => ({ default: m.FleetHealth })));
const ProtocolPrescriber = React.lazy(() => import('./partner/ProtocolPrescriber').then(m => ({ default: m.ProtocolPrescriber })));
const Nexus = React.lazy(() => import('./partner/Nexus').then(m => ({ default: m.Nexus })));
const SupplyShop = React.lazy(() => import('./partner/SupplyShop'));
const ReferralConnect = React.lazy(() => import('./partner/ReferralConnect'));
const ClientDocs = React.lazy(() => import('./partner/ClientDocs'));

const ProtocolExplorer = React.lazy(() => import('./ProtocolExplorer').then(m => ({ default: m.ProtocolExplorer })));
const PartnerProfile = React.lazy(() => import('./partner/PartnerProfile').then(m => ({ default: m.PartnerProfile })));
const TeamDashboard = React.lazy(() => import('./partner/TeamDashboard').then(m => ({ default: m.TeamDashboard })));

import { LazyErrorBoundary } from './LazyErrorBoundary';
import { ProductStructuredData, OrganizationStructuredData } from './StructuredData';

const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 animate-pulse">Loading page...</p>
        </div>
    </div>
);

export const AppRouter: React.FC = () => {
    const [loaded, setLoaded] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [ownedTech, setOwnedTech] = useState<TechType[]>([TechType.HBOT]);
    const theme = DAY_THEME;

    const [pathname, setPathname] = useState(() => window.location.pathname);
    const pathParts = pathname.split('/').filter(Boolean);

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

        window.history.pushState({}, '', nextPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handlePop = () => setPathname(window.location.pathname);
        window.addEventListener('popstate', handlePop);
        return () => window.removeEventListener('popstate', handlePop);
    }, []);

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
            <React.Suspense fallback={<LoadingScreen />}>
                {currentPage === 'home' && <Home onSelectTech={handleTechSelect} onLaunchBuilder={() => navigate('builder')} />}
                {currentPage === 'product' && selectedTech && <TechDetail techId={selectedTech} onBack={handleBack} onJumpToTech={handleTechSelect} ownedTech={ownedTech} />}
                {currentPage === 'builder' && <ZoneBuilder onComplete={() => navigate('dashboard')} />}
                {currentPage === 'store' && <StorePage onNavigate={navigate} onSelectTech={handleTechSelect} />}
                {currentPage === 'checkout' && <CheckoutPage onNavigate={navigate} />}
                {currentPage === 'rental' && pathParts[1] === 'checkout' && <RentalCheckoutPage onNavigate={navigate} />}
                {currentPage === 'about' && <AboutPage />}
                {currentPage === 'contact' && <ContactPage />}
                {currentPage === 'faq' && <FAQPage />}
                {currentPage === 'blog' && !pathParts[1] && <BlogPage onNavigate={navigate} />}
                {currentPage === 'blog' && pathParts[1] && <BlogArticle slug={pathParts[1]} onBack={handleBack} onNavigate={navigate} />}
                {currentPage === 'research' && <ResearchHub />}
                {currentPage === 'protocols' && <ProtocolExplorer />}
                {currentPage === 'privacy' && <PrivacyPage />}
                {currentPage === 'terms' && <TermsPage />}
                {currentPage === 'shipping' && <ShippingPage />}
                {currentPage === 'account' && <AccountPage onNavigate={navigate} ownedTech={ownedTech} />}
                {currentPage === 'wishlist' && <WishlistPage onNavigate={navigate} />}
                {currentPage === 'warranty' && (
                    <GatedView title="Hylono Warranty" description="Warranty claims and professional service history require a verified device owner account.">
                        <WarrantyPage />
                    </GatedView>
                )}
                {currentPage === 'rewards' && (
                    <GatedView title="Loyalty Program" description="Hylono Rewards and Tier status are exclusive to active system owners and protocol practitioners.">
                        <LoyaltyProgram />
                    </GatedView>
                )}
                {currentPage === 'affiliate' && (
                    <GatedView title="Affiliate Portal" description="The Hylono Affiliate Program is currently by-invitation only for certified bio-optimization experts.">
                        <AffiliatePage />
                    </GatedView>
                )}
                {currentPage === 'press' && (
                    <GatedView title="Press & Media" description="Our digital press kit and high-resolution media assets are available to accredited media partners only.">
                        <PressPage />
                    </GatedView>
                )}
                {currentPage === 'careers' && (
                    <GatedView title="Careers at Hylono" description="To view our current open roles in bio-engineering and wellness technology, please create a candidate profile.">
                        <CareersPage />
                    </GatedView>
                )}
                {currentPage === 'partners' && <PartnerPortal />}
                {currentPage === 'locator' && <PartnerLocator />}
                {currentPage === 'support' && <SupportPage />}

                {currentPage === 'partner-studio' && <PartnerStudio />}
                {currentPage === 'partner' && (
                    (() => {
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
                    })()
                )}
                {![
                    'home', 'product', 'builder',
                    'store', 'checkout', 'rental', 'about', 'contact', 'faq', 'blog', 'research', 'protocols',
                    'privacy', 'terms', 'shipping', 'account', 'wishlist', 'warranty', 'rewards', 'affiliate',
                    'press', 'careers', 'partners', 'locator', 'support', 'partner-studio', 'partner'
                ].includes(currentPage) && (
                        <NotFoundPage onNavigate={navigate} />
                    )}
            </React.Suspense>
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

            {currentPage !== 'partner-studio' && currentPage !== 'partner' && <Navbar
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

            {currentPage !== 'home' && !currentPage.includes('partner') && (
                <>
                    <div className="h-[68px] md:h-[72px]" />
                    <div className="sticky top-[68px] md:top-[72px] z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-2.5 transition-all duration-300">
                        <Breadcrumbs pathParts={pathParts} onNavigate={navigate} />
                    </div>
                </>
            )}

            <div>
                <main id="main-content" className="relative z-10" tabIndex={-1}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage + (selectedTech || '')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                            className="w-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {currentPage !== 'partner-studio' && currentPage !== 'partner' && <Footer setCurrentPage={navigate} />}

                <React.Suspense fallback={null}>
                    {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSignupSuccess={handleSignupSuccess} />}
                    {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}
                </React.Suspense>
                <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); navigate('checkout'); }} />
            </div>
        </div>
    );
};
