import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Zap, Microscope, BookOpen, FileText, Activity,
    Sun, Wind, Droplets, Beaker, Link2, Search,
    ArrowRight, CheckCircle2, Shield, Sparkles
} from 'lucide-react';
import { TechType } from '../../types';
import { KNOWLEDGE_REGISTRY } from '../../constants/knowledge';
import { RESEARCH_STUDIES, BLOG_POSTS } from '../../constants/content';
import { toBlogSlug } from '@/lib/blog';

// === MENTIONABLE ENTITY TYPES ===
export type MentionType = 'machine' | 'research' | 'documentation' | 'protocol' | 'knowledge' | 'article';

export interface MentionEntity {
    id: string;
    type: MentionType;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    link?: string;
    metadata?: Record<string, any>;
}

// === MENTION DATABASE ===
const MACHINE_ENTITIES: MentionEntity[] = [
    {
        id: 'HBOT',
        type: 'machine',
        label: 'HBOT Chamber',
        description: 'Hyperbaric Oxygen Therapy — Pressurized oxygen for cellular regeneration',
        icon: <Wind size={16} />,
        color: 'from-cyan-500 to-blue-600',
        link: '/product/hbot',
        metadata: { category: 'Core Modality', pressure: '1.3-2.0 ATA' }
    },
    {
        id: 'PEMF',
        type: 'machine',
        label: 'PEMF Mat',
        description: 'Pulsed Electromagnetic Field — Cellular energy optimization',
        icon: <Activity size={16} />,
        color: 'from-purple-500 to-pink-600',
        link: '/product/pemf',
        metadata: { category: 'Core Modality', frequency: '1-30 Hz' }
    },
    {
        id: 'RLT',
        type: 'machine',
        label: 'Red Light Panel',
        description: 'Red Light Therapy — Photobiomodulation for mitochondrial health',
        icon: <Sun size={16} />,
        color: 'from-red-500 to-orange-600',
        link: '/product/rlt',
        metadata: { category: 'Core Modality', wavelength: '660nm / 850nm' }
    },
    {
        id: 'HYDROGEN',
        type: 'machine',
        label: 'Hydrogen Generator',
        description: 'Molecular Hydrogen — Selective antioxidant for oxidative stress',
        icon: <Droplets size={16} />,
        color: 'from-sky-500 to-teal-600',
        link: '/product/hydrogen',
        metadata: { category: 'Core Modality', concentration: '2-4%' }
    }
];

const DOCUMENTATION_ENTITIES: MentionEntity[] = [
    {
        id: 'getting-started',
        type: 'documentation',
        label: 'Getting Started Guide',
        description: 'Quick start guide for new Hylono device owners',
        icon: <BookOpen size={16} />,
        color: 'from-emerald-500 to-green-600',
        link: '/help?tab=support'
    },
    {
        id: 'safety-protocols',
        type: 'documentation',
        label: 'Safety Protocols',
        description: 'Official safety guidelines and contraindications',
        icon: <Shield size={16} />,
        color: 'from-amber-500 to-yellow-600',
        link: '/help?tab=support'
    },
    {
        id: 'maintenance-guide',
        type: 'documentation',
        label: 'Maintenance Guide',
        description: 'Device care, cleaning, and maintenance procedures',
        icon: <FileText size={16} />,
        color: 'from-slate-500 to-gray-600',
        link: '/help?tab=support'
    },
    {
        id: 'protocol-stacking',
        type: 'documentation',
        label: 'Protocol Stacking',
        description: 'How to combine modalities for synergistic effects',
        icon: <Sparkles size={16} />,
        color: 'from-violet-500 to-purple-600',
        link: '/protocols'
    }
];

const PROTOCOL_ENTITIES: MentionEntity[] = [
    {
        id: 'superhuman',
        type: 'protocol',
        label: 'Superhuman Protocol',
        description: 'PEMF + HBOT + RLT stacking for peak performance',
        icon: <Zap size={16} />,
        color: 'from-slate-700 to-slate-900',
        link: '/protocols#superhuman'
    },
    {
        id: 'recovery-stack',
        type: 'protocol',
        label: 'Recovery Stack',
        description: 'Post-workout regeneration protocol',
        icon: <Activity size={16} />,
        color: 'from-green-500 to-emerald-600',
        link: '/protocols#recovery'
    },
    {
        id: 'sleep-optimization',
        type: 'protocol',
        label: 'Sleep Optimization',
        description: 'Evening protocol for deep restorative sleep',
        icon: <Beaker size={16} />,
        color: 'from-indigo-500 to-blue-600',
        link: '/protocols#sleep'
    }
];

// Generate research entities from RESEARCH_STUDIES
const getResearchEntities = (): MentionEntity[] => {
    return RESEARCH_STUDIES.map(study => ({
        id: study.id,
        type: 'research' as MentionType,
        label: study.title,
        description: `${study.metric}: ${study.value} | N=${study.participants}`,
        icon: <Microscope size={16} />,
        color: study.category === 'Recovery' ? 'from-green-500 to-emerald-600' :
            study.category === 'Sleep' ? 'from-indigo-500 to-blue-600' :
                study.category === 'Cognitive' ? 'from-purple-500 to-violet-600' :
                    'from-cyan-500 to-teal-600',
        link: `/research#${study.id}`,
        metadata: {
            status: study.status,
            trace_id: study.trace_id,
            participants: study.participants
        }
    }));
};

