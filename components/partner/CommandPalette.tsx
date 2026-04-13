'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Command,
    CornerDownLeft,
    LayoutDashboard,
    Wrench,
    ShoppingBag,
    Users,
    FileText,
    Palette,
    GraduationCap,
    Boxes,
    Link2,
    Home,
    LucideIcon,
    LogIn,
    MessageSquare,
} from 'lucide-react';
import { buildLoginRedirectPath } from '@/lib/auth-redirect';

type CommandCategory = 'Modules' | 'Access' | 'System';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    category: CommandCategory;
    href?: string;
}

interface CommandPaletteProps {
    triggerLabel?: string;
}

const ITEMS: CommandItem[] = [
    {
        id: 'm1',
        label: 'Workspace overview',
        description: 'Open the Nexus overview and module map.',
        category: 'Modules',
        icon: LayoutDashboard,
        href: '/nexus',
    },
    {
        id: 'm2',
        label: 'Clients module',
        description: 'Explore records, intake, and protocol coverage.',
        category: 'Modules',
        icon: Users,
        href: '/nexus/clients',
    },
    {
        id: 'm3',
        label: 'Fleet module',
        description: 'Review service health and maintenance workflows.',
        category: 'Modules',
        icon: Wrench,
        href: '/nexus/fleet',
    },
    {
        id: 'm4',
        label: 'Documents module',
        description: 'Inspect intake sheets, consents, and generated forms.',
        category: 'Modules',
        icon: FileText,
        href: '/nexus/docs',
    },
    {
        id: 'm5',
        label: 'Studio module',
        description: 'See campaign, asset, and collateral tooling.',
        category: 'Modules',
        icon: Palette,
        href: '/nexus/studio',
    },
    {
        id: 'm6',
        label: 'Academy module',
        description: 'Review staff onboarding and certification coverage.',
        category: 'Modules',
        icon: GraduationCap,
        href: '/nexus/academy',
    },
    {
        id: 'm7',
        label: 'Supplies module',
        description: 'Browse restock and clinic supply workflows.',
        category: 'Modules',
        icon: ShoppingBag,
        href: '/nexus/supplies',
    },
    {
        id: 'm8',
        label: 'Team module',
        description: 'Inspect staffing, readiness, and compliance views.',
        category: 'Modules',
        icon: Boxes,
        href: '/nexus/team',
    },
    {
        id: 'a1',
        label: 'Sign in to account',
        description: 'Continue into authenticated partner access.',
        category: 'Access',
        icon: LogIn,
        href: buildLoginRedirectPath('/account'),
    },
    {
        id: 'a2',
        label: 'Contact Hylono',
        description: 'Talk to the team about rollout, training, or access.',
        category: 'Access',
        icon: MessageSquare,
        href: '/contact',
    },
    {
        id: 's1',
        label: 'Back to website',
        description: 'Return to the main Hylono website.',
        category: 'System',
        icon: Home,
        href: '/',
    },
    {
        id: 's2',
        label: 'Partner access',
        description: 'Open the partner entry route.',
        category: 'System',
        icon: Link2,
        href: '/partners',
    },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    triggerLabel = 'Search modules',
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredItems = ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((current) => !current);
            }

            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }

        const timeout = window.setTimeout(() => inputRef.current?.focus(), 50);
        setQuery('');
        setSelectedIndex(0);

        return () => window.clearTimeout(timeout);
    }, [open]);

    useEffect(() => {
        const handleNav = (event: KeyboardEvent) => {
            if (!open || filteredItems.length === 0) {
                return;
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex((current) => (current + 1) % filteredItems.length);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex((current) => (current - 1 + filteredItems.length) % filteredItems.length);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                const selected = filteredItems[selectedIndex];
                if (selected) {
                    setOpen(false);
                    router.push(selected.href ?? '/nexus');
                    window.scrollTo(0, 0);
                }
            }
        };

        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [filteredItems, open, router, selectedIndex]);

    const groups: CommandCategory[] = ['Modules', 'Access', 'System'];

    const executeItem = (item: CommandItem) => {
        setOpen(false);
        router.push(item.href ?? '/nexus');
        window.scrollTo(0, 0);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? 'nexus-command-palette' : undefined}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>{triggerLabel}</span>
                <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 md:inline-flex">
                    Ctrl K
                </kbd>
            </button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[20vh]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        <motion.div
                            id="nexus-command-palette"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Nexus command palette"
                            initial={{ scale: 0.96, opacity: 0, y: -16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0, y: -16 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                            className="relative flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-slate-700/10 bg-white shadow-2xl"
                        >
                            <div className="flex items-center border-b border-slate-100/70 px-4 py-4">
                                <Search className="mr-3 h-5 w-5 text-slate-400" aria-hidden="true" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search modules, access, or routes..."
                                    aria-label="Search Nexus modules"
                                    className="flex-1 border-none bg-transparent text-lg text-slate-800 outline-none placeholder:text-slate-400"
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setSelectedIndex(0);
                                    }}
                                />
                                <div className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    ESC
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2">
                                {filteredItems.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400">
                                        <Command className="mx-auto mb-3 h-12 w-12 opacity-20" />
                                        <p>No results found for "{query}"</p>
                                    </div>
                                ) : (
                                    groups.map((group) => {
                                        const groupItems = filteredItems.filter((item) => item.category === group);
                                        if (groupItems.length === 0) {
                                            return null;
                                        }

                                        return (
                                            <div key={group} className="mb-2">
                                                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    {group}
                                                </div>
                                                {groupItems.map((item) => {
                                                    const globalIndex = filteredItems.indexOf(item);
                                                    const isSelected = globalIndex === selectedIndex;

                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => executeItem(item)}
                                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                                                                isSelected ? 'bg-cyan-50' : 'hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <div
                                                                className={`rounded-md p-2 ${
                                                                    isSelected
                                                                        ? 'bg-cyan-100 text-cyan-700'
                                                                        : 'bg-slate-100 text-slate-500'
                                                                }`}
                                                            >
                                                                <item.icon className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div
                                                                    className={`pr-8 text-sm font-medium ${
                                                                        isSelected ? 'text-cyan-900' : 'text-slate-700'
                                                                    }`}
                                                                >
                                                                    {item.label}
                                                                </div>
                                                                {item.description ? (
                                                                    <div
                                                                        className={`truncate text-xs ${
                                                                            isSelected ? 'text-cyan-700/80' : 'text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {item.description}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            {isSelected ? (
                                                                <CornerDownLeft className="h-4 w-4 text-cyan-400" />
                                                            ) : null}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[10px] text-slate-400">
                                <div className="flex gap-4">
                                    <span>
                                        <strong className="text-slate-600">Up/Down</strong> Navigate
                                    </span>
                                    <span>
                                        <strong className="text-slate-600">Enter</strong> Open
                                    </span>
                                </div>
                                <div>Hylono Nexus</div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
