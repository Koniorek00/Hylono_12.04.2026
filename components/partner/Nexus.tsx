'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PartnerLayout } from './PartnerLayout';
import { motion, AnimatePresence } from 'motion/react';
import {
    Search,
    Plus,
    X,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Calendar,
    Phone,
    Mail,
    Clock,
    User,
    StickyNote,
    ClipboardList,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

type RiskLevel = 'stable' | 'monitor' | 'high';
type FilterValue = 'all' | RiskLevel;

interface Session {
    id: string;
    date: string;
    modality: string;
    duration: string;
    notes: string;
    outcome: 'good' | 'neutral' | 'poor';
}

interface ClientNote {
    id: string;
    author: string;
    date: string;
    text: string;
}

interface Client {
    id: string;
    name: string;
    initials: string;
    dob: string;
    email: string;
    phone: string;
    protocol: string;
    adherence: number;
    risk: RiskLevel;
    nextSession: string;
    sessions: Session[];
    notes: ClientNote[];
    joinedDate: string;
    totalSessions: number;
}

interface NexusProps {
    initialRegistrationOpen?: boolean;
    initialSelectedClientId?: string;
}

interface NewClientFormState {
    name: string;
    email: string;
    phone: string;
    dob: string;
    protocol: string;
    risk: RiskLevel;
    nextSession: string;
}

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

const CLIENTS: Client[] = [
    {
        id: '1',
        name: 'James Wilson',
        initials: 'JW',
        dob: '12 Feb 1984 (41y)',
        email: 'j.wilson@email.com',
        phone: '+31 6 1234 5678',
        protocol: 'Neural Repair',
        adherence: 92,
        risk: 'stable',
        nextSession: 'Today, 14:00',
        joinedDate: 'Nov 2024',
        totalSessions: 22,
        sessions: [
            { id: 's1', date: '12 Feb 2026', modality: 'HBOT 1.4 ATA', duration: '60 min', notes: 'Client reported improved sleep quality. No adverse effects.', outcome: 'good' },
            { id: 's2', date: '05 Feb 2026', modality: 'HBOT 1.4 ATA', duration: '60 min', notes: 'Standard session. Slight pressure discomfort resolved after 10 min.', outcome: 'neutral' },
            { id: 's3', date: '28 Jan 2026', modality: 'PEMF + RLT',   duration: '40 min', notes: 'Combination protocol. Client felt relaxed post-session.', outcome: 'good' },
        ],
        notes: [
            { id: 'n1', author: 'Dr. S. Chen', date: '12 Feb 2026', text: 'Excellent progress. HRV improving week-on-week. Continue current protocol.' },
            { id: 'n2', author: 'Dr. S. Chen', date: '10 Jan 2026', text: 'Initial consultation complete. No contraindications. Starting Neural Repair protocol.' },
        ],
    },
    {
        id: '2',
        name: 'Sarah Connor',
        initials: 'SC',
        dob: '25 Jun 1990 (35y)',
        email: 's.connor@email.com',
        phone: '+49 30 9876 5432',
        protocol: 'Systemic Anti-Inflammatory',
        adherence: 65,
        risk: 'monitor',
        nextSession: 'Tomorrow, 09:00',
        joinedDate: 'Dec 2024',
        totalSessions: 11,
        sessions: [
            { id: 's4', date: '10 Feb 2026', modality: 'HBOT 1.3 ATA', duration: '60 min', notes: 'Missed 2 sessions this month. Client cited work schedule conflict.', outcome: 'neutral' },
            { id: 's5', date: '24 Jan 2026', modality: 'HBOT 1.3 ATA', duration: '60 min', notes: 'Re-engaged after 2-week gap. Reviewed protocol adherence importance.', outcome: 'neutral' },
        ],
        notes: [
            { id: 'n3', author: 'Dr. S. Chen', date: '11 Feb 2026', text: 'Adherence declining. Scheduled a check-in call to discuss barriers. Consider protocol simplification.' },
        ],
    },
    {
        id: '3',
        name: 'Robert Paulson',
        initials: 'RP',
        dob: '03 Nov 1975 (50y)',
        email: 'r.paulson@email.com',
        phone: '+44 20 7946 0305',
        protocol: 'Pending Review',
        adherence: 0,
        risk: 'high',
        nextSession: 'Unscheduled',
        joinedDate: 'Jan 2026',
        totalSessions: 1,
        sessions: [
            { id: 's6', date: '20 Jan 2026', modality: 'Intake Assessment', duration: '30 min', notes: 'Initial assessment. Hypertension noted — requires GP clearance before HBOT.', outcome: 'neutral' },
        ],
        notes: [
            { id: 'n4', author: 'Dr. S. Chen', date: '20 Jan 2026', text: 'Client has hypertension (BP 165/100 at intake). Must obtain GP clearance letter before scheduling. Consent form pending.' },
        ],
    },
    {
        id: '4',
        name: 'Maria Kowalski',
        initials: 'MK',
        dob: '19 Mar 1988 (37y)',
        email: 'm.kowalski@email.com',
        phone: '+48 22 555 0199',
        protocol: 'Sports Recovery',
        adherence: 88,
        risk: 'stable',
        nextSession: 'Fri, 10:00',
        joinedDate: 'Oct 2024',
        totalSessions: 31,
        sessions: [
            { id: 's7', date: '13 Feb 2026', modality: 'RLT Full Body',   duration: '20 min', notes: 'Post-training recovery. Client reports reduced DOMS.', outcome: 'good' },
            { id: 's8', date: '11 Feb 2026', modality: 'HBOT 1.35 ATA',  duration: '60 min', notes: 'Weekly HBOT session. No issues.', outcome: 'good' },
        ],
        notes: [
            { id: 'n5', author: 'Dr. S. Chen', date: '13 Feb 2026', text: 'Great adherence. Competing in March — adjust protocol frequency to 3x/week until event.' },
        ],
    },
];

type DetailTab = 'overview' | 'sessions' | 'notes';

const DEFAULT_NEW_CLIENT_FORM: NewClientFormState = {
    name: '',
    email: '',
    phone: '',
    dob: '',
    protocol: '',
    risk: 'stable',
    nextSession: '',
};

const resolveClientId = (clients: Client[], value?: string | null) => {
    if (!value) {
        return null;
    }

    return clients.some((client) => client.id === value) ? value : null;
};

const toInitials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

const RiskBadge: React.FC<{ risk: RiskLevel; size?: 'sm' | 'md' }> = ({ risk, size = 'md' }) => {
    const base = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5';
    if (risk === 'high') {
        return (
            <span className={`inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 font-bold uppercase border border-red-100 ${base}`}>
                <AlertTriangle className="w-3 h-3" /> High Risk
            </span>
        );
    }
    if (risk === 'monitor') {
        return (
            <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 font-bold uppercase border border-amber-100 ${base}`}>
                <Activity className="w-3 h-3" /> Monitor
            </span>
        );
    }
    return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase border border-emerald-100 ${base}`}>
            <CheckCircle2 className="w-3 h-3" /> Stable
        </span>
    );
};

const AdherenceBar: React.FC<{ value: number; compact?: boolean }> = ({ value, compact }) => {
    const color = value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-400' : 'bg-red-400';
    return (
        <div className={`flex items-center gap-2 ${compact ? '' : ''}`}>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 shrink-0 w-8 text-right">{value}%</span>
        </div>
    );
};

const OutcomeDot: React.FC<{ outcome: Session['outcome'] }> = ({ outcome }) => {
    if (outcome === 'good')    return <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />;
    if (outcome === 'poor')    return <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-1.5" />;
    return <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0 mt-1.5" />;
};

const CreateClientModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onCreate: (form: NewClientFormState) => void;
}> = ({ open, onClose, onCreate }) => {
    const [form, setForm] = useState<NewClientFormState>(DEFAULT_NEW_CLIENT_FORM);

    useEffect(() => {
        if (open) {
            setForm(DEFAULT_NEW_CLIENT_FORM);
        }
    }, [open]);

    const updateField = useCallback((field: keyof NewClientFormState, value: NewClientFormState[keyof NewClientFormState]) => {
        setForm((current) => ({ ...current, [field]: value }));
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onCreate({
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            dob: form.dob.trim(),
            protocol: form.protocol.trim(),
            nextSession: form.nextSession.trim(),
        });
    }, [form, onCreate]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close registration modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Register client"
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-x-4 top-6 z-50 mx-auto w-auto max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl lg:top-12"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                                    Intake
                                </p>
                                <h2 className="mt-2 text-xl font-bold text-slate-900">
                                    Register Client
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Capture the essentials now. Session logs and notes can be added after registration.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close registration modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Full name
                                    </span>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={(event) => updateField('name', event.target.value)}
                                        placeholder="Jordan Avery"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Email
                                    </span>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(event) => updateField('email', event.target.value)}
                                        placeholder="jordan@clinicmail.com"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Phone
                                    </span>
                                    <input
                                        required
                                        value={form.phone}
                                        onChange={(event) => updateField('phone', event.target.value)}
                                        placeholder="+48 555 120 980"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Date of birth
                                    </span>
                                    <input
                                        value={form.dob}
                                        onChange={(event) => updateField('dob', event.target.value)}
                                        placeholder="03 Nov 1975 (50y)"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    />
                                </label>
                                <label className="block md:col-span-2">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Protocol
                                    </span>
                                    <input
                                        required
                                        value={form.protocol}
                                        onChange={(event) => updateField('protocol', event.target.value)}
                                        placeholder="Recovery Support"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Risk tier
                                    </span>
                                    <select
                                        value={form.risk}
                                        onChange={(event) => updateField('risk', event.target.value as RiskLevel)}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    >
                                        <option value="stable">Stable</option>
                                        <option value="monitor">Monitor</option>
                                        <option value="high">High risk</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Next session
                                    </span>
                                    <input
                                        value={form.nextSession}
                                        onChange={(event) => updateField('nextSession', event.target.value)}
                                        placeholder="Awaiting first consult"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-cyan-400"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                                >
                                    Save Client
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────────────────
// CLIENT DETAIL PANEL
// ─────────────────────────────────────────────────────────

const ClientDetail: React.FC<{
    client: Client;
    onClose: () => void;
}> = ({ client, onClose }) => {
    const [tab, setTab] = useState<DetailTab>('overview');
    const [newNote, setNewNote] = useState('');
    const [localNotes, setLocalNotes] = useState<ClientNote[]>(client.notes);

    const handleAddNote = useCallback(() => {
        if (!newNote.trim()) return;
        const note: ClientNote = {
            id: `n-${Date.now()}`,
            author: 'Dr. S. Chen',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            text: newNote.trim(),
        };
        setLocalNotes(prev => [note, ...prev]);
        setNewNote('');
    }, [newNote]);

    const tabs: { id: DetailTab; label: string; icon: React.ElementType }[] = [
        { id: 'overview',  label: 'Overview',  icon: User },
        { id: 'sessions',  label: 'Sessions',  icon: ClipboardList },
        { id: 'notes',     label: 'Notes',     icon: StickyNote },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {client.initials}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-slate-900 truncate">{client.name}</h2>
                            <p className="text-xs text-slate-400 truncate">{client.dob}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <RiskBadge risk={client.risk} size="sm" />
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Close panel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Contact row */}
                <div className="flex items-center gap-4 mt-3">
                    <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-600 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[140px]">{client.email}</span>
                    </a>
                    <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-600 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{client.phone}</span>
                    </a>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 shrink-0 px-5">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                            tab === t.id
                                ? 'border-cyan-500 text-cyan-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {tab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="p-5 space-y-5"
                        >
                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xl font-bold text-slate-900">{client.totalSessions}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Sessions</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xl font-bold text-slate-900">{client.adherence}%</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Adherence</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-[13px] font-bold text-slate-900 leading-tight mt-0.5">{client.joinedDate}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Joined</p>
                                </div>
                            </div>

                            {/* Current protocol */}
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Protocol</p>
                                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                                    <span className="text-sm font-semibold text-slate-800">{client.protocol}</span>
                                </div>
                            </div>

                            {/* Adherence */}
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Adherence</p>
                                <AdherenceBar value={client.adherence} />
                                {client.adherence < 70 && (
                                    <p className="text-[10px] text-amber-600 mt-1.5 font-medium">
                                        ⚠ Below target. Consider a check-in call.
                                    </p>
                                )}
                            </div>

                            {/* Next session */}
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Next Session</p>
                                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${
                                    client.nextSession === 'Unscheduled'
                                        ? 'bg-red-50 border-red-100 text-red-700'
                                        : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                }`}>
                                    <Calendar className="w-4 h-4 shrink-0" />
                                    <span className="text-sm font-semibold">{client.nextSession}</span>
                                </div>
                            </div>

                            {/* High-risk alert */}
                            {client.risk === 'high' && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-red-700">Clinical review required</p>
                                        <p className="text-[10px] text-red-600 mt-0.5">Review latest session notes and confirm GP clearance before scheduling HBOT.</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-1">
                                <button className="flex-1 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                                    Schedule Session
                                </button>
                                <button className="flex-1 py-2 text-xs font-semibold border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                                    View Documents
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {tab === 'sessions' && (
                        <motion.div
                            key="sessions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {client.sessions.length} session{client.sessions.length !== 1 ? 's' : ''} recorded
                                </p>
                                <button className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-semibold">
                                    <Plus className="w-3.5 h-3.5" /> Log Session
                                </button>
                            </div>
                            <div className="space-y-3">
                                {client.sessions.map((session) => (
                                    <div key={session.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <OutcomeDot outcome={session.outcome} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-800">{session.modality}</span>
                                                <span className="text-[10px] text-slate-400 font-mono shrink-0">{session.date}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mb-1.5">
                                                <Clock className="w-3 h-3 inline mr-1" />{session.duration}
                                            </p>
                                            <p className="text-xs text-slate-600 leading-relaxed">{session.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'notes' && (
                        <motion.div
                            key="notes"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="p-5"
                        >
                            {/* Add note */}
                            <div className="mb-4">
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    placeholder="Add a clinical note…"
                                    rows={3}
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-300"
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={!newNote.trim()}
                                    className="mt-2 w-full py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Save Note
                                </button>
                            </div>

                            {/* Notes list */}
                            <div className="space-y-3">
                                {localNotes.map((note) => (
                                    <div key={note.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-slate-700">{note.author}</span>
                                            <span className="text-[10px] text-slate-400">{note.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">{note.text}</p>
                                    </div>
                                ))}
                                {localNotes.length === 0 && (
                                    <p className="text-xs text-slate-400 text-center py-6">No notes yet.</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────
// MAIN NEXUS COMPONENT
// ─────────────────────────────────────────────────────────

export const Nexus: React.FC<NexusProps> = ({
    initialRegistrationOpen = false,
    initialSelectedClientId,
}) => {
    const router = useRouter();
    const pathname = usePathname() ?? '/nexus/clients';
    const searchParams = useSearchParams();
    const [clients, setClients] = useState<Client[]>(CLIENTS);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterValue>('all');
    const [selectedId, setSelectedId] = useState<string | null>(() =>
        resolveClientId(CLIENTS, initialSelectedClientId),
    );
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(initialRegistrationOpen);
    const lastSyncedSelectedClientId = useRef(initialSelectedClientId);

    useEffect(() => {
        if (lastSyncedSelectedClientId.current === initialSelectedClientId) {
            return;
        }

        lastSyncedSelectedClientId.current = initialSelectedClientId;
        setSelectedId(resolveClientId(clients, initialSelectedClientId));
    }, [clients, initialSelectedClientId]);

    useEffect(() => {
        setIsRegistrationOpen(initialRegistrationOpen);
    }, [initialRegistrationOpen]);

    const syncRouteState = useCallback((nextSelectedId: string | null, nextRegistrationOpen: boolean) => {
        const params = new URLSearchParams(searchParams?.toString() ?? '');

        if (nextSelectedId) {
            params.set('patient', nextSelectedId);
        } else {
            params.delete('patient');
        }

        if (nextRegistrationOpen) {
            params.set('action', 'new');
        } else {
            params.delete('action');
        }

        const nextQuery = params.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }, [pathname, router, searchParams]);

    const handleCloseSelectedClient = useCallback(() => {
        setSelectedId(null);
        syncRouteState(null, false);
    }, [syncRouteState]);

    const handleSelectClient = useCallback((clientId: string) => {
        setIsRegistrationOpen(false);
        setSelectedId((currentId) => {
            const nextSelectedId = currentId === clientId ? null : clientId;
            syncRouteState(nextSelectedId, false);
            return nextSelectedId;
        });
    }, [syncRouteState]);

    const handleOpenRegistration = useCallback(() => {
        setIsRegistrationOpen(true);
        syncRouteState(selectedId, true);
    }, [selectedId, syncRouteState]);

    const handleCloseRegistration = useCallback(() => {
        setIsRegistrationOpen(false);
        syncRouteState(selectedId, false);
    }, [selectedId, syncRouteState]);

    const handleCreateClient = useCallback((form: NewClientFormState) => {
        const now = new Date();
        const nextClientId = `client-${Date.now()}`;
        const dateLabel = now.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        const nextClient: Client = {
            id: nextClientId,
            name: form.name,
            initials: toInitials(form.name),
            dob: form.dob || 'DOB pending',
            email: form.email,
            phone: form.phone,
            protocol: form.protocol,
            adherence: 0,
            risk: form.risk,
            nextSession: form.nextSession || 'Awaiting first consult',
            sessions: [],
            notes: [
                {
                    id: `note-${Date.now()}`,
                    author: 'Nexus Intake',
                    date: dateLabel,
                    text: 'Client registered in Nexus. Confirm intake details and book the first guided session.',
                },
            ],
            joinedDate: now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            totalSessions: 0,
        };

        setClients((currentClients) => [nextClient, ...currentClients]);
        setFilter('all');
        setSearch('');
        setSelectedId(nextClientId);
        setIsRegistrationOpen(false);
        syncRouteState(nextClientId, false);
    }, [syncRouteState]);

    const filtered = useMemo(() => {
        let list = clients;
        if (filter !== 'all') list = list.filter(c => c.risk === filter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.protocol.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q),
            );
        }
        return list;
    }, [clients, search, filter]);

    const selectedClient = useMemo(
        () => clients.find(c => c.id === selectedId) ?? null,
        [clients, selectedId],
    );

    const counts = useMemo(() => ({
        total:   clients.length,
        stable:  clients.filter(c => c.risk === 'stable').length,
        monitor: clients.filter(c => c.risk === 'monitor').length,
        high:    clients.filter(c => c.risk === 'high').length,
    }), [clients]);

    const FILTERS: { value: FilterValue; label: string; count: number }[] = [
        { value: 'all',     label: 'All',     count: counts.total },
        { value: 'stable',  label: 'Stable',  count: counts.stable },
        { value: 'monitor', label: 'Monitor', count: counts.monitor },
        { value: 'high',    label: 'High Risk', count: counts.high },
    ];

    return (
        <PartnerLayout title="Clients">
            <div className="flex flex-col h-full -m-4 md:-m-6 lg:-m-8">

                {/* ── Toolbar ─────────────────────────────────────── */}
                <div className="px-4 md:px-6 lg:px-8 py-4 bg-white border-b border-slate-200 shrink-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

                        {/* Search */}
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search by name, protocol, email…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-1">
                            {FILTERS.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        filter === f.value
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {f.label}
                                    <span className={`ml-1.5 ${filter === f.value ? 'text-slate-300' : 'text-slate-400'}`}>
                                        {f.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Spacer + Add button */}
                        <div className="flex-1" />
                        <button
                            onClick={handleOpenRegistration}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
                        >
                            <Plus className="w-4 h-4" /> Register Client
                        </button>
                    </div>
                </div>

                {/* ── Split Pane ──────────────────────────────────── */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Client list */}
                    <div className={`flex flex-col overflow-hidden transition-all duration-200 ${
                        selectedClient ? 'w-full lg:w-[420px] xl:w-[460px] shrink-0' : 'flex-1'
                    }`}>
                        {/* Column headers */}
                        <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 px-4 md:px-6 py-2 border-b border-slate-100 bg-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Status</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Next Session</p>
                        </div>

                        {/* Rows */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                            {filtered.length === 0 && (
                                <div className="py-16 text-center">
                                    <p className="text-sm text-slate-400">No clients match your search.</p>
                                </div>
                            )}
                            {filtered.map((client) => {
                                const isSelected = selectedId === client.id;
                                return (
                                    <button
                                        key={client.id}
                                        onClick={() => handleSelectClient(client.id)}
                                        className={`w-full text-left flex items-center gap-4 px-4 md:px-6 py-3.5 transition-all ${
                                            isSelected
                                                ? 'bg-cyan-50 border-l-2 border-cyan-500'
                                                : 'hover:bg-slate-50 border-l-2 border-transparent'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                            isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {client.initials}
                                        </div>

                                        {/* Name + protocol */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-cyan-700' : 'text-slate-900'}`}>
                                                {client.name}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">{client.protocol}</p>
                                        </div>

                                        {/* Adherence bar — hidden when panel open on small screens */}
                                        <div className={`w-20 hidden ${selectedClient ? 'hidden' : 'md:block'}`}>
                                            <AdherenceBar value={client.adherence} compact />
                                        </div>

                                        {/* Risk badge */}
                                        <div className="shrink-0">
                                            <RiskBadge risk={client.risk} size="sm" />
                                        </div>

                                        {/* Next session — hide if panel open */}
                                        {!selectedClient && (
                                            <p className="text-xs text-slate-500 font-mono hidden lg:block w-32 text-right shrink-0 truncate">
                                                {client.nextSession}
                                            </p>
                                        )}

                                        <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detail panel */}
                    <AnimatePresence>
                        {selectedClient && (
                            <motion.div
                                key={selectedClient.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.18 }}
                                className="flex-1 overflow-hidden hidden lg:flex flex-col"
                            >
                                <ClientDetail
                                    client={selectedClient}
                                    onClose={handleCloseSelectedClient}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Mobile full-screen detail */}
                    <AnimatePresence>
                        {selectedClient && (
                            <motion.div
                                key={`mobile-${selectedClient.id}`}
                                role="dialog"
                                aria-modal="true"
                                aria-label="Client details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto"
                            >
                                <ClientDetail
                                    client={selectedClient}
                                    onClose={handleCloseSelectedClient}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <CreateClientModal
                    open={isRegistrationOpen}
                    onClose={handleCloseRegistration}
                    onCreate={handleCreateClient}
                />
            </div>
        </PartnerLayout>
    );
};

