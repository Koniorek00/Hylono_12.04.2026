'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    Palette,
    Wrench,
    Users,
    GraduationCap,
    LogOut,
    Menu,
    FileText,
    Home,
    ExternalLink,
    ChevronRight,
    X,
    Boxes,
    ShoppingBag,
    LucideIcon,
    BadgeCheck,
} from 'lucide-react';
import { buildLoginRedirectPath } from '@/lib/auth-redirect';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';

type WorkspaceChromeMode = 'sample' | 'workspace';

interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface PartnerLayoutProps {
    children: React.ReactNode;
    title: string;
    chromeMode?: WorkspaceChromeMode;
}

const NAV_ITEMS: NavItem[] = [
    { icon: LayoutDashboard, label: 'Overview', href: '/nexus' },
    { icon: Users, label: 'Clients', href: '/nexus/clients' },
    { icon: Wrench, label: 'Fleet', href: '/nexus/fleet' },
    { icon: GraduationCap, label: 'Academy', href: '/nexus/academy' },
    { icon: ShoppingBag, label: 'Supplies', href: '/nexus/supplies' },
    { icon: FileText, label: 'Documents', href: '/nexus/docs' },
    { icon: Palette, label: 'Studio', href: '/nexus/studio' },
    { icon: Boxes, label: 'Team', href: '/nexus/team' },
];

