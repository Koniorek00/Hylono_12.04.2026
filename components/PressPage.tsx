import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Image, Mail, ExternalLink, Calendar } from 'lucide-react';

export const PressPage: React.FC = () => {
    const pressReleases = [
        { date: 'Jan 2026', title: 'Hylono Launches Next-Gen HBOT Chamber Series', link: '#' },
        { date: 'Dec 2025', title: 'Partnership with EU Wellness Federation Announced', link: '#' },
        { date: 'Nov 2025', title: 'Hylono Expansion into DACH Market', link: '#' },
    ];

    const mediaAssets = [
        { name: 'Logo Pack (SVG, PNG)', size: '2.4 MB' },
        { name: 'Product Photography', size: '45 MB' },
        { name: 'Brand Guidelines', size: '8 MB' },
        { name: 'Founder Headshots', size: '12 MB' },
    ];

    const factSheet = [
        { label: 'Founded', value: '2023' },
        { label: 'Headquarters', value: 'Warsaw, Poland' },
        { label: 'Markets', value: 'EU, UK, MENA' },
        { label: 'Products', value: 'HBOT, PEMF, RLT, Hydrogen' },
        { label: 'Employees', value: '25+' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <FileText className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Press & Media</h1>
                    <p className="text-lg text-slate-600">Resources for journalists and media professionals</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Company Facts */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Company Facts</h2>
                        <div className="space-y-4">
                            {factSheet.map((fact) => (
                                <div key={fact.label} className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">{fact.label}</span>
                                    <span className="font-medium text-slate-900">{fact.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Assets */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Image size={20} /> Media Assets
                        </h2>
                        <div className="space-y-3">
                            {mediaAssets.map((asset) => (
                                <button
                                    key={asset.name}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Download size={18} className="text-cyan-500" />
                                        <span className="font-medium text-slate-900">{asset.name}</span>
                                    </div>
                                    <span className="text-sm text-slate-400">{asset.size}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Press Releases */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calendar size={20} /> Press Releases
                    </h2>
                    <div className="space-y-4">
                        {pressReleases.map((pr) => (
                            <a
                                key={pr.title}
                                href={pr.link}
                                className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-cyan-500 transition-colors group"
                            >
                                <div>
                                    <span className="text-xs text-slate-400">{pr.date}</span>
                                    <h3 className="font-medium text-slate-900 group-hover:text-cyan-600">{pr.title}</h3>
                                </div>
                                <ExternalLink size={18} className="text-slate-400 group-hover:text-cyan-500" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Media Contact */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
                    <Mail className="mx-auto text-cyan-400 mb-4" size={40} />
                    <h2 className="text-2xl font-bold mb-2">Media Inquiries</h2>
                    <p className="text-slate-300 mb-6">For interviews, quotes, or additional information</p>
                    <a
                        href="mailto:press@hylono.com"
                        className="inline-block px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                    >
                        press@hylono.com
                    </a>
                </div>
            </div>
        </div>
    );
};
