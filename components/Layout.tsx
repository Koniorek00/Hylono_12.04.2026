import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
    Menu, X, ArrowRight, Hexagon, ChevronDown, Sparkles, Server,
    ShieldCheck, Sun, Moon, Instagram, Linkedin, Youtube, User,
    ExternalLink, Shield, CheckCircle, Globe, Award, FileCheck,
    Cpu, Zap, Droplets, Activity, Wind, Accessibility
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'motion/react';
import { TechType, NavigateFunction } from '../types';
import { Newsletter } from './Newsletter';
import { openCookieSettings } from './CookieConsent';
import { isFeatureEnabled } from '../utils/featureFlags';
import { batch3NavigationContent } from '../content/batch3';
import { TECH_DETAILS } from '../constants';
import { GlobalSearch } from './GlobalSearch';
import { CartIcon } from './Cart';

// Lazy load with preloading capability
const loadMegaMenu = () => import('./MegaMenu').then(module => ({ default: module.MegaMenu }));
const MegaMenu = dynamic(loadMegaMenu, { loading: () => null });

interface LayoutProps {
    children: React.ReactNode;
    setCurrentPage: (page: string) => void;
    currentPage: string;
}

import { CommandPalette } from './shared/CommandPalette';
import { Breadcrumbs } from './navigation/Breadcrumbs';
import { useMultitoolStore } from '../src/stores/multitoolStore';

// Helper to get button position for dropdown positioning
const getButtonPosition = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
        top: rect.bottom + 8, // 8px below button
        right: window.innerWidth - rect.right,
    };
};

const pageToHref = (page: string): string => {
    if (!page || page === 'home') return '/';

    const normalized = page.trim().replace(/^\/+/, '');

    if (normalized === 'tech' || normalized === 'detail') return '/store';
    if (normalized === 'videos') return '/learning';
    if (normalized === 'referral') return '/rewards';
    if (normalized === 'financing') return '/checkout';
    if (normalized === 'trade-in') return '/returns';
    if (normalized === 'press-kit') return '/press';
    if (normalized === 'disclaimer') return '/terms';
    if (normalized === 'accessibility') return '/support';
    if (normalized === 'sitemap') return '/';

    return `/${normalized}`;
};

