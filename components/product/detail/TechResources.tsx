import React from 'react';
import { FileText, Brain, Download } from 'lucide-react';
import { TechData } from '../../types';

interface TechResourcesProps {
    data: TechData;
}

export const TechResources: React.FC<TechResourcesProps> = ({ data }) => {
    return (
        <section id="resources" className="py-24 bg-slate-900 text-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-6">Deep Intelligence</h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Access full technical documentation and peer-reviewed research for the {data.name} system.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all group">
                                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Professional PDF Kit
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 w-full md:w-auto">
                        <button className="flex items-center gap-4 p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:border-cyan-500/50 hover:shadow-2xl transition-all text-left group">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                                <FileText size={24} />
                            </div>
                            <div>
                                <span className="text-white font-bold block mb-0.5">Clinical Manual v2.1</span>
                                <span className="text-slate-500 text-xs font-mono">PDF • 4.2 MB • Updated Jan 2026</span>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:border-purple-500/50 hover:shadow-2xl transition-all text-left group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                                <Brain size={24} />
                            </div>
                            <div>
                                <span className="text-white font-bold block mb-0.5">Scientific Excerpts</span>
                                <span className="text-slate-500 text-xs font-mono">14 Citations • {data.name}_RESEARCH_PK</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
