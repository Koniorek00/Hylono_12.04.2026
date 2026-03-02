import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    Palette,
    Wrench,
    Users,
    LogOut,
    Menu,
    FileText,
    Search,
    Home,
    ExternalLink,
    ChevronRight,
    X,
    Boxes,
    LucideIcon,
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';

interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface PartnerLayoutProps {
    children: React.ReactNode;
    title: string;
}

const NAV_ITEMS: NavItem[] = [
    { icon: LayoutDashboard, label: 'Overview',   href: '/partner/dashboard' },
    { icon: Users,           label: 'Clients',    href: '/partner/nexus' },
    { icon: Wrench,          label: 'Fleet',      href: '/partner/fleet' },
    { icon: FileText,        label: 'Documents',  href: '/partner/docs' },
    { icon: Palette,         label: 'Studio',     href: '/partner/studio' },
    { icon: Boxes,           label: 'Team',       href: '/partner/team' },
];

export const PartnerLayout: React.FC<PartnerLayoutProps> = ({ children, title }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname() ?? '/partner/dashboard';

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsed(false);
                setMobileOpen(false);
            }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    const breadcrumbs = pathname
        .split('/')
        .filter(Boolean)
        .slice(1)
        .map(s => s.charAt(0).toUpperCase() + s.slice(1));

    const sidebarW = collapsed ? 72 : 240;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <motion.aside
                animate={{ width: sidebarW }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-[#0d1117] text-slate-400 border-r border-white/[0.04] shadow-2xl shadow-black/40 overflow-hidden hidden lg:flex"
            >
                {/* Brand */}
                <div className="h-14 flex items-center px-[18px] border-b border-white/[0.06] shrink-0 gap-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-md shrink-0 flex items-center justify-center">
                        <span className="text-white font-black text-[10px] tracking-tight">HY</span>
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                key="brand"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                transition={{ duration: 0.15 }}
                                className="font-bold text-white text-sm tracking-wider"
                            >
                                HYLONO <span className="text-cyan-400 font-medium tracking-normal">Partner</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Back to website */}
                <a
                    href="/"
                    title="Back to website"
                    className="mx-3 mt-3 mb-1 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-slate-300 transition-colors group"
                >
                    <Home className="w-4 h-4 shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                key="home-label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs flex-1 truncate"
                            >
                                Back to website
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {!collapsed && <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />}
                </a>

                {/* Divider */}
                <div className="mx-4 my-2 h-px bg-white/[0.05]" />

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={`
                                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                                    ${active
                                        ? 'bg-cyan-500/10 text-cyan-400'
                                        : 'hover:bg-white/[0.05] text-slate-500 hover:text-slate-200'
                                    }
                                `}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 rounded-lg bg-cyan-500/10"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                                )}
                                <item.icon className={`w-[18px] h-[18px] shrink-0 relative z-10 ${active ? 'text-cyan-400' : ''}`} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            key={`label-${item.href}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-sm font-medium relative z-10 truncate"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </a>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="mx-3 mb-2 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] text-slate-600 hover:text-slate-300 transition-colors"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <Menu className="w-4 h-4 shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                key="collapse-label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs truncate"
                            >
                                Collapse
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                {/* Footer – user */}
                <div className="p-3 border-t border-white/[0.06] shrink-0">
                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            SC
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    key="user-info"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-xs font-semibold text-white truncate">Dr. S. Chen</p>
                                    <p className="text-[10px] text-slate-500 truncate">Aura Wellness Clinic</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!collapsed && (
                            <button
                                className="p-1 hover:bg-white/[0.05] rounded text-slate-600 hover:text-slate-300 transition-colors"
                                aria-label="Sign out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* ── MOBILE DRAWER ────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            key="drawer"
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ duration: 0.2 }}
                            className="fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col bg-[#0d1117] border-r border-white/[0.04] lg:hidden"
                        >
                            <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-md flex items-center justify-center">
                                        <span className="text-white font-black text-[10px]">HY</span>
                                    </div>
                                    <span className="font-bold text-white text-sm">HYLONO Partner</span>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-500" aria-label="Close menu">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="flex-1 px-3 py-3 space-y-0.5">
                                {NAV_ITEMS.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200'}`}
                                        >
                                            <item.icon className="w-[18px] h-[18px] shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </a>
                                    );
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── MAIN AREA ────────────────────────────────────────────── */}
            <div
                className="flex-1 flex flex-col min-w-0 transition-[margin] duration-200"
                style={{ marginLeft: collapsed ? 72 : 240 }}
            >
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
                    {/* Left: hamburger + breadcrumb */}
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            className="lg:hidden p-1.5 -ml-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
                            <span className="font-semibold text-slate-900 hidden sm:inline">Partner Hub</span>
                            {breadcrumbs.map((crumb, i) => (
                                <React.Fragment key={crumb}>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:inline-block" />
                                    <span
                                        className={`truncate ${
                                            i === breadcrumbs.length - 1
                                                ? 'text-cyan-600 font-medium'
                                                : 'text-slate-500'
                                        }`}
                                    >
                                        {crumb}
                                    </span>
                                </React.Fragment>
                            ))}
                        </nav>
                    </div>

                    {/* Right: search + notifications + avatar */}
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <CommandPalette />

                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors text-xs text-slate-500">
                            <Search className="w-3.5 h-3.5" />
                            <span>Search</span>
                            <kbd className="ml-1.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-400">⌘K</kbd>
                        </div>

                        <div className="w-px h-5 bg-slate-200 hidden md:block" />

                        <NotificationCenter />

                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-100">
                            SC
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

