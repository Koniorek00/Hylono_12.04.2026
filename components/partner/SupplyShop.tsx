'use client';

import React, { useDeferredValue, useState } from 'react';
import { motion } from 'motion/react';
import { PartnerLayout } from './PartnerLayout';
import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    Clock3,
    Minus,
    Package,
    Plus,
    RefreshCw,
    Repeat2,
    Search,
    ShieldCheck,
    ShoppingBag,
} from 'lucide-react';

type SupplyCategory = 'Consumables' | 'Accessories' | 'Service Parts';
type InventoryStatus = 'healthy' | 'reorder' | 'review';
type ApprovalMode = 'Auto-release' | 'Manager review' | 'Partner ops review';
type CategoryFilter = 'All' | SupplyCategory;

interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    category: SupplyCategory;
    status: InventoryStatus;
    onHand: number;
    parLevel: number;
    monthlyBurn: number;
    packSize: string;
    lastOrder: string;
    approvalMode: ApprovalMode;
    note: string;
    recommendedQty: number;
    templateEligible: boolean;
}

interface RequisitionRow {
    id: string;
    label: string;
    submittedAt: string;
    lines: number;
    status: 'Queued' | 'Needs review' | 'Packed';
}

interface StandingTemplate {
    id: string;
    name: string;
    cadence: string;
    itemCount: number;
    owner: string;
    lines: Array<{
        itemId: string;
        quantity: number;
    }>;
}

const INVENTORY_ITEMS: InventoryItem[] = [
    {
        id: 'mask-liners',
        name: 'Session Mask Liner Pack',
        sku: 'NX-CNS-014',
        category: 'Consumables',
        status: 'reorder',
        onHand: 18,
        parLevel: 32,
        monthlyBurn: 26,
        packSize: '20 liners',
        lastOrder: '02 Apr 2026',
        approvalMode: 'Auto-release',
        note: 'Usage has climbed with weekend booking blocks. Recommended draft already reflects current burn.',
        recommendedQty: 1,
        templateEligible: true,
    },
    {
        id: 'surface-kit',
        name: 'Surface Reset Cleaning Kit',
        sku: 'NX-CNS-027',
        category: 'Consumables',
        status: 'healthy',
        onHand: 9,
        parLevel: 8,
        monthlyBurn: 5,
        packSize: '6 kits',
        lastOrder: '28 Mar 2026',
        approvalMode: 'Auto-release',
        note: 'Coverage is stable. Keep in the next standing template if session volume remains above target.',
        recommendedQty: 0,
        templateEligible: true,
    },
    {
        id: 'quick-connect',
        name: 'Quick-Connect Tubing Set',
        sku: 'NX-ACC-041',
        category: 'Accessories',
        status: 'review',
        onHand: 4,
        parLevel: 6,
        monthlyBurn: 3,
        packSize: '2 sets',
        lastOrder: '16 Feb 2026',
        approvalMode: 'Partner ops review',
        note: 'Compatibility should be confirmed against the latest chamber service record before release.',
        recommendedQty: 1,
        templateEligible: false,
    },
    {
        id: 'client-wraps',
        name: 'Client Compression Wrap Set',
        sku: 'NX-ACC-063',
        category: 'Accessories',
        status: 'healthy',
        onHand: 11,
        parLevel: 10,
        monthlyBurn: 4,
        packSize: '4 sets',
        lastOrder: '31 Mar 2026',
        approvalMode: 'Manager review',
        note: 'Counts are healthy, but manager sign-off still applies for any non-template accessory request.',
        recommendedQty: 0,
        templateEligible: false,
    },
    {
        id: 'seal-gasket',
        name: 'Door Seal Gasket Bundle',
        sku: 'NX-SVC-102',
        category: 'Service Parts',
        status: 'review',
        onHand: 1,
        parLevel: 2,
        monthlyBurn: 1,
        packSize: '1 bundle',
        lastOrder: '11 Jan 2026',
        approvalMode: 'Partner ops review',
        note: 'Service parts stay quote-routed and require a maintenance note attached to the draft.',
        recommendedQty: 1,
        templateEligible: false,
    },
    {
        id: 'filter-cartridge',
        name: 'Air Filter Cartridge Set',
        sku: 'NX-SVC-118',
        category: 'Service Parts',
        status: 'reorder',
        onHand: 2,
        parLevel: 5,
        monthlyBurn: 2,
        packSize: '3 cartridges',
        lastOrder: '18 Mar 2026',
        approvalMode: 'Manager review',
        note: 'Recommended quantity tops the clinic back up to par without over-ordering the service shelf.',
        recommendedQty: 1,
        templateEligible: true,
    },
];

