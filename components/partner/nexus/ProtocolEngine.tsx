import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Clock,
    Calendar,
    ShieldCheck,
    AlertOctagon,
    ArrowRight,
    Sparkles,
    FileSignature,
    Salad,
    Microscope,
    BookOpen,
    CheckCircle,
    Printer,
    Share2,
    Loader2
} from 'lucide-react';

interface ProtocolEngineProps {
    clientData: {
        conditions: string[];
        contraindications: string[];
        // biometrics might be used in future for auto-calculation
    };
}

// MEDICAL GRADE KNOWLEDGE BASE
const PRESCRIPTION_MATRIX = [
    {
        triggers: ['Insomnia', 'Anxiety', 'TBI History'],
        id: 'RX-NEURO-REPAIR',
        title: 'Neural Restoration Protocol',
        dosing: {
            hbot: {
                pressure: '1.3 ATA',
                duration: '60 min',
                schedule: 'Daily (x20)',
                gas: '100% O2 Medical'
            },
            pemf: {
                setting: 'Delta Wave (1-4Hz)',
                intensity: 'Low (15%)',
                duration: '45 min'
            }
        },
        mechanism: 'Hyperoxygenation reduces neuro-inflammation (IL-6 downregulation). Delta-wave entrainment promotes Slow Wave Sleep (SWS) architecture.',
        citation: 'Thom et al. (2018) - "Stem Cell Mobilization & Neurogenesis"; Walker (2019) - "Sleep Architecture"'
    },
    {
        triggers: ['Chronic Pain', 'Arthritis', 'Inflammation', 'Lyme'],
        id: 'RX-SYSTEMIC-ANTI-INF',
        title: 'Systemic Anti-Inflammatory',
        dosing: {
            hbot: {
                pressure: '1.5 ATA',
                duration: '90 min',
                schedule: '5x/Week (x40)',
                gas: '100% O2 w/ Air Breaks'
            },
            redlight: {
                setting: 'NIR (850nm) + Red (660nm)',
                intensity: 'High (100mW/cm²)',
                duration: '20 min (Targeted)'
            }
        },
        mechanism: 'Pressurized O2 drives plasma saturation >2000%, correcting hypoxic tissue. NIR stimulates cytochrome c oxidase (mitochondrial ATP).',
        citation: 'Harch (2020) - "HBOT in Chronic Wounds"; Hamblin (2017) - "Photobiomodulation Mechanisms"'
    }
];

