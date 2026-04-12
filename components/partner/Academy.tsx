'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    Brain,
    Clock,
    FileText,
    GraduationCap,
    LucideIcon,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import { AITutor } from './AITutor';
import { CertificationTracker } from './CertificationTracker';
import { Leaderboard } from './Leaderboard';
import { MicroLearningFeed } from './MicroLearningFeed';
import { PartnerLayout } from './PartnerLayout';
import { RolePathSelector } from './RolePathSelector';

type LearningRole = 'operator' | 'manager' | 'sales';

interface StatCard {
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
    accent: string;
    iconColor: string;
}

interface AssignmentItem {
    title: string;
    status: string;
    detail: string;
    href: string;
    icon: LucideIcon;
    badgeTone: string;
}

interface ResourceLink {
    title: string;
    description: string;
    href: string;
}

const STAT_CARDS: StatCard[] = [
    {
        label: 'Learning streak',
        value: '3 days',
        detail: 'Keep momentum with one quick module per day.',
        icon: Zap,
        accent: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        label: 'Certifications earned',
        value: '1 of 4',
        detail: 'Operator level 1 is complete and shareable.',
        icon: Trophy,
        accent: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
    },
    {
        label: 'Required drills',
        value: '2 open',
        detail: 'Emergency refreshers need sign-off this week.',
        icon: ShieldCheck,
        accent: 'bg-rose-50',
        iconColor: 'text-rose-600',
    },
    {
        label: 'Team onboarding',
        value: '87%',
        detail: 'Most of the current cohort is nearly complete.',
        icon: Users,
        accent: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
];

const TRACK_DETAILS: Record<
    LearningRole,
    {
        title: string;
        focus: string;
        duration: string;
        milestone: string;
        modules: string[];
    }
> = {
    operator: {
        title: 'Operator track',
        focus: 'Technical readiness, safety rituals, and hands-on chamber confidence.',
        duration: '2-3 hours',
        milestone: 'Unlocks simulator drills and operator certification.',
        modules: ['Chamber prep', 'Pressurization basics', 'Client monitoring', 'Emergency response'],
    },
    manager: {
        title: 'Manager track',
        focus: 'Compliance oversight, staff coaching, and clinic-level reporting habits.',
        duration: '3-4 hours',
        milestone: 'Prepares managers to assign modules and review exceptions.',
        modules: ['Compliance essentials', 'Incident handling', 'Quality assurance', 'Team reporting'],
    },
    sales: {
        title: 'Sales track',
        focus: 'Consultation flow, expectation setting, and client education conversations.',
        duration: '1.5-2 hours',
        milestone: 'Builds a repeatable handoff from inquiry to booked session.',
        modules: ['Benefits overview', 'Consult flow', 'Objection handling', 'Follow-up rhythm'],
    },
};

const REQUIRED_ASSIGNMENTS: AssignmentItem[] = [
    {
        title: 'Run the emergency response refresher',
        status: 'Due today',
        detail: 'Operators must complete the drill before this week\'s live session blocks.',
        href: '/nexus/team',
        icon: ShieldCheck,
        badgeTone: 'bg-rose-50 text-rose-700',
    },
    {
        title: 'Review the latest consent packet',
        status: 'New this week',
        detail: 'Confirm the document bundle before onboarding new clients.',
        href: '/nexus/docs',
        icon: FileText,
        badgeTone: 'bg-cyan-50 text-cyan-700',
    },
    {
        title: 'Pair training with fleet readiness',
        status: 'Ops check',
        detail: 'Use the fleet dashboard to match upcoming modules with device availability.',
        href: '/nexus/fleet',
        icon: Target,
        badgeTone: 'bg-amber-50 text-amber-700',
    },
];

const RESOURCE_LINKS: ResourceLink[] = [
    {
        title: 'Team dashboard',
        description: 'Check compliance gaps, assignment progress, and certification status.',
        href: '/nexus/team',
    },
    {
        title: 'Document center',
        description: 'Pull the latest consent forms, SOPs, and onboarding material.',
        href: '/nexus/docs',
    },
    {
        title: 'Fleet health',
        description: 'Match training modules to the devices that need operator attention.',
        href: '/nexus/fleet',
    },
];

export const Academy: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<LearningRole>('operator');
    const [showTutor, setShowTutor] = useState(false);

    const selectedTrack = TRACK_DETAILS[selectedRole];

    return (
        <PartnerLayout title="Academy">
            <div className="space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-[0_30px_80px_-45px_rgba(2,132,199,0.65)]"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.2),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_35%)]" />
                    <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-200 lg:flex lg:items-center lg:gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Interactive training workspace
                    </div>

                    <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                                Nexus Academy
                            </p>
                            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                                Keep staff training, certification, and drills in one workspace
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                Run role-based onboarding, deliver quick refreshers, and track who is ready for live operations without leaving Nexus.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="#academy-feed"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                                >
                                    Start micro-learning
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowTutor(true)}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/10"
                                >
                                    <Brain className="h-4 w-4 text-cyan-300" />
                                    Open AI tutor
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                            Active path
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-white">
                                            {selectedTrack.title}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-300">
                                    {selectedTrack.focus}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                            Suggested pace
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-white">
                                            {selectedTrack.duration}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-300">
                                    {selectedTrack.milestone}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {STAT_CARDS.map((card, index) => (
                        <motion.article
                            key={card.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}>
                                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                        {card.label}
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                        {card.value}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {card.detail}
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
                                        Personalized onboarding
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        Choose the track that matches the role
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowTutor(true)}
                                    className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                                >
                                    <Brain className="h-4 w-4 text-cyan-600" />
                                    Ask the tutor
                                </button>
                            </div>

                            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                <RolePathSelector onSelectPath={(role) => setSelectedRole(role)} />

                                <AnimatePresence mode="wait">
                                    <motion.aside
                                        key={selectedRole}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                            Current recommendation
                                        </p>
                                        <h3 className="mt-2 text-xl font-bold text-slate-900">
                                            {selectedTrack.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            {selectedTrack.focus}
                                        </p>

                                        <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                                                Milestone
                                            </p>
                                            <p className="mt-2 text-sm font-medium leading-6 text-cyan-900">
                                                {selectedTrack.milestone}
                                            </p>
                                        </div>

                                        <div className="mt-5">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                                First modules
                                            </p>
                                            <ul className="mt-3 space-y-2">
                                                {selectedTrack.modules.map((module) => (
                                                    <li
                                                        key={module}
                                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                                                    >
                                                        {module}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.aside>
                                </AnimatePresence>
                            </div>
                        </section>

                        <section
                            id="academy-feed"
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
                                        Micro-learning
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        Short modules for busy clinic teams
                                    </h2>
                                </div>
                                <p className="max-w-md text-sm leading-6 text-slate-500">
                                    Use short lessons to refresh safety routines, operational basics, and scenario drills between live sessions.
                                </p>
                            </div>

                            <MicroLearningFeed />
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <CertificationTracker />
                        </section>

                        <Leaderboard />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
                                    Required next steps
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                    Keep this week on track
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {REQUIRED_ASSIGNMENTS.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-200 hover:bg-white"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="text-base font-semibold text-slate-900">
                                                    {item.title}
                                                </h3>
                                                <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${item.badgeTone}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {item.detail}
                                            </p>
                                        </div>
                                        <ArrowRight className="mt-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-cyan-600" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
                            Connected resources
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900">
                            Jump straight into the connected tools
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Academy works best when it stays tied to staffing, documents, and device readiness.
                        </p>

                        <div className="mt-6 space-y-3">
                            {RESOURCE_LINKS.map((resource) => (
                                <Link
                                    key={resource.href}
                                    href={resource.href}
                                    className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-cyan-200 hover:bg-cyan-50/40"
                                >
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {resource.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            {resource.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="mt-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-cyan-600" />
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                <AnimatePresence>
                    {showTutor && (
                        <AITutor
                            videoTitle={selectedTrack.title}
                            onClose={() => setShowTutor(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </PartnerLayout>
    );
};
