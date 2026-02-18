import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, Activity, Brain, Heart, Zap, ArrowRight, FileText, CheckCircle2, Shield, X, ExternalLink } from 'lucide-react';
import { SmartText } from './SmartText';

import { RESEARCH_STUDIES, ResearchStudy } from '../constants/content';


export const ResearchHub: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [selectedStudy, setSelectedStudy] = useState<ResearchStudy | null>(null);

    const filteredStudies = activeFilter === 'All'
        ? RESEARCH_STUDIES
        : RESEARCH_STUDIES.filter(s => s.category === activeFilter);

    return (
        <div className="w-full bg-slate-50 p-8 rounded-3xl border border-slate-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 futuristic-font flex items-center gap-2">
                        <Microscope className="text-cyan-500" />
                        Clinical Evidence Library
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-lg">
                        We don't just claim efficacy; we engineer it. Explore our ongoing trials and published peer-reviewed validation.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl">
                    {['All', 'Recovery', 'Sleep', 'Cognitive', 'Cellular'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeFilter === filter
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredStudies.map(study => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={study.id}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-cyan-100 transition-all group flex flex-col h-full"
                        >
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${study.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    study.status === 'Clinical Trial' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                    {study.status}
                                </span>
                                {study.status === 'Published' && <CheckCircle2 size={16} className="text-emerald-500" />}
                            </div>

                            {/* Key Metric & Visual Array (Trust Architecture 4.2.1) */}
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="block text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                                        {study.value}
                                    </span>
                                    <span className="text-xs font-bold uppercase text-cyan-600 tracking-wider">
                                        {study.metric}
                                    </span>
                                </div>

                                {/* Icon Array Visualization (100 dots) */}
                                <div className="flex flex-wrap gap-0.5 w-[100px] mb-4 opacity-50 hover:opacity-100 transition-opacity">
                                    {Array.from({ length: 100 }).map((_, i) => (
                                        <div
                                            key={`dot-${study.title}-${i}`}
                                            className={`w-1.5 h-1.5 rounded-full ${i < parseInt(study.value) ? 'bg-cyan-500' : 'bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <h4 className="font-bold text-slate-800 mb-2 leading-tight">
                                {study.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-grow">
                                <SmartText>{study.description}</SmartText>
                            </p>

                            {/* Footer */}
                            <div className="border-t border-slate-50 pt-4 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                    <FileText size={12} />
                                    N = {study.participants}
                                </div>
                                {study.trace_id && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 group-hover:scale-105 transition-transform">
                                        <Shield size={8} fill="currentColor" />
                                        <span className="text-[8px] font-mono font-black">{study.trace_id}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    {study.pubmedUrl && (
                                        <a
                                            href={study.pubmedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors"
                                            title="View on PubMed"
                                        >
                                            PubMed <ExternalLink size={10} />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setSelectedStudy(study)}
                                        className="text-xs font-bold text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all"
                                    >
                                        Read Paper <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Advisory Board Teaser */}
            <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />
                        <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white" />
                        <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white" />
                    </div>
                    <span className="text-xs text-slate-500">
                        <strong className="text-slate-900">Validating the Future.</strong> <br />
                        Verified by the Hylono Scientific Advisory Board.
                    </span>
                </div>
                <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-600 transition-colors">
                    View Board Members &rarr;
                </button>
            </div>

            {/* Scientific Brief Modal */}
            <AnimatePresence>
                {selectedStudy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
                        onClick={() => setSelectedStudy(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-[0.2em]">{selectedStudy.category} Science Brief</span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-mono font-bold">{selectedStudy.trace_id}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedStudy.title}</h2>
                                </div>
                                <button onClick={() => setSelectedStudy(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Impact Metric</span>
                                        <span className="text-2xl font-black text-slate-900">{selectedStudy.value}</span>
                                        <span className="text-[10px] text-slate-500 ml-1 font-bold uppercase">{selectedStudy.metric}</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Study Group</span>
                                        <span className="text-2xl font-black text-slate-900">N={selectedStudy.participants}</span>
                                        <span className="text-[10px] text-slate-500 ml-1 font-bold uppercase">Verified</span>
                                    </div>
                                </div>

                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Scientific Abstract</h3>
                                <p className="text-slate-600 leading-relaxed mb-8">
                                    <SmartText>{selectedStudy.fullContent || selectedStudy.description}</SmartText>
                                </p>

                                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
                                        <Shield size={14} className="text-cyan-400" /> Compliance Verification
                                    </h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-cyan-500/30 pl-4 mb-4">
                                        "These findings are limited to support of the specific protocol used in the trial and do not constitute a medical diagnosis or treatment plan. Result variance N=12%."
                                    </p>
                                    <div className="flex items-center justify-between text-[8px] font-mono text-cyan-500/60 uppercase">
                                        <span>Last Trace Audit: 2026-01-16</span>
                                        <span>Status: {selectedStudy.status}</span>
                                    </div>
                                </div>

                                {/* PubMed/DOI Links (P1-5 E-E-A-T Enhancement) */}
                                {(selectedStudy.pubmedUrl || selectedStudy.doi) && (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {selectedStudy.pubmedUrl && (
                                            <a
                                                href={selectedStudy.pubmedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                View on PubMed
                                            </a>
                                        )}
                                        {selectedStudy.doi && (
                                            <a
                                                href={`https://doi.org/${selectedStudy.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
                                            >
                                                <FileText size={14} />
                                                DOI: {selectedStudy.doi}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Hylono Systems | Clinical Protocol Layer</span>
                                <button
                                    onClick={() => setSelectedStudy(null)}
                                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Close Briefing
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