export const PartnerLayout: React.FC<PartnerLayoutProps> = ({
    children,
    title,
    chromeMode = 'sample',
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname() ?? '/nexus';
    const isSampleChrome = chromeMode === 'sample';
    const accessHref = buildLoginRedirectPath('/account');

    const handleSignOut = () => {
        void signOut({ callbackUrl: '/login' });
    };

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

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const breadcrumbs = pathname
        .split('/')
        .filter(Boolean)
        .slice(1)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));

    const sidebarW = collapsed ? 72 : 240;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <motion.aside
                animate={{ width: sidebarW }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="fixed bottom-0 left-0 top-0 z-30 hidden flex-col overflow-hidden border-r border-white/[0.04] bg-[#0d1117] text-slate-400 shadow-2xl shadow-black/40 lg:flex"
            >
                <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] px-[18px]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600">
                        <span className="text-[10px] font-black tracking-tight text-white">HY</span>
                    </div>
                    <AnimatePresence>
                        {!collapsed ? (
                            <motion.div
                                key="brand"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                transition={{ duration: 0.15 }}
                                className="min-w-0"
                            >
                                <p className="truncate text-sm font-bold tracking-wider text-white">
                                    HYLONO <span className="font-medium tracking-normal text-cyan-400">Nexus</span>
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                    {isSampleChrome ? 'Sample workspace' : 'Partner workspace'}
                                </p>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                <Link
                    href="/"
                    title="Back to website"
                    className="group mx-3 mb-1 mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
                >
                    <Home className="h-4 w-4 shrink-0" />
                    <AnimatePresence>
                        {!collapsed ? (
                            <motion.span
                                key="home-label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 truncate text-xs"
                            >
                                Back to website
                            </motion.span>
                        ) : null}
                    </AnimatePresence>
                    {!collapsed ? (
                        <ExternalLink className="h-3 w-3 text-slate-600 transition-colors group-hover:text-slate-400" />
                    ) : null}
                </Link>

                <div className="mx-4 my-2 h-px bg-white/[0.05]" />

                <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${
                                    active
                                        ? 'bg-cyan-500/10 text-cyan-400'
                                        : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200'
                                }`}
                            >
                                {active ? (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 rounded-lg bg-cyan-500/10"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                ) : null}
                                {active ? (
                                    <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-cyan-400" />
                                ) : null}
                                <item.icon
                                    className={`relative z-10 h-[18px] w-[18px] shrink-0 ${
                                        active ? 'text-cyan-400' : ''
                                    }`}
                                />
                                <AnimatePresence>
                                    {!collapsed ? (
                                        <motion.span
                                            key={`label-${item.href}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative z-10 truncate text-sm font-medium"
                                        >
                                            {item.label}
                                        </motion.span>
                                    ) : null}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    type="button"
                    onClick={() => setCollapsed((current) => !current)}
                    className="mx-3 mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <Menu className="h-4 w-4 shrink-0" />
                    <AnimatePresence>
                        {!collapsed ? (
                            <motion.span
                                key="collapse-label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="truncate text-xs"
                            >
                                Collapse
                            </motion.span>
                        ) : null}
                    </AnimatePresence>
                </button>

                <div className="shrink-0 border-t border-white/[0.06] p-3">
                    {isSampleChrome ? (
                        <div className={`space-y-3 ${collapsed ? 'text-center' : ''}`}>
                            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                                    <BadgeCheck className="h-4 w-4" />
                                </div>
                                <AnimatePresence>
                                    {!collapsed ? (
                                        <motion.div
                                            key="sample-footer"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="min-w-0 flex-1"
                                        >
                                            <p className="truncate text-xs font-semibold text-white">Sample workspace</p>
                                            <p className="truncate text-[10px] text-slate-500">
                                                Explore the module map and operator flows.
                                            </p>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>

                            {!collapsed ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={accessHref}
                                        className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-center text-[11px] font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/20"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-center text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/[0.08]"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-xs font-bold text-white">
                                CW
                            </div>
                            <AnimatePresence>
                                {!collapsed ? (
                                    <motion.div
                                        key="user-info"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="min-w-0 flex-1"
                                    >
                                        <p className="truncate text-xs font-semibold text-white">Clinic Workspace</p>
                                        <p className="truncate text-[10px] text-slate-500">Authenticated session</p>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                            {!collapsed ? (
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="rounded p-1 text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
                                    aria-label="Sign out"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </motion.aside>

            <AnimatePresence>
                {mobileOpen ? (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            key="drawer"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Navigation menu"
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ duration: 0.2 }}
                            className="fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col border-r border-white/[0.04] bg-[#0d1117] lg:hidden"
                        >
                            <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600">
                                        <span className="text-[10px] font-black text-white">HY</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white">HYLONO Nexus</span>
                                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                            {isSampleChrome ? 'Sample workspace' : 'Partner workspace'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(false)}
                                    className="p-1 text-slate-500"
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-0.5 px-3 py-3">
                                {NAV_ITEMS.map((item) => {
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                                                active
                                                    ? 'bg-cyan-500/10 text-cyan-400'
                                                    : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200'
                                            }`}
                                        >
                                            <item.icon className="h-[18px] w-[18px] shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="border-t border-white/[0.06] p-3">
                                {isSampleChrome ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href={accessHref}
                                            onClick={() => setMobileOpen(false)}
                                            className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-center text-xs font-semibold text-cyan-200"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href="/contact"
                                            onClick={() => setMobileOpen(false)}
                                            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-center text-xs font-semibold text-slate-300"
                                        >
                                            Contact
                                        </Link>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-200"
                                    >
                                        <LogOut className="h-[18px] w-[18px] shrink-0" />
                                        <span className="text-sm font-medium">Sign out</span>
                                    </button>
                                )}
                            </div>
                        </motion.aside>
                    </>
                ) : null}
            </AnimatePresence>

            <div
                className={`flex min-w-0 flex-1 flex-col transition-[margin] duration-200 ${
                    collapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'
                }`}
            >
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
                    <div className="min-w-0 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileOpen((current) => !current)}
                            className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <nav className="flex min-w-0 items-center gap-1 text-sm" aria-label="Breadcrumb">
                            <span className="hidden font-semibold text-slate-900 sm:inline">Nexus</span>
                            {breadcrumbs.length === 0 ? (
                                <>
                                    <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-300 sm:inline-block" />
                                    <span className="truncate font-medium text-cyan-600">{title}</span>
                                </>
                            ) : (
                                breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb}>
                                        <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-300 sm:inline-block" />
                                        <span
                                            className={`truncate ${
                                                index === breadcrumbs.length - 1
                                                    ? 'font-medium text-cyan-600'
                                                    : 'text-slate-500'
                                            }`}
                                        >
                                            {crumb}
                                        </span>
                                    </React.Fragment>
                                ))
                            )}
                        </nav>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 md:gap-3">
                        <CommandPalette triggerLabel={isSampleChrome ? 'Search modules' : 'Search'} />

                        {isSampleChrome ? (
                            <>
                                <span className="hidden rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 md:inline-flex">
                                    Public sample workspace
                                </span>
                                <Link
                                    href={accessHref}
                                    className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:inline-flex"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/contact"
                                    className="hidden rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 md:inline-flex"
                                >
                                    Contact
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="hidden h-5 w-px bg-slate-200 md:block" />
                                <NotificationCenter />
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white ring-2 ring-slate-100">
                                    CW
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <section className="flex-1 p-4 md:p-6 lg:p-8">{children}</section>
            </div>
        </div>
    );
};
