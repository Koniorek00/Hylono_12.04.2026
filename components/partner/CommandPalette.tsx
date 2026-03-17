import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    Search,
    Command,
    CornerDownLeft,
    LayoutDashboard,
    Wrench,
    ShoppingBag,
    Users,
    Activity,
    Brain,
    Palette,
    GraduationCap,
    FileText,
    Link2,
    Plus,
    Calendar,
    Settings,
    LogOut,
    Home,
    LucideIcon
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    category: 'Tools' | 'Actions' | 'Patients' | 'System';
    href?: string;
    action?: () => void;
}

export const CommandPalette: React.FC = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Mock Data for Search
    const ITEMS: CommandItem[] = [
        // Tools
        { id: 't1', label: 'Dashboard', category: 'Tools', icon: LayoutDashboard, href: '/partner/dashboard' },
        { id: 't2', label: 'Fleet Health', category: 'Tools', icon: Wrench, href: '/partner/fleet' },
        { id: 't3', label: 'Supply & Shop', category: 'Tools', icon: ShoppingBag, href: '/partner/shop' },
        { id: 't4', label: 'Nexus (CRM)', category: 'Tools', icon: Activity, href: '/partner/nexus' },
        { id: 't5', label: 'Documents', category: 'Tools', icon: FileText, href: '/partner/docs' },
        { id: 't6', label: 'Marketing Studio', category: 'Tools', icon: Palette, href: '/partner/studio' },
        { id: 't7', label: 'Academy', category: 'Tools', icon: GraduationCap, href: '/partner/academy' },

        // Actions
        { id: 'a1', label: 'Add New Patient', description: 'Register a new client in Nexus', category: 'Actions', icon: Plus, href: '/partner/nexus?action=new' },
        { id: 'a2', label: 'Log Device Maintenance', description: 'Report an issue or routine check', category: 'Actions', icon: Wrench, href: '/partner/fleet?action=log' },
        { id: 'a3', label: 'Create New Campaign', description: 'Design a new marketing asset', category: 'Actions', icon: Palette, href: '/partner/studio?action=new' },

        // Mock Patients (Dynamic in real app)
        { id: 'p1', label: 'James Wilson', description: 'Active • Last visit: Jan 14', category: 'Patients', icon: Users, href: '/partner/nexus?patient=1' },
        { id: 'p2', label: 'Sarah Connor', description: 'Active • Last visit: Jan 10', category: 'Patients', icon: Users, href: '/partner/nexus?patient=2' },

        // System
        { id: 's1', label: 'Back to Website', category: 'System', icon: Home, href: '/' },
        { id: 's2', label: 'Settings', category: 'System', icon: Settings, href: '/partner/settings' },
        { id: 's3', label: 'Log Out', category: 'System', icon: LogOut, action: () => signOut({ callbackUrl: '/login' }) },
    ];

    // Filter Items
    const filteredItems = ITEMS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
            }

            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (open) {
            // Slight delay to allow animation to start
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [open]);

    // Navigation Logic
    useEffect(() => {
        const handleNav = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const selected = filteredItems[selectedIndex];
                if (selected) {
                    executeItem(selected);
                }
            }
        };

        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [open, filteredItems, selectedIndex]);

    const executeItem = (item: CommandItem) => {
        setOpen(false);
        if (item.action) {
            item.action();
        } else if (item.href) {
            router.push(item.href);
            window.scrollTo(0, 0);
        }
    };

    // Group items for display
    const groups = ['Actions', 'Tools', 'Patients', 'System'];

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Window */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Command palette"
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-700/10 overflow-hidden relative flex flex-col max-h-[60vh]"
                    >
                        {/* Search Bar */}
                        <div className="flex items-center px-4 py-4 border-b border-slate-100/50">
                            <Search className="w-5 h-5 text-slate-400 mr-3" aria-hidden="true" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Where to? (e.g. 'Fleet', 'Patient', 'New Order')..."
                                aria-label="Navigate to page or action"
                                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder-slate-400"
                                value={query}
                                onChange={e => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                            />
                            <div className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                ESC
                            </div>
                        </div>

                        {/* Results */}
                        <div className="overflow-y-auto flex-1 p-2">
                            {filteredItems.length === 0 ? (
                                <div className="py-12 text-center text-slate-400">
                                    <Command className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No results found for "{query}"</p>
                                </div>
                            ) : (
                                groups.map(group => {
                                    const groupItems = filteredItems.filter(i => i.category === group);
                                    if (groupItems.length === 0) return null;

                                    return (
                                        <div key={group} className="mb-2">
                                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {group}
                                            </div>
                                            {groupItems.map(item => {
                                                const globalIndex = filteredItems.indexOf(item);
                                                const isSelected = globalIndex === selectedIndex;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => executeItem(item)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-cyan-50' : 'hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-md ${isSelected ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`text-sm font-medium ${isSelected ? 'text-cyan-900 pr-8' : 'text-slate-700'
                                                                }`}>
                                                                {item.label}
                                                            </div>
                                                            {item.description && (
                                                                <div className={`text-xs truncate ${isSelected ? 'text-cyan-600/80' : 'text-slate-400'
                                                                    }`}>
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isSelected && (
                                                            <CornerDownLeft className="w-4 h-4 text-cyan-400" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
                            <div className="flex gap-4">
                                <span><strong className="text-slate-600">↑↓</strong> Navigate</span>
                                <span><strong className="text-slate-600">↵</strong> Select</span>
                            </div>
                            <div>
                                Hylono OS
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