export const Navbar: React.FC<{
    setCurrentPage: (p: string) => void;
    currentPage: string;
    onSelectTech: (t: TechType) => void;
    onOpenCart?: () => void;
    onOpenLogin?: () => void;
}> = ({ setCurrentPage, currentPage, onSelectTech, onOpenCart, onOpenLogin }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { isOpen: multitoolOpen, toggle: toggleMultitool, openAtPosition } = useMultitoolStore();
    
    const handleAccessibilityClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (multitoolOpen) {
            toggleMultitool();
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            openAtPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
    };
    const [announcementDismissed, setAnnouncementDismissed] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            return window.localStorage.getItem('hylono_announcement_dismissed') === 'true';
        } catch {
            return false;
        }
    });
    const lastScrollY = useRef(0);
    const navGoalsEnabled = isFeatureEnabled('feature_nav_goals');
    const headerTrustEnabled = isFeatureEnabled('feature_header_trust');
    const lowestRental = Math.min(
        ...Object.values(TECH_DETAILS)
            .map((tech) => tech.rentalPrice)
            .filter((value): value is number => typeof value === 'number' && value > 0)
    );
    const trustMarkers = batch3NavigationContent.trustMarkers(lowestRental);

    // Scroll progress bar
    const { scrollYProgress, scrollY } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

    // Smart hide/show navbar on scroll direction
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = lastScrollY.current;
        setIsScrolled(latest > 20);
        // Only hide after scrolled down 80px, and only when scrolling down
        if (latest > previous && latest > 80) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        lastScrollY.current = latest;
    });

    const navClasses = `fixed top-0 left-0 right-0 z-50 border-b py-4 ${isScrolled
        ? 'bg-white/60 backdrop-blur-xl border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
        : 'bg-transparent border-transparent'
        }`;

    const NavLink = ({ label, target, setCurrentPage, setMobileOpen, currentPage }: { label: string; target: string; setCurrentPage: (p: string) => void; setMobileOpen: (o: boolean) => void; currentPage: string }) => (
        <Link
            href={pageToHref(target)}
            onClick={(event) => {
                event.preventDefault();
                setCurrentPage(target);
                setMobileOpen(false);
            }}
            className={`relative text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-500 group futuristic-font ${currentPage === target ? 'text-gray-900 font-bold' : 'text-gray-500'
                }`}
        >
            <span className="relative z-10">{label}</span>
            <span className={`absolute -bottom-2 left-0 w-full h-px bg-gray-900 transform scale-x-0 transition-transform duration-300 origin-right group-hover:scale-x-100 group-hover:origin-left ${currentPage === target ? 'scale-x-100' : ''}`} />
        </Link>
    );

    return (
        <>
            <motion.nav
            className={`${navClasses} animate-resonance`}
            variants={{
                visible: { y: 0 },
                hidden: { y: '-100%' },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 origin-left z-10 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                style={{ scaleX }}
            />

            {/* NOTE: Skip-to-main-content link is in AppRouter.tsx to avoid duplication (WCAG 2.4.1) */}
            <CommandPalette onNavigate={setCurrentPage} />

            {headerTrustEnabled && (
                <div className="border-b border-white/20 bg-white/60 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-1 hidden md:flex items-center justify-end gap-4">
                        {trustMarkers.slice(0, 3).map((marker) => (
                            <span key={marker} className="text-[9px] uppercase tracking-[0.18em] text-slate-600 font-semibold">
                                {marker}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 flex justify-between md:justify-center items-center md:gap-16">
                {/* Logo */}
                <Link
                    href="/"
                    data-testid="logo-link"
                    onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage('home');
                    }}
                    className="flex items-center gap-3 group"
                >
                    <Hexagon className="text-gray-900 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.5} size={24} />
                    <div className="flex flex-col items-start">
                        <span className="text-xl md:text-2xl font-bold tracking-[0.1em] futuristic-font text-gray-900 leading-none">
                            HYLONO
                        </span>
                        <span className="text-[8px] uppercase tracking-[0.4em] text-gray-400 group-hover:text-gold transition-colors">
                            Systems
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-10">
                    <NavLink label="Concept" target="home" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />

                    {navGoalsEnabled && (
                        <button
                            onClick={() => setCurrentPage('conditions')}
                            className="text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 group flex items-center gap-1 futuristic-font text-gray-500 hover:text-gray-900"
                        >
                            {batch3NavigationContent.goalsLabel}
                        </button>
                    )}

                    {/* Mega Menu Trigger - Primary Navigation Hub */}
                    <button
                        onMouseEnter={() => loadMegaMenu()}
                        onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                        className={`text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 group flex items-center gap-1 futuristic-font ${megaMenuOpen ? 'text-cyan-500 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Explore <ChevronDown size={12} className={`transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <NavLink label="Store" target="store" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                    <NavLink label="Wellness Planner" target="wellness-planner" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                    <NavLink label="Contact" target="contact" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />

                </div>

                <MegaMenu
                    isOpen={megaMenuOpen}
                    onClose={() => setMegaMenuOpen(false)}
                    onNavigate={(page, techId) => {
                        setMegaMenuOpen(false);
                        if (techId) {
                            onSelectTech(techId);
                        } else {
                            setCurrentPage(page);
                        }
                    }}
                />

                <CartIcon onClick={() => onOpenCart?.()} />

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <GlobalSearch onNavigate={setCurrentPage} />
                    <button 
                        onClick={handleAccessibilityClick}
                        className={`p-2 rounded-full transition-colors ${
                            multitoolOpen 
                                ? 'bg-cyan-500 text-white' 
                                : 'hover:bg-slate-100 text-gray-600'
                        }`}
                        aria-label="Open accessibility tools"
                        aria-expanded={multitoolOpen}
                    >
                        <Accessibility size={20} />
                    </button>
                    <button 
                        onClick={onOpenLogin} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Open user account menu"
                    >
                        <User size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-2">
                    <Link
                        href={pageToHref('store')}
                        onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage('store');
                            setMobileOpen(false);
                        }}
                        className="text-[10px] tracking-[0.2em] uppercase text-gray-700 font-semibold px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                    >
                        Store
                    </Link>
                    <GlobalSearch onNavigate={setCurrentPage} />
                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileOpen && (
                    <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-gray-100 p-8 flex flex-col space-y-8 md:hidden h-screen animate-fade-in">
                        {headerTrustEnabled && (
                            <div className="space-y-2">
                                {trustMarkers.slice(0, 2).map((marker) => (
                                    <p key={marker} className="text-[10px] uppercase tracking-[0.16em] text-slate-500 font-semibold">{marker}</p>
                                ))}
                            </div>
                        )}
                        <NavLink label="Concept" target="home" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        {navGoalsEnabled && (
                            <NavLink label="Goals" target="conditions" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        )}
                        <NavLink label="Store" target="store" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        <NavLink label="Ecosystem" target="tech" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        <NavLink label="Wellness Planner" target="wellness-planner" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        <NavLink label="Contact" target="contact" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />

                        {navGoalsEnabled && (
                            <div className="pt-2 border-t border-slate-200 space-y-3">
                                {batch3NavigationContent.goals.map((goal) => (
                                    <button
                                        key={goal.path}
                                        onClick={() => {
                                            setCurrentPage(goal.path);
                                            setMobileOpen(false);
                                        }}
                                        className="block text-left text-xs uppercase tracking-[0.15em] text-slate-500 hover:text-slate-900"
                                    >
                                        {goal.label}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                )
            }
        </motion.nav>
        </>
    );
};

export const Footer: React.FC<{ setCurrentPage?: NavigateFunction }> = ({ setCurrentPage }) => {
    const navigate = React.useCallback((page: string) => {
        setCurrentPage?.(page);
        window.scrollTo(0, 0);
    }, [setCurrentPage]);

    const navigateToTech = React.useCallback((tech: TechType) => {
        setCurrentPage?.('detail', tech);
        window.scrollTo(0, 0);
    }, [setCurrentPage]);

    type FooterLink = {
        label: string;
        target?: string;
        tech?: TechType;
        icon?: React.ReactNode;
    };

    type FooterSection = {
        title: string;
        links: FooterLink[];
    };

    const footerSections: FooterSection[] = [
        {
            title: "Technology",
            links: [
                { label: "Hyperbaric (HBOT)", tech: TechType.HBOT, icon: <Wind size={12} /> },
                { label: "Pulsed EMF (PEMF)", tech: TechType.PEMF, icon: <Activity size={12} /> },
                { label: "Red Light (RLT)", tech: TechType.RLT, icon: <Sun size={12} /> },
                { label: "Hydrogen (H2)", tech: TechType.HYDROGEN, icon: <Droplets size={12} /> },
                { label: "Vagus Nerve (VNS)", tech: TechType.VNS, icon: <Zap size={12} /> },
                { label: "EWOT Training", tech: TechType.EWOT, icon: <Wind size={12} /> },
                { label: "Cryotherapy", tech: TechType.CRYO, icon: <Activity size={12} /> },
                { label: "Compare All", target: "store" }
            ]
        },
        {
            title: "Products",
            links: [
                { label: "HBOT Chambers", tech: TechType.HBOT, icon: <Wind size={12} /> },
                { label: "HHO Hydrogen Kits", target: "hho-car-kit", icon: <Droplets size={12} /> },
                { label: "Firesafe™ Range", target: "firesafe", icon: <ShieldCheck size={12} /> }
            ]
        },
        {
            title: "Ecosystem",
            links: [
                { label: "Wellness Planner", target: "wellness-planner" },
                { label: "Protocol Codex", target: "protocols" },
                { label: "Research Hub", target: "research" },
                { label: "Video Library", target: "videos" },
                { label: "Learning Center", target: "learning" },
                { label: "Support Hub", target: "support" },
                { label: "Rewards", target: "rewards" },
                { label: "Refer & Earn", target: "referral" },
                { label: "Financing", target: "financing" },
                { label: "Trade-In", target: "trade-in" },
                { label: "30-Day Guarantee", target: "guarantee" },
                { label: "Health Conditions", target: "conditions" }
            ]
        },
        {
            title: "Company",
            links: [
                { label: "Our Mission", target: "about" },
                { label: "Medical Advisors", target: "advisors" },
                { label: "Testimonials", target: "testimonials" },
                { label: "Science & Evidence", target: "blog" },
                { label: "Careers", target: "careers" },
                { label: "Press & Media", target: "press" },
                { label: "Press Kit", target: "press-kit" },
                { label: "Contact", target: "contact" }
            ]
        },
        {
            title: "Partnerships",
            links: [
                { label: "Partner Portal", target: "partners" },
                { label: "Find a Center", target: "locator" },
                { label: "Affiliate Program", target: "affiliate" },
                { label: "Wholesale Info", target: "wholesale" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", target: "privacy" },
                { label: "Terms of Service", target: "terms" },
                { label: "Shipping Policy", target: "shipping" },
                { label: "Returns Policy", target: "returns" },
                { label: "Warranty", target: "warranty" },
                { label: "Cookie Policy", target: "cookie-policy" },
                { label: "Disclaimer", target: "disclaimer" },
                { label: "Accessibility", target: "accessibility" },
                { label: "Sitemap", target: "sitemap" }
            ]
        }
    ];

    return (
        <footer className="bg-[#050505] text-white py-16 border-t border-white/5 relative overflow-hidden z-[60]">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main Grid: Brand + 5 Columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <button onClick={() => navigate('home')} className="flex items-center gap-4 mb-6 group">
                            <Hexagon className="text-white transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.2} size={36} />
                            <div className="flex flex-col items-start text-left">
                                <span className="text-2xl font-bold tracking-[0.1em] futuristic-font text-white leading-none">
                                    HYLONO
                                </span>
                                <span className="text-[8px] uppercase tracking-[0.4em] text-cyan-500/80 font-bold">
                                    Bio-Optimization
                                </span>
                            </div>
                        </button>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-8 font-medium">© 2026 HYLONO SYSTEMS</p>
                        <div className="flex items-center gap-3 mb-6">
                            <a
                                href="https://www.instagram.com/hylono"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
                                aria-label="Follow Hylono on Instagram"
                            >
                                <Instagram size={14} />
                            </a>
                            <a
                                href="https://x.com/hylono"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
                                aria-label="Follow Hylono on X (Twitter)"
                            >
                                <span className="font-bold text-sm">𝕏</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/company/hylono"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
                                aria-label="Follow Hylono on LinkedIn"
                            >
                                <Linkedin size={14} />
                            </a>
                            <a
                                href="https://www.youtube.com/@hylono"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
                                aria-label="Subscribe to Hylono on YouTube"
                            >
                                <Youtube size={14} />
                            </a>
                        </div>
                        <div className="max-w-[340px]">
                            <Newsletter />
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="col-span-1">
                            <h4 className="uppercase tracking-[0.15em] text-[9px] font-bold text-gray-400 mb-5">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <button
                                            onClick={() => {
                                                if (link.tech) {
                                                    navigateToTech(link.tech);
                                                    return;
                                                }

                                                if (link.target) {
                                                    navigate(link.target);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-white text-[11px] tracking-wide transition-colors flex items-center gap-1.5 group"
                                        >
                                            {link.icon && <span className="opacity-40 group-hover:opacity-100 transition-opacity">{link.icon}</span>}
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                                {/* Cookie Settings — only in Legal column */}
                                {section.title === 'Legal' && (
                                    <li>
                                        <button
                                            onClick={openCookieSettings}
                                            className="text-gray-400 hover:text-white text-[11px] tracking-wide transition-colors flex items-center gap-1.5 group"
                                        >
                                            Cookie Settings
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </footer>

    );
};
