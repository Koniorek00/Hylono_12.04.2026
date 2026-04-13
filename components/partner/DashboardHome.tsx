'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
    ArrowRight,
    BadgeCheck,
    Boxes,
    FileText,
    GraduationCap,
    Palette,
    ShieldCheck,
    ShoppingBag,
    Users,
    Wrench,
    LucideIcon,
    LogIn,
    MessageSquare,
} from 'lucide-react';
import { buildLoginRedirectPath } from '@/lib/auth-redirect';
import { PartnerLayout } from './PartnerLayout';

interface ModuleCard {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    badge: string;
}

interface FoundationCard {
    title: string;
    description: string;
}

const MODULES: ModuleCard[] = [
    {
        title: 'Clients',
        description: 'Review intake, client records, session history, and protocol coverage from one workspace.',
        href: '/nexus/clients',
        icon: Users,
        badge: 'Records',
    },
    {
        title: 'Fleet',
        description: 'Track service health, maintenance checkpoints, and device readiness across the clinic fleet.',
        href: '/nexus/fleet',
        icon: Wrench,
        badge: 'Operations',
    },
    {
        title: 'Documents',
        description: 'Generate intake sheets, consents, and clinic-ready paperwork from the same route cluster.',
        href: '/nexus/docs',
        icon: FileText,
        badge: 'Compliance',
    },
    {
        title: 'Studio',
        description: 'Build branded collateral, campaign assets, and operator-facing marketing outputs.',
        href: '/nexus/studio',
        icon: Palette,
        badge: 'Content',
    },
    {
        title: 'Academy',
        description: 'Run onboarding, certification tracking, and internal readiness refreshers for partner teams.',
        href: '/nexus/academy',
        icon: GraduationCap,
        badge: 'Training',
    },
    {
        title: 'Supplies',
        description: 'Handle consumables, accessories, and reorder planning alongside the rest of the workspace.',
        href: '/nexus/supplies',
        icon: ShoppingBag,
        badge: 'Commerce',
    },
    {
        title: 'Team',
        description: 'Inspect staffing, certifications, and operational coverage without leaving the operator shell.',
        href: '/nexus/team',
        icon: Boxes,
        badge: 'Staffing',
    },
];

const FOUNDATIONS: FoundationCard[] = [
    {
        title: 'One operator shell',
        description: 'Clients, fleet, documents, studio, training, and supplies live in one connected route family instead of scattered tools.',
    },
    {
        title: 'Public-safe walkthrough',
        description: 'This public overview focuses on module structure and operator coverage rather than pretending to show a live clinic deployment.',
    },
    {
        title: 'Launch-ready access path',
        description: 'Use sign-in for account access and contact Hylono when a clinic needs onboarding, rollout support, or partner setup.',
    },
];

const accessHref = buildLoginRedirectPath('/account');

const ModulePreviewCard: React.FC<ModuleCard> = ({
    title,
    description,
    href,
    icon: Icon,
    badge,
}) => (
    <Link
        href={href}
        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
    >
        <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                <Icon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {badge}
            </span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-cyan-700">
            {title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
            Open module
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
    </Link>
);

export const DashboardHome: React.FC = () => (
    <PartnerLayout title="Overview">
        <div className="space-y-8">
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-xl"
            >
                <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Nexus operator workspace
                        </div>
                        <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                            Run clinic operations, staff enablement, and content workflows from one Nexus shell.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                            Nexus groups client records, fleet readiness, documents, team training, supplies, and studio output into a single partner workspace. Explore the module structure here, then continue through sign-in when account access is needed.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={accessHref}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                            >
                                <LogIn className="h-4 w-4" />
                                Sign in to account
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Contact Hylono
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                            Workspace coverage
                        </p>
                        <div className="mt-4 space-y-3">
                            {[
                                'Clients and protocol tracking',
                                'Fleet health and maintenance workflows',
                                'Documents, onboarding, and compliance',
                                'Studio output for clinic marketing',
                                'Academy readiness and team enablement',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"
                                >
                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                                    <span className="text-sm text-slate-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Public route note
                </p>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                    Public Nexus routes are presented as a sample workspace tour. The goal is to show how the operator product is structured without presenting fabricated live clinic activity as production data.
                </p>
            </motion.section>

            <section id="nexus-modules">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Modules
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                            Explore the route network module by module.
                        </h2>
                    </div>
                    <p className="max-w-xl text-sm text-slate-500">
                        Each module route stays available for walkthrough and can be upgraded into full partner access without changing the core route structure.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {MODULES.map((module, index) => (
                        <motion.div
                            key={module.href}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 + index * 0.03 }}
                        >
                            <ModulePreviewCard {...module} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Foundations
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                        What makes this launch-safe right now.
                    </h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    {FOUNDATIONS.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 + index * 0.04 }}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    </PartnerLayout>
);
