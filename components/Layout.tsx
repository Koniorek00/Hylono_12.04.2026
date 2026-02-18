import React, { useState, useEffect } from 'react';
import {
    Menu, X, ArrowRight, Hexagon, ChevronDown, Sparkles, Server,
    ShieldCheck, Sun, Moon, Instagram, Linkedin, Youtube, ShoppingCart, User,
    ExternalLink, Shield, CheckCircle, Globe, Award, FileCheck,
    Cpu, Zap, Droplets, Activity, Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechType } from '../types';
import { Newsletter } from './Newsletter';

// Lazy load with preloading capability
const loadMegaMenu = () => import('./MegaMenu').then(module => ({ default: module.MegaMenu }));
const MegaMenu = React.lazy(loadMegaMenu);

interface LayoutProps {
    children: React.ReactNode;
    setCurrentPage: (page: string) => void;
    currentPage: string;
}

import { CommandPalette } from './shared/CommandPalette';
import { Breadcrumbs } from './navigation/Breadcrumbs';

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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-700 border-b py-4 ${isScrolled
        ? 'bg-white/60 backdrop-blur-xl border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
        : 'bg-transparent border-transparent'
        }`;

    const NavLink = ({ label, target, setCurrentPage, setMobileOpen, currentPage }: { label: string; target: string; setCurrentPage: (p: string) => void; setMobileOpen: (o: boolean) => void; currentPage: string }) => (
        <button
            onClick={() => { setCurrentPage(target); setMobileOpen(false); }}
            className={`relative text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-500 group ${currentPage === target ? 'text-gray-900 font-bold' : 'text-gray-500'
                }`}
        >
            <span className="relative z-10">{label}</span>
            <span className={`absolute -bottom-2 left-0 w-full h-px bg-gray-900 transform scale-x-0 transition-transform duration-300 origin-right group-hover:scale-x-100 group-hover:origin-left ${currentPage === target ? 'scale-x-100' : ''}`} />
        </button>
    );

    return (
        <nav className={`${navClasses} animate-resonance`}>
            {/* ACCESSIBILITY: Skip to main content link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:font-bold focus:text-sm"
            >
                Skip to main content
            </a>
            <CommandPalette onNavigate={setCurrentPage} />

            <div className="max-w-7xl mx-auto px-6 flex justify-between md:justify-center items-center md:gap-16">
                {/* Logo */}
                <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
                    <Hexagon className="text-gray-900 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.5} size={24} />
                    <div className="flex flex-col items-start">
                        <span className="text-xl md:text-2xl font-bold tracking-[0.1em] futuristic-font text-gray-900 leading-none">
                            HYLONO
                        </span>
                        <span className="text-[8px] uppercase tracking-[0.4em] text-gray-400 group-hover:text-gold transition-colors">
                            Systems
                        </span>
                    </div>
                </button>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-10">
                    <NavLink label="Concept" target="home" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />

                    {/* Mega Menu Trigger - Primary Navigation Hub */}
                    <button
                        onMouseEnter={() => loadMegaMenu()}
                        onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                        className={`text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 group flex items-center gap-1 ${megaMenuOpen ? 'text-cyan-500 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Explore <ChevronDown size={12} className={`transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <NavLink label="Store" target="store" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                    <NavLink label="Configurator" target="builder" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />

                </div>

                <React.Suspense fallback={null}>
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
                </React.Suspense>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <button 
                        onClick={onOpenCart} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
                        aria-label="Open shopping cart"
                    >
                        <ShoppingCart size={20} className="text-gray-600" />
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
                <button 
                    className="md:hidden" 
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {
                mobileOpen && (
                    <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-gray-100 p-8 flex flex-col space-y-8 md:hidden h-screen animate-fade-in">
                        <NavLink label="Concept" target="home" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        <NavLink label="Store" target="store" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        <NavLink label="Ecosystem" target="tech" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />
                        <NavLink label="Zone Configurator" target="builder" setCurrentPage={setCurrentPage} setMobileOpen={setMobileOpen} currentPage={currentPage} />

                    </div>
                )
            }
        </nav >
    );
};

export const Footer: React.FC<{ setCurrentPage?: (page: string) => void }> = ({ setCurrentPage }) => {
    const navigate = React.useCallback((page: string) => {
        setCurrentPage?.(page);
        window.scrollTo(0, 0);
    }, [setCurrentPage]);

    const footerSections = [
        {
            title: "Technology",
            links: [
                { label: "Hyperbaric (HBOT)", target: "product/HBOT", icon: <Wind size={12} /> },
                { label: "Pulsed EMF (PEMF)", target: "product/PEMF", icon: <Activity size={12} /> },
                { label: "Red Light (RLT)", target: "product/RLT", icon: <Sun size={12} /> },
                { label: "Hydrogen (H2)", target: "product/HYDROGEN", icon: <Droplets size={12} /> },
                { label: "Compare All", target: "store" }
            ]
        },
        {
            title: "Ecosystem",
            links: [

                { label: "Zone Configurator", target: "builder" },
                { label: "Protocol Codex", target: "protocols" },
                { label: "Research Hub", target: "research" },
                { label: "Learning Center", target: "faq" },
                { label: "Support Hub", target: "support" },
                { label: "Rewards", target: "rewards" }
            ]
        },
        {
            title: "Company",
            links: [
                { label: "Our Mission", target: "about" },
                { label: "Science & Evidence", target: "blog" },
                { label: "Careers", target: "careers" },
                { label: "Press & Media", target: "press" },
                { label: "Contact", target: "contact" }
            ]
        },
        {
            title: "Partnerships",
            links: [
                { label: "Partner Portal", target: "partners" },
                { label: "Find a Center", target: "locator" },
                { label: "Affiliate Program", target: "affiliate" },
                { label: "Wholesale Info", target: "contact" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", target: "privacy" },
                { label: "Terms of Service", target: "terms" },
                { label: "Shipping & Returns", target: "shipping" },
                { label: "Warranty", target: "warranty" }
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
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-8 font-medium">© 2026 HYLONO SYSTEMS INC.</p>
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
                                            onClick={() => navigate(link.target)}
                                            className="text-gray-400 hover:text-white text-[11px] tracking-wide transition-colors flex items-center gap-1.5 group"
                                        >
                                            {link.icon && <span className="opacity-40 group-hover:opacity-100 transition-opacity">{link.icon}</span>}
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </footer>

    );
};