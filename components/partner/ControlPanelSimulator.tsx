import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power, Gauge, Play, AlertCircle, CheckCircle } from 'lucide-react';

interface ControlPanelSimulatorProps {
    onComplete: () => void;
}

export const ControlPanelSimulator: React.FC<ControlPanelSimulatorProps> = ({ onComplete }) => {
    const [powerOn, setPowerOn] = useState(false);
    const [pressure, setPressure] = useState(1.0); // 1.0 to 2.0 ATA
    const [isPressurized, setIsPressurized] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [step, setStep] = useState(1); // 1: Power, 2: Pressure, 3: Start

    const handlePower = () => {
        setPowerOn(!powerOn);
        if (!powerOn && step === 1) {
            setStep(2);
            setFeedback("Power Online. Set Target Pressure.");
        } else if (powerOn) {
            setStep(1);
            setFeedback("System Powered Down.");
            setPressure(1.0);
        }
    };

    const handlePressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!powerOn) {
            setFeedback("Turn Power On First!");
            return;
        }
        const val = parseFloat(e.target.value);
        setPressure(val);
        if (val >= 1.5 && step === 2) {
            setStep(3);
            setFeedback("Optimal Pressure Set. Ready to Start.");
        }
    };

    const handleStart = () => {
        if (!powerOn) {
            setFeedback("Error: System Offline.");
            return;
        }
        if (pressure < 1.5) {
            setFeedback("Error: Pressure too low for therapy.");
            return;
        }
        setIsPressurized(true);
        setFeedback("Pressurization Sequence Initiated...");
        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-sm bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />

                <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded border border-cyan-500/20 uppercase">Simulator</span>
                    Manual Override Control
                </h3>

                {/* Status Display */}
                <div className="bg-black/50 rounded-lg p-4 mb-6 font-mono border border-slate-700 relative">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs text-slate-400 uppercase">System Status</span>
                        <div className={`w-2 h-2 rounded-full ${powerOn ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
                    </div>
                    <div className="text-2xl text-cyan-400 font-bold tracking-widest">
                        {pressure.toFixed(2)} ATA
                    </div>
                </div>

                <div className="space-y-6">
                    {/* 1. Power Switch */}
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${step === 1 ? 'text-white animate-pulse' : 'text-slate-500'}`}>1. Main Power</span>
                        <button
                            onClick={handlePower}
                            className={`w-16 h-8 rounded-full p-1 transition-colors relative ${powerOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform transform ${powerOn ? 'translate-x-8' : 'translate-x-0'} flex items-center justify-center`}>
                                <Power className={`w-3 h-3 ${powerOn ? 'text-emerald-600' : 'text-slate-500'}`} />
                            </div>
                        </button>
                    </div>

                    {/* 2. Pressure Dial */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className={`text-sm font-medium ${step === 2 ? 'text-white animate-pulse' : 'text-slate-500'}`}>2. Target Pressure</span>
                            <span className="text-xs text-cyan-400 font-mono">{pressure.toFixed(1)} ATA</span>
                        </div>
                        <input
                            type="range"
                            min="1.0"
                            max="2.0"
                            step="0.1"
                            value={pressure}
                            onChange={handlePressureChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                            <span>1.0</span>
                            <span>1.5</span>
                            <span>2.0</span>
                        </div>
                    </div>

                    {/* 3. Start Button */}
                    <button
                        onClick={handleStart}
                        disabled={!powerOn}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                            ${isPressurized
                                ? 'bg-emerald-500 text-white'
                                : powerOn && pressure >= 1.5
                                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {isPressurized ? (
                            <>
                                <CheckCircle className="w-5 h-5" /> Pressurizing...
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" /> Start Therapy
                            </>
                        )}
                    </button>
                </div>

                {/* Feedback Toast */}
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-xs text-center text-cyan-300 font-medium"
                    >
                        {feedback}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
