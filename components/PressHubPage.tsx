/**
 * PressHubPage
 * Unified press/media page consolidating PressPage and PressKitPage.
 * 
 * Tabs:
 *  1. Overview — Company facts, stats, recent coverage, contact
 *  2. Releases — Press releases timeline
 *  3. Assets — Downloadable logos, images, documents
 * 
 * Route: /press
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
    FileText, Download, Image, Film, Mail, ExternalLink,
    Calendar, Newspaper, Globe, ChevronRight
} from 'lucide-react';
import { NavigateFunction } from '../types';

interface PressHubPageProps {
    onNavigate?: NavigateFunction;
    initialTab?: 'overview' | 'releases' | 'assets';
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const COMPANY_FACTS = [
    { label: 'Founded', value: '2019' },
    { label: 'Headquarters', value: 'Warsaw, Poland' },
    { label: 'Markets', value: 'EU, UK, MENA' },
    { label: 'Products', value: 'HBOT, PEMF, RLT, Hydrogen' },
    { label: 'Employees', value: '25+' },
];

const STATS = [
    { value: '2019', label: 'Founded' },
    { value: '12', label: 'Countries' },
    { value: '3,500+', label: 'Systems deployed' },
    { value: '180+', label: 'Clinic partners' },
];

const PRESS_RELEASES = [
    { date: 'Jan 2026', title: 'Hylono Launches Next-Gen HBOT Chamber Series', summary: 'New flagship chamber line with enhanced safety features and smart connectivity.', link: '#' },
    { date: 'Dec 2025', title: 'Partnership with EU Wellness Federation Announced', summary: 'Collaboration to establish industry standards for home wellness devices.', link: '#' },
    { date: 'Nov 2025', title: 'Hylono Expansion into DACH Market', summary: 'New logistics hub in Germany to serve German-speaking markets.', link: '#' },
    { date: 'Oct 2025', title: 'Hylono Raises €18M Series B', summary: 'Funding to expand modality platform and double engineering team.', link: '#' },
];

const RECENT_COVERAGE = [
    { outlet: 'Biohacking Weekly', headline: 'Hylono Brings Clinical-Grade HBOT to the Home', date: 'Jan 2026', icon: Newspaper },
    { outlet: 'FT Health', headline: 'The Premium Wellness Hardware Race Heats Up', date: 'Dec 2025', icon: Globe },
    { outlet: 'TechCrunch EU', headline: 'Hylono Raises €18M Series B to Expand Modality Platform', date: 'Oct 2025', icon: ExternalLink },
    { outlet: "Men's Health UK", headline: 'Recovery Tech: What the Pros Are Actually Using', date: 'Sep 2025', icon: Newspaper },
];

const ASSET_CATEGORIES = [
    {
        category: 'Brand Logos',
        icon: Image,
        color: 'text-cyan-400',
        items: [
            { name: 'Primary Logo (SVG)', format: 'SVG', size: '12 KB' },
            { name: 'Primary Logo (PNG — white bg)', format: 'PNG', size: '340 KB' },
            { name: 'Primary Logo (PNG — dark bg)', format: 'PNG', size: '340 KB' },
            { name: 'Hexagon Icon Only', format: 'SVG + PNG', size: '8 KB' },
        ],
    },
    {
        category: 'Product Imagery',
        icon: Film,
        color: 'text-violet-400',
        items: [
            { name: 'HBOT Chamber — Studio Shots (10 images)', format: 'ZIP / JPG', size: '48 MB' },
            { name: 'PEMF Mat — Lifestyle Shots (8 images)', format: 'ZIP / JPG', size: '32 MB' },
            { name: 'Red Light Panel — Studio (6 images)', format: 'ZIP / JPG', size: '24 MB' },
            { name: 'Hydrogen Generator — Studio (6 images)', format: 'ZIP / JPG', size: '22 MB' },
        ],
    },
    {
        category: 'Company Documents',
        icon: FileText,
        color: 'text-emerald-400',
        items: [
            { name: 'Hylono Company Overview (One-pager)', format: 'PDF', size: '1.2 MB' },
            { name: 'Technology White Paper', format: 'PDF', size: '3.4 MB' },
            { name: 'CEO & Founder Bio + Headshot', format: 'ZIP / PDF', size: '8 MB' },
            { name: 'Brand Style Guide', format: 'PDF', size: '2.1 MB' },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const PressHubPage: React.FC<PressHubPageProps> = ({ onNavigate, initialTab = 'overview' }) => {
    const shouldReduceMotion = useReducedMotion();
    const [activeTab, setActiveTab] = useState<'overview' | 'releases' | 'assets'>(initialTab);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 pt-28 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-cyan-400 text-xs tracking-widest uppercase mb-6">
                        <Newspaper size={12} /> Press & Media
                    </div>
                    <h1 id="press-hero-headline" className="text-4xl md:text-5xl font-bold futuristic-font text-white mb-4">
                        Media Resources
                    </h1>
                    <p id="press-hero-description" className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Everything you need to cover Hylono — company facts, press releases, and downloadable assets.
                    </p>
                </motion.div>

                {/* Tab Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-slate-800/60 rounded-2xl p-1.5 border border-slate-700/50">
                        {[
                            { key: 'overview', label: 'Overview', icon: Newspaper },
                            { key: 'releases', label: 'Press Releases', icon: Calendar },
                            { key: 'assets', label: 'Media Assets', icon: Download },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-cyan-500 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {STATS.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 text-center"
                                >
                                    <div className="text-3xl font-bold futuristic-font text-white mb-1">{stat.value}</div>
                                    <div className="text-slate-400 text-xs uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Two Columns: Facts + Recent Coverage */}
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {/* Company Facts */}
                            <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700/50">
                                <h2 className="text-xl font-bold text-white mb-6">Company Facts</h2>
                                <div className="space-y-4">
                                    {COMPANY_FACTS.map((fact) => (
                                        <div key={fact.label} className="flex justify-between border-b border-slate-700/50 pb-3">
                                            <span className="text-slate-400">{fact.label}</span>
                                            <span className="font-medium text-white">{fact.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Coverage */}
                            <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700/50">
                                <h2 className="text-xl font-bold text-white mb-6">Recent Coverage</h2>
                                <div className="space-y-4">
                                    {RECENT_COVERAGE.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 group cursor-pointer">
                                            <item.icon size={14} className="text-cyan-400 mt-1 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                                    <span className="uppercase tracking-wider">{item.outlet}</span>
                                                    <span>•</span>
                                                    <span>{item.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-200 group-hover:text-cyan-300 transition-colors">
                                                    {item.headline}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2">
                                <Download size={16} /> Download Full Press Kit (ZIP)
                            </button>
                            <a
                                href="mailto:press@hylono.com"
                                className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2"
                            >
                                <Mail size={16} /> press@hylono.com
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Press Releases Tab */}
                {activeTab === 'releases' && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="max-w-3xl mx-auto space-y-4">
                            {PRESS_RELEASES.map((pr, i) => (
                                <a
                                    key={i}
                                    href={pr.link}
                                    className="block bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
                                >
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <Calendar size={12} />
                                        <span className="uppercase tracking-wider">{pr.date}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2">
                                        {pr.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm">{pr.summary}</p>
                                    <div className="flex items-center gap-1 text-cyan-400 text-sm mt-3 font-medium">
                                        Read Full Release <ChevronRight size={14} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Assets Tab */}
                {activeTab === 'assets' && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="space-y-8">
                            {ASSET_CATEGORIES.map((group, i) => (
                                <div key={group.category} className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <group.icon size={20} className={group.color} />
                                        <h3 className="text-white font-semibold">{group.category}</h3>
                                    </div>
                                    <div className="divide-y divide-slate-700/50">
                                        {group.items.map((item, j) => (
                                            <div key={j} className="flex items-center justify-between py-3 group">
                                                <div>
                                                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{item.format} · {item.size}</p>
                                                </div>
                                                <button className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                                    <Download size={13} /> Download
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Download All */}
                        <div className="mt-8 text-center">
                            <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3 rounded-full transition-all inline-flex items-center gap-2">
                                <Download size={16} /> Download Complete Press Kit (ZIP)
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Media Contact Footer */}
                <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 rounded-3xl p-8 text-center"
                >
                    <Mail className="mx-auto text-cyan-400 mb-4" size={36} />
                    <h2 className="text-xl font-bold futuristic-font text-white mb-2">Media Contact</h2>
                    <p className="text-slate-400 mb-4">For press enquiries, interview requests, and exclusive briefings</p>
                    <a href="mailto:press@hylono.com" className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg transition-colors">
                        press@hylono.com
                    </a>
                    <p className="text-slate-500 text-sm mt-2">Response within 24 hours on business days</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PressHubPage;
