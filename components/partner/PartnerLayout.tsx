import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Palette,
    GraduationCap,
    Wrench,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    Bell,
    Brain,
    Activity,
    TrendingUp,
    Briefcase,
    Link2,
    ChevronDown,
    ChevronRight,
    LucideIcon,
    Home,
    ExternalLink,
    FileText,
    Search,
    User,
    Settings,
    X
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';

interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
    description?: string;
}

interface NavGroup {
    id: string;
    label: string;
    icon: LucideIcon;
    items: NavItem[];
}

interface PartnerLayoutProps {
    children: React.ReactNode;
    title: string;
}

// Static navigation data - moved outside component to prevent recreation
const NAV_GROUPS: NavGroup[] = [
    {
        id: 'operations',
        label: 'Operations',
        icon: Briefcase,
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/partner/dashboard', description: 'Overview & insights' },
            { icon: Wrench, label: 'Fleet Health', href: '/partner/fleet', description: 'Device management' },
            { icon: ShoppingBag, label: 'Supply & Shop', href: '/partner/shop', description: 'Reorder & upgrades' },
        ]
    },
    {
        id: 'management',
        label: 'Management',
        icon: Settings,
        items: [
            { icon: Users, label: 'Team Progress', href: '/partner/team', description: 'Staff oversight' },
        ]
    },
    {
        id: 'clients',
        label: 'Client Management',
        icon: Users,
        items: [
            { icon: Activity, label: 'Nexus (CRM)', href: '/partner/nexus', description: 'Patient records' },
            { icon: Brain, label: 'Protocols', href: '/partner/protocols', description: 'Treatment pathways' },
            { icon: FileText, label: 'Documents', href: '/partner/docs', description: 'Consent & waivers' },
            { icon: Link2, label: 'Referral Connect', href: '/partner/connect', description: 'Track referrals' },
        ]
    },
    {
        id: 'growth',
        label: 'Growth & Learning',
        icon: TrendingUp,
        items: [
            { icon: Palette, label: 'Marketing Studio', href: '/partner/studio', description: 'Create campaigns' },
            { icon: GraduationCap, label: 'Academy', href: '/partner/academy', description: 'Training & certs' },
            { icon: Users, label: 'My Profile', href: '/partner/profile', description: 'Skills & progress' },
        ]
    }
];

// Find which group contains the current path
const findActiveGroup = (pathname: string): string | null => {
    for (const group of NAV_GROUPS) {
        if (group.items.some(item => pathname.startsWith(item.href))) {
            return group.id;
        }
    }
    return null;
};

export const PartnerLayout: React.FC<PartnerLayoutProps> = ({ children, title }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pathname, setPathname] = useState('/partner/dashboard');
    const [isMobile, setIsMobile] = useState(false);

    // Handle SSR and initial pathname
    useEffect(() => {
        setPathname(window.location.pathname);
        
        // Check mobile viewport
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize expanded groups - auto-expand the group containing current page
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
        const activeGroup = findActiveGroup(pathname);
        return activeGroup ? new Set([activeGroup]) : new Set(['operations']);
    });

    // Update expanded groups when pathname changes
    useEffect(() => {
        const activeGroup = findActiveGroup(pathname);
        if (activeGroup && !expandedGroups.has(activeGroup)) {
            setExpandedGroups(prev => new Set([...prev, activeGroup]));
        }
    }, [pathname]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    const isItemActive = (href: string) => pathname.startsWith(href);

    const breadcrumbs = pathname.split('/').filter(Boolean).slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1));

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                className="bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl overflow-hidden transition-all duration-300"
            >
                {/* Brand */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shrink-0" />
                    {sidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-white tracking-wide"
                        >
                            HYLONO <span className="text-cyan-400 text-xs">HUB</span>
                        </motion.span>
                    )}
                </div>

                {/* Back to Homepage */}
                <a
                    href="/"
                    className="mx-3 mt-4 mb-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors group"
                >
                    <Home className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm font-medium flex-1"
                            >
                                Back to Website
                            </motion.span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                        </>
                    )}
                </a>

                {/* Nav Groups */}
                <nav className="flex-1 py-4 px-3 overflow-y-auto">
                    {NAV_GROUPS.map((group) => {
                        const isExpanded = expandedGroups.has(group.id);
                        const hasActiveItem = group.items.some(item => isItemActive(item.href));

                        return (
                            <div key={group.id} className="mb-2">
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${hasActiveItem
                                        ? 'bg-cyan-500/10 text-cyan-400'
                                        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <group.icon className="w-5 h-5 shrink-0" />
                                    {sidebarOpen && (
                                        <>
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm font-semibold flex-1 text-left"
                                            >
                                                {group.label}
                                            </motion.span>
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </motion.div>
                                        </>
                                    )}
                                </button>

                                {/* Group Items */}
                                <AnimatePresence>
                                    {sidebarOpen && isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-700 pl-4">
                                                {group.items.map((item) => {
                                                    const isActive = isItemActive(item.href);
                                                    return (
                                                        <a
                                                            key={item.label}
                                                            href={item.href}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group/item ${isActive
                                                                ? 'bg-cyan-500/20 text-cyan-400'
                                                                : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
                                                                }`}
                                                        >
                                                            <item.icon className="w-4 h-4 shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-sm font-medium block truncate">
                                                                    {item.label}
                                                                </span>
                                                                {item.description && (
                                                                    <span className="text-[10px] text-slate-500 block truncate">
                                                                        {item.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {isActive && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                                            )}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer User */}
                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-600">
                            Dr.
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden flex-1">
                                <p className="text-sm font-bold text-white truncate">Dr. S. Chen</p>
                                <p className="text-xs text-slate-500 truncate">Aura Wellness</p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400">
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-10 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-[280px]' : isMobile ? 'ml-0' : 'ml-[80px]'}`}>
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <button
                            onClick={() => isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setSidebarOpen(!sidebarOpen)}
                            className="p-2 -ml-2 hover:bg-slate-100 rounded text-slate-500"
                            aria-label={isMobile ? 'Toggle mobile menu' : 'Toggle sidebar'}
                        >
                            {isMobile ? (mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />) : <Menu className="w-5 h-5" />}
                        </button>
                        <span className="font-bold text-slate-900 hidden sm:inline">Partner Hub</span>
                        <nav className="hidden md:flex items-center gap-2">
                            {breadcrumbs.map((crumb, i) => (
                                <React.Fragment key={crumb}>
                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                    <span className={i === breadcrumbs.length - 1 ? "text-cyan-600 font-medium" : ""}>
                                        {crumb}
                                    </span>
                                </React.Fragment>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <CommandPalette />
                        <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors group">
                            <Search className="w-3.5 h-3.5" />
                            <span>Quick Find</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] ml-2 group-hover:border-slate-300">⌘K</span>
                        </button>

                        <div className="h-6 w-px bg-slate-200 hidden md:block" />

                        <NotificationCenter />

                        <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-100">
                            DR
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