// Generate knowledge pack entities
const getKnowledgeEntities = (): MentionEntity[] => {
    return Object.entries(KNOWLEDGE_REGISTRY).map(([key, pack]) => ({
        id: pack.id,
        type: 'knowledge' as MentionType,
        label: pack.title,
        description: `${pack.approvedClaims.slice(0, 2).join(', ')}...`,
        icon: <Shield size={16} />,
        color: key === 'HBOT' ? 'from-cyan-500 to-blue-600' :
            key === 'PEMF' ? 'from-purple-500 to-pink-600' :
                key === 'RLT' ? 'from-red-500 to-orange-600' :
                    'from-sky-500 to-teal-600',
        link: `/knowledge/${key.toLowerCase()}`,
        metadata: {
            confidence: pack.confidence,
            status: pack.status,
            tags: pack.tags
        }
    }));
};

// Generate article entities from BLOG_POSTS
const getArticleEntities = (): MentionEntity[] => {
    return BLOG_POSTS.map(post => ({
        id: String(post.id),
        type: 'article' as MentionType,
        label: post.title,
        description: post.excerpt,
        icon: <FileText size={16} />,
        color: post.category === 'HBOT' ? 'from-cyan-500 to-blue-600' :
            post.category === 'PEMF' ? 'from-purple-500 to-pink-600' :
                post.category === 'RLT' ? 'from-red-500 to-orange-600' :
                    post.category === 'Hydrogen' ? 'from-sky-500 to-teal-600' :
                        'from-slate-500 to-gray-600',
        link: `/blog/${toBlogSlug(post.title)}`,
        metadata: {
            category: post.category,
            readTime: post.readTime,
            trace_id: post.trace_id
        }
    }));
};

// === COMPLETE DATABASE ===
export const getAllMentionEntities = (): MentionEntity[] => [
    ...MACHINE_ENTITIES,
    ...getResearchEntities(),
    ...DOCUMENTATION_ENTITIES,
    ...PROTOCOL_ENTITIES,
    ...getKnowledgeEntities(),
    ...getArticleEntities()
];

// === MENTION CATEGORY CONFIG ===
export const MENTION_CATEGORIES: { key: MentionType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { key: 'machine', label: 'Devices', icon: <Zap size={14} />, shortcut: '@machine:' },
    { key: 'research', label: 'Research', icon: <Microscope size={14} />, shortcut: '@research:' },
    { key: 'documentation', label: 'Docs', icon: <BookOpen size={14} />, shortcut: '@docs:' },
    { key: 'protocol', label: 'Protocols', icon: <Beaker size={14} />, shortcut: '@protocol:' },
    { key: 'knowledge', label: 'Knowledge', icon: <Shield size={14} />, shortcut: '@knowledge:' },
    { key: 'article', label: 'Articles', icon: <FileText size={14} />, shortcut: '@article:' }
];

// === MENTION SUGGESTIONS DROPDOWN ===
interface MentionSuggestionsProps {
    query: string;
    category?: MentionType;
    position: { top: number; left: number };
    onSelect: (entity: MentionEntity) => void;
    onClose: () => void;
}

export const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({
    query,
    category,
    position,
    onSelect,
    onClose
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter entities based on query and category
    const allEntities = getAllMentionEntities();
    const filteredEntities = allEntities.filter(entity => {
        const matchesCategory = !category || entity.type === category;
        const matchesQuery = !query ||
            entity.label.toLowerCase().includes(query.toLowerCase()) ||
            entity.description.toLowerCase().includes(query.toLowerCase()) ||
            entity.id.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
    }).slice(0, 8); // Limit to 8 suggestions

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(i + 1, filteredEntities.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredEntities[selectedIndex]) {
                        onSelect(filteredEntities[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredEntities, selectedIndex, onSelect, onClose]);

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query, category]);

    if (filteredEntities.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ top: position.top, left: position.left }}
                className="absolute z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            >
                <div className="p-6 text-center">
                    <Search size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400">No results found</p>
                    <p className="text-xs text-slate-300 mt-1">Try a different search term</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ top: position.top, left: position.left }}
            className="absolute z-50 w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Link2 size={14} className="text-cyan-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Insert Reference
                    </span>
                    {query && (
                        <span className="ml-auto text-[10px] text-cyan-600 font-mono bg-cyan-50 px-2 py-0.5 rounded">
                            "{query}"
                        </span>
                    )}
                </div>

                {/* Category Pills */}
                <div className="flex gap-1 mt-2 overflow-x-auto">
                    {MENTION_CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${category === cat.key
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {filteredEntities.map((entity, index) => (
                    <motion.button
                        key={`${entity.type}-${entity.id}`}
                        onClick={() => onSelect(entity)}
                        className={`w-full text-left p-4 transition-all border-b border-slate-50 last:border-0 ${index === selectedIndex
                                ? 'bg-cyan-50'
                                : 'hover:bg-slate-50'
                            }`}
                        whileHover={{ x: 4 }}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${entity.color} flex items-center justify-center text-white flex-shrink-0`}>
                                {entity.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-900 truncate">{entity.label}</span>
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">
                                        {entity.type}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{entity.description}</p>

                                {/* Metadata Tags */}
                                {entity.metadata && (
                                    <div className="flex gap-1 mt-2">
                                        {entity.metadata.trace_id && (
                                            <span className="text-[8px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                                                <CheckCircle2 size={8} />
                                                {entity.metadata.trace_id}
                                            </span>
                                        )}
                                        {entity.metadata.status && (
                                            <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                {entity.metadata.status}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Arrow */}
                            <ArrowRight size={14} className={`text-slate-300 flex-shrink-0 transition-colors ${index === selectedIndex ? 'text-cyan-500' : ''
                                }`} />
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                    <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono">↑↓</kbd> Navigate
                    <span className="mx-2">·</span>
                    <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono">Enter</kbd> Select
                    <span className="mx-2">·</span>
                    <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono">Esc</kbd> Close
                </span>
            </div>
        </motion.div>
    );
};

export default MentionSuggestions;

