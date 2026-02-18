import React, { useState, useEffect } from 'react';
import { Server, Database, Zap, Share2, Activity, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CACHE_DATA = [
    { time: '00s', latency: 1200, cached: 0 },
    { time: '05s', latency: 800, cached: 20 },
    { time: '10s', latency: 450, cached: 45 },
    { time: '15s', latency: 120, cached: 82 },
    { time: '20s', latency: 45, cached: 94 },
    { time: '25s', latency: 42, cached: 96 },
];

export const AgentPerformance: React.FC = () => {
    const [hitRatio, setHitRatio] = useState(82);

    useEffect(() => {
        const interval = setInterval(() => {
            setHitRatio(prev => Math.min(99, Math.max(75, prev + (Math.random() - 0.4))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* System Topology */}
            <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <Share2 size={12} className="text-purple-500" /> Multi-Agent Swarm
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-slate-300">Diagnostician Agent</span>
                        </div>
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1 rounded">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs text-slate-300">Inventory Agent (SWR)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">IDLE</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-xs text-slate-300">Safety Validator</span>
                        </div>
                        <span className="text-[10px] text-purple-500 bg-purple-500/10 px-1 rounded">PROCESSING</span>
                    </div>
                </div>
            </div>

            {/* Semantic Cache Visualization */}
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Zap size={12} className="text-amber-500" /> Semantic Cache Performance
                    </h4>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-500">Hit Ratio</span>
                            <span className="text-lg font-mono font-bold text-emerald-400">{hitRatio.toFixed(1)}%</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-500">Latency</span>
                            <span className="text-lg font-mono font-bold text-cyan-400">42ms</span>
                        </div>
                    </div>
                </div>

                <div className="h-32 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CACHE_DATA}>
                            <defs>
                                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                            <Area type="monotone" dataKey="latency" stroke="#f59e0b" fill="url(#latencyGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-2">
                    <span className="flex items-center gap-1"><Database size={10} /> Redis Stack (Vector)</span>
                    <span className="flex items-center gap-1"><Server size={10} /> Stale-While-Revalidate</span>
                    <span className="flex items-center gap-1"><Cpu size={10} /> CrewAI Orchestrator</span>
                </div>
            </div>
        </div>
    );
};