const INITIAL_RECENT_REQUISITIONS: RequisitionRow[] = [
    { id: 'rq-1048', label: 'Weekend turnover restock', submittedAt: '09 Apr 2026', lines: 6, status: 'Packed' },
    { id: 'rq-1043', label: 'Monthly accessory refresh', submittedAt: '04 Apr 2026', lines: 3, status: 'Queued' },
    { id: 'rq-1036', label: 'Seal review follow-up', submittedAt: '29 Mar 2026', lines: 2, status: 'Needs review' },
];

const STANDING_TEMPLATES: StandingTemplate[] = [
    {
        id: 'st-01',
        name: 'High-turnover session pack',
        cadence: 'Every 14 sessions',
        itemCount: 3,
        owner: 'Front desk ops',
        lines: [
            { itemId: 'mask-liners', quantity: 1 },
            { itemId: 'surface-kit', quantity: 1 },
            { itemId: 'client-wraps', quantity: 1 },
        ],
    },
    {
        id: 'st-02',
        name: 'Weekly reset shelf',
        cadence: 'Every Friday',
        itemCount: 2,
        owner: 'Clinic manager',
        lines: [
            { itemId: 'mask-liners', quantity: 1 },
            { itemId: 'surface-kit', quantity: 1 },
        ],
    },
    {
        id: 'st-03',
        name: 'Service bench essentials',
        cadence: 'Every 30 days',
        itemCount: 2,
        owner: 'Maintenance lead',
        lines: [
            { itemId: 'seal-gasket', quantity: 1 },
            { itemId: 'filter-cartridge', quantity: 1 },
        ],
    },
];

const CATEGORY_FILTERS: CategoryFilter[] = ['All', 'Consumables', 'Accessories', 'Service Parts'];

const buildDefaultDraft = (): Record<string, number> =>
    Object.fromEntries(
        INVENTORY_ITEMS.filter((item) => item.recommendedQty > 0).map((item) => [item.id, item.recommendedQty]),
    );

const buildTemplateDraft = (template: StandingTemplate): Record<string, number> =>
    Object.fromEntries(template.lines.map((line) => [line.itemId, line.quantity]));

const formatSubmittedAt = (date: Date): string =>
    date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const buildNextRequisitionId = (existingRows: RequisitionRow[]): string => {
    const nextNumericId =
        existingRows.reduce((highest, row) => {
            const numericId = Number.parseInt(row.id.replace(/\D/g, ''), 10);
            return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
        }, 0) + 1;

    return `rq-${nextNumericId}`;
};

const statusLabel: Record<InventoryStatus, string> = {
    healthy: 'Healthy',
    reorder: 'Restock soon',
    review: 'Needs review',
};

const statusClasses: Record<InventoryStatus, string> = {
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    reorder: 'bg-amber-50 text-amber-700 border-amber-100',
    review: 'bg-rose-50 text-rose-700 border-rose-100',
};

const requisitionStatusClasses: Record<RequisitionRow['status'], string> = {
    Queued: 'bg-slate-100 text-slate-600',
    'Needs review': 'bg-rose-50 text-rose-700',
    Packed: 'bg-emerald-50 text-emerald-700',
};

