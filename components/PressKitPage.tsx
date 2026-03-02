import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { Download, FileText, Image, Film, Mail, ExternalLink, Newspaper, Globe } from 'lucide-react';
import { NavigateFunction } from '../types';

interface PressKitPageProps {
    onNavigate: NavigateFunction;
}

const ASSETS = [
    {
        category: 'Brand Logos',
        icon: <Image size={20} className="text-cyan-400" />,
        items: [
            { name: 'Primary Logo (SVG)', format: 'SVG', size: '12 KB' },
            { name: 'Primary Logo (PNG — white bg)', format: 'PNG', size: '340 KB' },
            { name: 'Primary Logo (PNG — dark bg)', format: 'PNG', size: '340 KB' },
            { name: 'Hexagon Icon Only', format: 'SVG + PNG', size: '8 KB' },
        ],
    },
    {
        category: 'Product Imagery',
        icon: <Film size={20} className="text-violet-400" />,
        items: [
            { name: 'HBOT Chamber — Studio Shots (10 images)', format: 'ZIP / JPG', size: '48 MB' },
            { name: 'PEMF Mat — Lifestyle Shots (8 images)', format: 'ZIP / JPG', size: '32 MB' },
            { name: 'Red Light Panel — Studio (6 images)', format: 'ZIP / JPG', size: '24 MB' },
            { name: 'Hydrogen Generator — Studio (6 images)', format: 'ZIP / JPG', size: '22 MB' },
            { name: 'Full Product Range — Composite (3 images)', format: 'ZIP / JPG', size: '18 MB' },
        ],
    },
    {
        category: 'Company Documents',
        icon: <FileText size={20} className="text-emerald-400" />,
        items: [
            { name: 'Hylono Company Overview (One-pager)', format: 'PDF', size: '1.2 MB' },
            { name: 'Technology White Paper', format: 'PDF', size: '3.4 MB' },
            { name: 'CEO & Founder Bio + Headshot', format: 'ZIP / PDF', size: '8 MB' },
            { name: 'Brand Style Guide', format: 'PDF', size: '2.1 MB' },
        ],
    },
];

const STATS = [
    { value: '2019', label: 'Founded' },
    { value: '12', label: 'Countries served' },
    { value: '3,500+', label: 'Systems deployed' },
    { value: '180+', label: 'Clinic partners' },
];

const RECENT_COVERAGE = [
    { outlet: 'Biohacking Weekly', headline: 'Hylono Brings Clinical-Grade HBOT to the Home', date: 'Jan 2026', icon: <Newspaper size={14} /> },
    { outlet: 'FT Health', headline: 'The Premium Wellness Hardware Race Heats Up', date: 'Dec 2025', icon: <Globe size={14} /> },
    { outlet: 'TechCrunch EU', headline: 'Hylono Raises €18M Series B to Expand Modality Platform', date: 'Oct 2025', icon: <ExternalLink size={14} /> },
    { outlet: 'Men\'s Health UK', headline: 'Recovery Tech: What the Pros Are Actually Using', date: 'Sep 2025', icon: <Newspaper size={14} /> },
];

export const PressKitPage: React.FC<PressKitPageProps> = ({ onNavigate }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950">
            {/* Hero */}
            <section className="pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-cyan-400 text-xs tracking-widest uppercase mb-6">
                            <Newspaper size={12} />
                            Press Kit
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold futuristic-font text-white mb-6 leading-tight">
                            Media Resources
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                            Everything you need to cover Hylono accurately and compellingly — logos, product images, company facts, and spokesperson contacts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2">
                                <Download size={16} />
                                Download Full Press Kit (ZIP)
                            </button>
                            <button
                                onClick={() => onNavigate('contact')}
                                className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2"
                            >
                                <Mail size={16} />
                                Media Enquiries
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Key Stats */}
            <section className="px-6 pb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 text-center"
                            >
                                <div className="text-3xl font-bold futuristic-font text-white mb-1">{stat.value}</div>
                                <div className="text-slate-400 text-xs uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Asset Downloads */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold futuristic-font text-white mb-8 text-center">Downloadable Assets</h2>
                    <div className="space-y-6">
                        {ASSETS.map((group, i) => (
                            <motion.div
                                key={group.category}
                                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-slate-800/60 rounded-3xl border border-slate-700/50 p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    {group.icon}
                                    <h3 className="text-white font-semibold text-base">{group.category}</h3>
                                </div>
                                <div className="divide-y divide-slate-700/50">
                                    {group.items.map((item, j) => (
                                        <div key={j} className="flex items-center justify-between py-3 group">
                                            <div>
                                                <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.format} · {item.size}</p>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                                <Download size={13} />
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Coverage */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold futuristic-font text-white mb-8 text-center">Recent Coverage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {RECENT_COVERAGE.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-500 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                                    {item.icon}
                                    <span className="uppercase tracking-widest">{item.outlet}</span>
                                    <span className="ml-auto">{item.date}</span>
                                </div>
                                <p className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors leading-snug">
                                    {item.headline}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media Contact */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 rounded-3xl p-10 text-center"
                    >
                        <Mail size={40} className="text-cyan-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold futuristic-font text-white mb-2">Media Contact</h2>
                        <p className="text-slate-400 mb-4">For press enquiries, interview requests, and exclusive briefings:</p>
                        <a
                            href="mailto:press@hylono.com"
                            className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg transition-colors"
                        >
                            press@hylono.com
                        </a>
                        <p className="text-slate-500 text-sm mt-2">We aim to respond within 24 hours on business days.</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