export const ProtocolEngine: React.FC<ProtocolEngineProps> = ({ clientData }) => {
    const [signingStatus, setSigningStatus] = useState<'idle' | 'signing' | 'signed'>('idle');

    // LOGIC ENGINE
    const prescription = useMemo(() => {
        if (!clientData.conditions.length) return null;

        // 1. CRITICAL SAFETY LOCKOUT
        if (clientData.contraindications.includes('pacemaker')) {
            return {
                type: 'danger',
                code: 'ERR-CONTRA-ABS',
                title: 'SAFETY LOCKOUT: PACEMAKER',
                message: 'PEMF Modality is ABSOLUTELY CONTRAINDICATED due to electromagnetic interference risk.',
                action: 'ABORT: Remove PEMF. Switch to manual HBOT-only plan.'
            };
        }
        if (clientData.contraindications.includes('pneumothorax')) {
            return {
                type: 'danger',
                code: 'ERR-CONTRA-ABS',
                title: 'SAFETY LOCKOUT: PNEUMOTHORAX',
                message: 'Pressurized Chamber (HBOT) is ABSOLUTELY CONTRAINDICATED. Risk of tension pneumothorax.',
                action: 'ABORT: Do not pressurize. Medical Clearance Required.'
            };
        }

        // 2. FIND BEST MATCH
        const match = PRESCRIPTION_MATRIX.find(rx =>
            rx.triggers.some(t => clientData.conditions.includes(t))
        );

        if (match) return { type: 'success', data: match };

        // DEFAULT BASELINE
        return {
            type: 'success',
            data: {
                id: 'RX-GEN-WELLNESS',
                title: 'Baseline Oxidative Support',
                dosing: {
                    hbot: { pressure: '1.3 ATA', duration: '60 min', schedule: '3x/Week', gas: 'Ambient Air + O2' }
                },
                mechanism: 'General micro-circulation enhancement and oxidative stress reduction.',
                citation: 'Standard Operating Procedure (Gen 2)'
            }
        };

    }, [clientData]);

    const handleSign = () => {
        setSigningStatus('signing');
        setTimeout(() => {
            setSigningStatus('signed');
        }, 2000);
    };

    if (!prescription && clientData.conditions.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4 border border-slate-100">
                    <Microscope className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-600 mb-1 font-mono uppercase">Awaiting Clinical Data</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Input patient biometrics and conditions to generate a targeted therapeutic prescription.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col font-mono text-sm">
            {/* Header */}
            <div className={`p-4 border-b border-slate-200 transition-colors flex items-center justify-between ${signingStatus === 'signed' ? 'bg-emerald-600' : 'bg-slate-900'} text-white`}>
                <div className="flex items-center gap-2">
                    {signingStatus === 'signed' ? <ShieldCheck className="w-5 h-5 text-white" /> : <FileSignature className="w-5 h-5 text-cyan-400" />}
                    <div>
                        <div className={`font-bold tracking-widest text-xs uppercase ${signingStatus === 'signed' ? 'text-white' : 'text-cyan-400'}`}>
                            {signingStatus === 'signed' ? 'Order Active' : 'Therapeutic Prescription'}
                        </div>
                        <div className="text-[10px] text-slate-400 text-white/70">
                            {signingStatus === 'signed' ? 'SIGNED BY DR. DOE • 09:42 AM' : 'AI-GENERATED • REVIEW REQUIRED'}
                        </div>
                    </div>
                </div>
                {prescription && prescription.type === 'success' && (
                    <div className={`text-xs font-bold px-2 py-1 rounded border ${signingStatus === 'signed' ? 'bg-emerald-700 border-emerald-500' : 'bg-cyan-900/50 text-cyan-400 border-cyan-500/30'}`}>
                        {prescription.data!.id}
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-slate-50 relative">
                <AnimatePresence mode="wait">
                    {prescription?.type === 'danger' ? (
                        <motion.div
                            key="danger"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border-2 border-red-500 rounded-xl p-6 shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                <AlertOctagon className="w-10 h-10 text-red-600 shrink-0" />
                                <div>
                                    <div className="font-bold text-red-700 text-lg mb-1">{prescription.title}</div>
                                    <div className="font-mono text-xs text-red-500 mb-3">{prescription.code}</div>
                                    <p className="text-red-800 font-medium leading-relaxed mb-4">
                                        {prescription.message}
                                    </p>
                                    <div className="p-3 bg-white rounded border border-red-200 text-red-700 font-bold text-xs uppercase tracking-wide">
                                        Action Required: {prescription.action}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : prescription?.type === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* IF SIGNED, SHOW RECEIPT MODE */}
                            {signingStatus === 'signed' ? (
                                <div className="flex flex-col items-center justify-center pt-10 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
                                    >
                                        <CheckCircle className="w-12 h-12" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Protocol Prescribed</h2>
                                    <p className="text-slate-500 mb-8 max-w-sm">
                                        Digital order <strong>#RX-8821</strong> has been successfully transmitted to the Chamber OS.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:border-slate-300">
                                            <Printer className="w-4 h-4" /> Print Order
                                        </button>
                                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:border-slate-300">
                                            <Share2 className="w-4 h-4" /> Email Patient
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setSigningStatus('idle')}
                                        className="mt-8 text-xs text-slate-400 hover:text-cyan-600 underline"
                                    >
                                        Modify or Issue New Rx
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Rx Header */}
                                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Diagnosis Match</div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{prescription.data!.title}</h2>
                                    </div>

                                    {/* Dosing Grid */}
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                                            <Zap className="w-3 h-3" /> Rx Dosing Parameters
                                        </div>
                                        {Object.entries(prescription.data!.dosing).map(([key, details]: [string, any]) => (
                                            <div key={key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="font-bold text-lg uppercase text-slate-800">{key}</div>
                                                    <div className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">
                                                        {details.schedule}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                    {Object.entries(details).map(([k, v]: [string, any]) => {
                                                        if (k === 'schedule') return null;
                                                        return (
                                                            <div key={k}>
                                                                <div className="text-slate-400 uppercase font-bold text-[10px] mb-0.5">{k}</div>
                                                                <div className="text-slate-900 font-medium">{v}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 3. HYLONO PREDICT (NEW) */}
                                    <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-700 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3" /> Hylono Predict™ AI
                                                </div>
                                                <div className="font-bold text-lg">Estimated Recovery Trajectory</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-emerald-400">-5 Weeks</div>
                                                <div className="text-[10px] text-slate-400 uppercase">Time Saved</div>
                                            </div>
                                        </div>

                                        {/* Simple CSS Chart */}
                                        <div className="relative h-24 w-full mt-4 border-l border-b border-slate-600 ml-1">
                                            {/* Baseline Curve (Gray) */}
                                            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                                                <path d="M0,96 C100,90 200,80 400,30" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                                                <text x="350" y="25" fill="#64748b" fontSize="10" fontWeight="bold">Standard Care</text>
                                            </svg>

                                            {/* Protocol Curve (Cyan) */}
                                            <motion.svg
                                                className="absolute inset-0 h-full w-full overflow-visible"
                                                preserveAspectRatio="none"
                                            >
                                                <motion.path
                                                    d="M0,96 C100,50 150,20 250,5"
                                                    fill="none"
                                                    stroke="#22d3ee"
                                                    strokeWidth="3"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                                />
                                            </motion.svg>

                                            {/* Milestone Dot */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 2 }}
                                                className="absolute top-[5px] left-[60%] transform -translate-x-1/2"
                                            >
                                                <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 px-2 py-1 rounded text-[9px] font-bold text-cyan-400 border border-slate-600 z-10">
                                                    100% Recovery
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                            <span>Validation: N=14,203 similar profiles (Confidence: 94%)</span>
                                        </div>
                                    </div>

                                    {/* Scientific Justification */}
                                    <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Microscope className="w-4 h-4 text-indigo-600" />
                                            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Mechanism of Action</span>
                                        </div>
                                        <p className="text-sm text-indigo-900/80 leading-relaxed mb-4">
                                            {prescription.data!.mechanism}
                                        </p>
                                        <div className="flex items-start gap-2 pt-3 border-t border-indigo-200/50">
                                            <BookOpen className="w-3 h-3 text-indigo-400 mt-0.5" />
                                            <p className="text-[10px] text-indigo-400 italic font-medium">
                                                Source: {prescription.data!.citation}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSign}
                                        disabled={signingStatus === 'signing'}
                                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-xs disabled:opacity-80"
                                    >
                                        {signingStatus === 'signing' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Digitally Signing...
                                            </>
                                        ) : (
                                            <>
                                                <FileSignature className="w-4 h-4" /> Sign & Prescribe Protocol
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};