const MetricCard: React.FC<{
    label: string;
    value: string | number;
    subcopy: string;
    icon: typeof ShoppingBag;
    iconWrap: string;
    iconColor: string;
}> = ({ label, value, subcopy, icon: Icon, iconWrap, iconColor }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className={`w-11 h-11 rounded-xl ${iconWrap} flex items-center justify-center mb-4`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{subcopy}</p>
    </div>
);

const InventoryStatusBadge: React.FC<{ status: InventoryStatus }> = ({ status }) => (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses[status]}`}>
        {status === 'healthy' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        {statusLabel[status]}
    </span>
);

const QuantityControl: React.FC<{
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
}> = ({ value, onDecrease, onIncrease }) => (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
        <button
            type="button"
            onClick={onDecrease}
            className="flex h-10 w-10 items-center justify-center text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Decrease draft quantity"
        >
            <Minus className="w-4 h-4" />
        </button>
        <span className="min-w-10 text-center text-sm font-semibold text-slate-900">{value}</span>
        <button
            type="button"
            onClick={onIncrease}
            className="flex h-10 w-10 items-center justify-center text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Increase draft quantity"
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
);

export const SupplyShop: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
    const [draft, setDraft] = useState<Record<string, number>>(() => buildDefaultDraft());
    const [recentRequisitions, setRecentRequisitions] = useState<RequisitionRow[]>(INITIAL_RECENT_REQUISITIONS);
    const [submissionNotice, setSubmissionNotice] = useState<{
        tone: 'info' | 'success';
        title: string;
        detail: string;
    } | null>(null);
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const filteredItems = INVENTORY_ITEMS.filter((item) => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const query = deferredSearchTerm.trim().toLowerCase();
        const matchesSearch =
            query.length === 0 ||
            item.name.toLowerCase().includes(query) ||
            item.sku.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    const draftLines = INVENTORY_ITEMS.filter((item) => (draft[item.id] ?? 0) > 0).map((item) => ({
        ...item,
        quantity: draft[item.id] ?? 0,
    }));
    const belowParCount = INVENTORY_ITEMS.filter((item) => item.onHand < item.parLevel).length;
    const reviewCount = INVENTORY_ITEMS.filter((item) => item.status === 'review').length;
    const templateCount = INVENTORY_ITEMS.filter((item) => item.templateEligible).length;
    const totalDraftPacks = draftLines.reduce((sum, item) => sum + item.quantity, 0);
    const approvalOnlyLines = draftLines.filter((item) => item.approvalMode !== 'Auto-release').length;

    const updateDraftQuantity = (itemId: string, nextQuantity: number) => {
        setDraft((current) => {
            if (nextQuantity <= 0) {
                const { [itemId]: _removed, ...rest } = current;
                return rest;
            }

            return {
                ...current,
                [itemId]: nextQuantity,
            };
        });
    };

    const handleApplyTemplate = (template: StandingTemplate) => {
        setDraft((current) => ({
            ...current,
            ...buildTemplateDraft(template),
        }));
        setSubmissionNotice({
            tone: 'info',
            title: `${template.name} added to the draft`,
            detail: `${template.itemCount} replenishment lines are now staged for ${template.cadence.toLowerCase()}.`,
        });
    };

    const handleSendDraftForReview = () => {
        if (draftLines.length === 0) {
            return;
        }

        const now = new Date();
        const nextStatus: RequisitionRow['status'] =
            draftLines.some((item) => item.approvalMode !== 'Auto-release') ? 'Needs review' : 'Queued';

        setRecentRequisitions((current) => [
            {
                id: buildNextRequisitionId(current),
                label:
                    draftLines.length === 1
                        ? `${draftLines[0]?.name ?? 'Replenishment'} draft`
                        : `${draftLines.length}-line replenishment draft`,
                submittedAt: formatSubmittedAt(now),
                lines: draftLines.length,
                status: nextStatus,
            },
            ...current,
        ]);
        setDraft({});
        setSubmissionNotice({
            tone: 'success',
            title: 'Draft sent for review',
            detail: `${draftLines.length} line${draftLines.length === 1 ? '' : 's'} routed as ${nextStatus.toLowerCase()}.`,
        });
    };

    return (
        <PartnerLayout title="Supplies">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 md:mb-8">
                <div className="max-w-3xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-600">Nexus Supplies</p>
                    <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
                        Build a clean requisition before your clinic runs low.
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-slate-500 leading-relaxed">
                        Track shelf coverage, convert below-par items into draft lines, and route approval-only parts
                        to the right reviewer without turning this workspace into a public commerce page.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setDraft(buildDefaultDraft());
                            setSubmissionNotice(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Rebuild from par levels
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setDraft({});
                            setSubmissionNotice(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                    >
                        <ClipboardList className="w-4 h-4" />
                        Clear draft
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8">
                {[
                    {
                        label: 'Below Par',
                        value: belowParCount,
                        subcopy: 'Items currently driving the reorder queue',
                        icon: AlertTriangle,
                        iconWrap: 'bg-amber-50',
                        iconColor: 'text-amber-600',
                    },
                    {
                        label: 'Draft Packs',
                        value: totalDraftPacks,
                        subcopy: 'Packs currently staged in the requisition',
                        icon: ShoppingBag,
                        iconWrap: 'bg-cyan-50',
                        iconColor: 'text-cyan-600',
                    },
                    {
                        label: 'Standing Templates',
                        value: templateCount,
                        subcopy: 'Reusable replenishment templates available',
                        icon: Repeat2,
                        iconWrap: 'bg-indigo-50',
                        iconColor: 'text-indigo-600',
                    },
                    {
                        label: 'Approval Flags',
                        value: reviewCount,
                        subcopy: 'Lines that need ops or manager review',
                        icon: ShieldCheck,
                        iconWrap: 'bg-rose-50',
                        iconColor: 'text-rose-600',
                    },
                ].map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <MetricCard {...metric} />
                    </motion.div>
                ))}
            </div>

            {submissionNotice && (
                <div
                    role="status"
                    className={`mb-6 rounded-2xl border px-5 py-4 text-sm shadow-sm ${
                        submissionNotice.tone === 'success'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                            : 'border-cyan-100 bg-cyan-50 text-cyan-800'
                    }`}
                >
                    <p className="font-semibold">{submissionNotice.title}</p>
                    <p className="mt-1 text-sm/6">{submissionNotice.detail}</p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-6">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 p-5 md:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Inventory signals</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Search by item type or SKU, then move the right pack counts into the draft requisition.
                                    </p>
                                </div>
                                <div className="relative w-full lg:w-80">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        placeholder="Search inventory"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-400 focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {CATEGORY_FILTERS.map((filter) => {
                                    const active = activeCategory === filter;
                                    return (
                                        <button
                                            key={filter}
                                            type="button"
                                            onClick={() => setActiveCategory(filter)}
                                            aria-pressed={active}
                                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                                active
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 p-5 md:p-6">
                            {filteredItems.map((item, index) => {
                                const coverage = Math.min(100, Math.round((item.onHand / item.parLevel) * 100));
                                const quantity = draft[item.id] ?? 0;
                                const coverageDays = Math.max(5, Math.round((item.onHand / item.monthlyBurn) * 30));

                                return (
                                    <motion.article
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                                    {item.category}
                                                </p>
                                                <h3 className="mt-1 text-base font-bold text-slate-900">{item.name}</h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    SKU {item.sku} - Pack size {item.packSize}
                                                </p>
                                            </div>
                                            <InventoryStatusBadge status={item.status} />
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">On hand</p>
                                                <p className="mt-1 text-lg font-bold text-slate-900">{item.onHand}</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Par level</p>
                                                <p className="mt-1 text-lg font-bold text-slate-900">{item.parLevel}</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Coverage</p>
                                                <p className="mt-1 text-lg font-bold text-slate-900">{coverageDays}d</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                                <span>Shelf coverage</span>
                                                <span>{coverage}% of par</span>
                                            </div>
                                            <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        item.status === 'healthy'
                                                            ? 'bg-emerald-500'
                                                            : item.status === 'reorder'
                                                                ? 'bg-amber-500'
                                                                : 'bg-rose-500'
                                                    }`}
                                                    style={{ width: `${coverage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                                Routing
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">{item.approvalMode}</p>
                                            <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.note}</p>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                                    Draft quantity
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                                    {quantity > 0 ? `${quantity} pack${quantity === 1 ? '' : 's'} staged` : 'Not in draft'}
                                                </p>
                                            </div>
                                            <QuantityControl
                                                value={quantity}
                                                onDecrease={() => updateDraftQuantity(item.id, quantity - 1)}
                                                onIncrease={() => updateDraftQuantity(item.id, quantity + 1)}
                                            />
                                        </div>

                                        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                                            <button
                                                type="button"
                                                onClick={() => updateDraftQuantity(item.id, item.recommendedQty)}
                                                className="inline-flex items-center gap-1 font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                                            >
                                                Use recommended
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                            <span>Last ordered {item.lastOrder}</span>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>

                        {filteredItems.length === 0 && (
                            <div className="border-t border-slate-100 p-6 text-sm text-slate-500">
                                No inventory lines match the current search and category filters.
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Recent requisitions</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Operational status only. Final fulfilment still routes through partner review when required.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left">
                                <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3 md:px-6">Draft</th>
                                        <th className="px-5 py-3 md:px-6">Submitted</th>
                                        <th className="px-5 py-3 md:px-6">Lines</th>
                                        <th className="px-5 py-3 md:px-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentRequisitions.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-5 py-4 md:px-6">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{row.label}</p>
                                                    <p className="mt-1 text-xs text-slate-500 uppercase tracking-[0.18em]">{row.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 md:px-6 text-sm text-slate-600">{row.submittedAt}</td>
                                            <td className="px-5 py-4 md:px-6 text-sm font-semibold text-slate-900">{row.lines}</td>
                                            <td className="px-5 py-4 md:px-6">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${requisitionStatusClasses[row.status]}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="sticky top-20 rounded-2xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-900/20">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                    Draft requisition
                                </p>
                                <h2 className="mt-2 text-lg font-bold">Ready for partner review</h2>
                            </div>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                                {draftLines.length} lines
                            </span>
                        </div>

                        <div className="mt-5 space-y-3">
                            {draftLines.length > 0 ? (
                                draftLines.map((item) => (
                                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{item.name}</p>
                                                <p className="mt-1 text-xs text-slate-300">
                                                    {item.quantity} pack{item.quantity === 1 ? '' : 's'} - {item.approvalMode}
                                                </p>
                                            </div>
                                            <Package className="w-4 h-4 text-cyan-300 shrink-0" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm text-slate-300">
                                    No lines are staged. Use the inventory cards to build a requisition.
                                </div>
                            )}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white/5 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Packs</p>
                                <p className="mt-1 text-2xl font-bold text-white">{totalDraftPacks}</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Approval lines</p>
                                <p className="mt-1 text-2xl font-bold text-white">{approvalOnlyLines}</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                            <p className="text-sm font-semibold text-cyan-100">Routing note</p>
                            <p className="mt-1 text-sm leading-relaxed text-cyan-50/90">
                                Approval-only lines stay in review rather than auto-submitting. This keeps the workspace
                                operational without exposing unsupported pricing or fulfilment promises.
                            </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleSendDraftForReview}
                                disabled={draftLines.length === 0}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/70 disabled:text-slate-400"
                            >
                                <ClipboardList className="w-4 h-4" />
                                Send draft for review
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setDraft(buildDefaultDraft());
                                    setSubmissionNotice(null);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset draft
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center gap-2">
                            <Clock3 className="w-4 h-4 text-amber-500" />
                            <h3 className="text-base font-bold text-slate-900">Ops queue</h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            These lines need a human checkpoint before the draft can move forward cleanly.
                        </p>
                        <div className="mt-4 space-y-3">
                            {INVENTORY_ITEMS.filter((item) => item.status !== 'healthy').map((item) => (
                                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {item.onHand} on hand - par {item.parLevel} - {item.approvalMode}
                                            </p>
                                        </div>
                                        <InventoryStatusBadge status={item.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center gap-2">
                            <Repeat2 className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-base font-bold text-slate-900">Standing templates</h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            Reusable replenishment patterns for fast requisition building.
                        </p>
                        <div className="mt-4 space-y-3">
                            {STANDING_TEMPLATES.map((template) => (
                                <div key={template.id} className="rounded-2xl border border-slate-200 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {template.cadence} - {template.itemCount} items - owner {template.owner}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyTemplate(template)}
                                            aria-label={`Use ${template.name} template`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                                        >
                                            Use
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
};

export default SupplyShop;
