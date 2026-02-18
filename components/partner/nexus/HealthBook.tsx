import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Activity,
    Heart,
    Zap,
    Brain,
    AlertTriangle,
    Plus,
    X,
    Thermometer,
    Stethoscope,
    FileText,
    Pill,
    AlertCircle,
    Mic
} from 'lucide-react';
import { BodyMap } from './BodyMap';
import { VoiceCommand } from './VoiceCommand';

interface Biometrics {
    hrv: string;
    spo2: string;
    bpSys: string;
    bpDia: string;
    rhr: string;
}

interface HealthBookData {
    biometrics: Biometrics;
    conditions: string[];
    contraindications: string[];
    pain: number;
}

interface VoiceAnalysis {
    type: 'condition' | 'biometric' | 'protocol';
    value: string;
    zone?: string;
}

interface HealthBookProps {
    onChange: (data: HealthBookData) => void;
}

// Medical Systems Review - moved outside component to prevent recreation
const SYSTEMS = {
    neuro: { label: 'Neurological', options: ['Insomnia', 'Brain Fog', 'Anxiety', 'Migraine', 'TBI History'] },
    musculo: { label: 'Musculoskeletal', options: ['Chronic Pain', 'Arthritis', 'Acute Injury', 'Tendonitis'] },
    immune: { label: 'Immune/Autoimmune', options: ['Inflammation', 'Lyme', 'Long COVID', 'Psoriasis'] },
    cardio: { label: 'Cardiovascular', options: ['Hypertension', 'Poor Circulation', 'Athlete'] }
} as const;

const CONTRAINDICATIONS = [
    { id: 'pacemaker', label: 'Pacemaker', risk: 'PEMF (Absolute)', severity: 'high' },
    { id: 'epilepsy', label: 'Epilepsy / Seizure', risk: 'Strobe Light', severity: 'high' },
    { id: 'pregnancy', label: 'Pregnancy', risk: 'General Precaution', severity: 'medium' },
    { id: 'pneumothorax', label: 'Untreated Pneumothorax', risk: 'HBOT (Absolute)', severity: 'high' },
    { id: 'copd', label: 'Severe COPD', risk: 'O2 Toxicity', severity: 'medium' }
] as const;

// Provider types for sync status
type SyncStatus = 'idle' | 'syncing' | 'connected';
type ProviderType = 'Oura' | 'Whoop' | 'Apple';

export const HealthBook: React.FC<HealthBookProps> = ({ onChange }) => {
    const [biometrics, setBiometrics] = useState<Biometrics>({
        hrv: '',
        spo2: '',
        bpSys: '',
        bpDia: '',
        rhr: ''
    });

    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedContras, setSelectedContras] = useState<string[]>([]);
    const [painLevel, setPainLevel] = useState(0);
    
    // Track sync status for each provider using React state instead of DOM manipulation
    const [syncStatus, setSyncStatus] = useState<Record<ProviderType, SyncStatus>>({
        'Oura': 'idle',
        'Whoop': 'idle',
        'Apple': 'idle'
    });
    
    // Store timeout refs for cleanup
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(id => clearTimeout(id));
        };
    }, []);

    const updateBiometric = useCallback((field: string, value: string) => {
        setBiometrics(prev => {
            const newBio = { ...prev, [field]: value };
            onChange({ biometrics: newBio, conditions: selectedConditions, contraindications: selectedContras, pain: painLevel });
            return newBio;
        });
    }, [selectedConditions, selectedContras, painLevel, onChange]);

    const toggleCondition = useCallback((id: string, forceState?: boolean) => {
        setSelectedConditions(prev => {
            let newSelection = [...prev];

            if (forceState === true) {
                if (!newSelection.includes(id)) newSelection.push(id);
            } else if (forceState === false) {
                newSelection = newSelection.filter(c => c !== id);
            } else {
                // Toggle
                if (newSelection.includes(id)) {
                    newSelection = newSelection.filter(c => c !== id);
                } else {
                    newSelection.push(id);
                }
            }

            onChange({ biometrics, conditions: newSelection, contraindications: selectedContras, pain: painLevel });
            return newSelection;
        });
    }, [biometrics, selectedContras, painLevel, onChange]);

    const toggleContra = useCallback((id: string) => {
        setSelectedContras(prev => {
            const newSelection = prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id];
            onChange({ biometrics, conditions: selectedConditions, contraindications: newSelection, pain: painLevel });
            return newSelection;
        });
    }, [biometrics, selectedConditions, painLevel, onChange]);

    // Handle wearable sync with React state instead of DOM manipulation
    const handleSync = useCallback((provider: ProviderType) => {
        // Set syncing status
        setSyncStatus(prev => ({ ...prev, [provider]: 'syncing' }));

        // Mock sync timeout
        const timeoutId = setTimeout(() => {
            setSyncStatus(prev => ({ ...prev, [provider]: 'connected' }));
            
            // Mock Data Injection
            updateBiometric('hrv', (45 + Math.floor(Math.random() * 20)).toString());
            updateBiometric('rhr', (50 + Math.floor(Math.random() * 10)).toString());
            updateBiometric('spo2', '98');
            updateBiometric('bpSys', '118');
            updateBiometric('bpDia', '76');
        }, 1200);
        
        timeoutRefs.current.push(timeoutId);
    }, [updateBiometric]);

    // Get button label based on sync status
    const getSyncLabel = useCallback((provider: ProviderType) => {
        switch (syncStatus[provider]) {
            case 'syncing': return 'Syncing...';
            case 'connected': return 'Connected';
            default: return provider;
        }
    }, [syncStatus]);

    // --- INNOVATION LOGIC ---

    const handleBodyMapClick = useCallback((zone: string) => {
        // Smart Mapping of Zones to Conditions
        if (zone === 'head') {
            toggleCondition('Migraine'); // Auto-toggle Migraine as a quick action
        }
        if (zone === 'chest') toggleCondition('Anxiety');
        if (zone === 'legs' || zone === 'arms') toggleCondition('Arthritis');
        if (zone === 'gut') toggleCondition('Inflammation');
    }, [toggleCondition]);

    const handleVoiceCommand = useCallback((text: string, analysis: VoiceAnalysis) => {
        if (analysis.type === 'condition') {
            toggleCondition(analysis.value, true); // Force Add
        }
        // Could expand to parse numbers for biometrics
    }, [toggleCondition]);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col font-mono text-sm relative">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded text-indigo-700">
                        <FileText className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 uppercase tracking-tight">Clinical Intake</h3>
                        <p className="text-[10px] text-slate-500 font-medium">PHYSIOLOGICAL DATA MATRIX</p>
                    </div>
                </div>
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400">
                    REF-2026-X
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-20">

                {/* 0. BODY MAP (NEW) */}
                <section className="h-64 mb-4">
                    <BodyMap onZoneClick={handleBodyMapClick} activeZones={[]} />
                    {/* For a real app, map conditions back to zones for highlighting */}
                </section>

                {/* 1. BIO-SYNC (NEW) */}
                <section className="bg-slate-900 rounded-lg p-4 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-24 h-24 text-cyan-400" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 relative z-10 gap-3">
                        <div>
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> Bio-Sync™ Live Data
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Connect wearable for real-time physiological baseline</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {(['Oura', 'Whoop', 'Apple'] as const).map(provider => (
                                <button
                                    key={provider}
                                    onClick={() => handleSync(provider)}
                                    disabled={syncStatus[provider] === 'syncing'}
                                    className={`px-3 py-1.5 rounded border text-[10px] font-bold transition-all min-w-[80px] ${
                                        syncStatus[provider] === 'connected' 
                                            ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400' 
                                            : syncStatus[provider] === 'syncing'
                                            ? 'bg-slate-800 border-slate-600 text-slate-400 cursor-wait'
                                            : 'bg-slate-800 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'
                                    }`}
                                >
                                    {getSyncLabel(provider)}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. BIOMETRICS GRID */}
                <section>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Activity className="w-3.5 h-3.5 text-cyan-500" /> Biometrics (Current)
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">HRV (ms)</label>
                            <input
                                type="text"
                                placeholder="--"
                                value={biometrics.hrv}
                                onChange={(e) => updateBiometric('hrv', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-center font-bold text-slate-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">SpO2 (%)</label>
                            <input
                                type="text"
                                placeholder="--"
                                value={biometrics.spo2}
                                onChange={(e) => updateBiometric('spo2', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-center font-bold text-slate-900 focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">RHR (bpm)</label>
                            <input
                                type="text"
                                placeholder="--"
                                value={biometrics.rhr}
                                onChange={(e) => updateBiometric('rhr', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-center font-bold text-slate-900 focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">BP (sys/dia)</label>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    placeholder="120"
                                    value={biometrics.bpSys}
                                    onChange={(e) => updateBiometric('bpSys', e.target.value)}
                                    className="w-1/2 bg-slate-50 border border-slate-200 rounded p-2 text-center font-bold text-slate-900 focus:border-cyan-500 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="80"
                                    value={biometrics.bpDia}
                                    onChange={(e) => updateBiometric('bpDia', e.target.value)}
                                    className="w-1/2 bg-slate-50 border border-slate-200 rounded p-2 text-center font-bold text-slate-900 focus:border-cyan-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. SYMPTOM QUANTIFICATION */}
                <section>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Subjective Pain / Distress (VAS)
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex justify-between mb-2 text-xs font-bold text-slate-500">
                            <span>No Pain (0)</span>
                            <span className="text-rose-600 font-bold text-lg">{painLevel}</span>
                            <span>Severe (10)</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={painLevel}
                            onChange={(e) => {
                                setPainLevel(parseInt(e.target.value));
                                onChange({ biometrics, conditions: selectedConditions, contraindications: selectedContras, pain: parseInt(e.target.value) });
                            }}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                    </div>
                </section>

                {/* 3. SYSTEMS REVIEW */}
                <section>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Stethoscope className="w-3.5 h-3.5 text-indigo-500" /> Systems Review
                    </h4>
                    <div className="space-y-4">
                        {Object.entries(SYSTEMS).map(([key, system]) => (
                            <div key={key}>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 pl-1">{system.label}</div>
                                <div className="flex flex-wrap gap-2">
                                    {system.options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => toggleCondition(option)}
                                            className={`px-2 py-1.5 rounded border text-xs font-medium transition-all ${selectedConditions.includes(option)
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. MEDICATION & SAFETY */}
                <section>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Safety & Contraindications
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {CONTRAINDICATIONS.map((contra) => (
                            <button
                                key={contra.id}
                                onClick={() => toggleContra(contra.id)}
                                className={`flex items-center justify-between p-3 rounded border text-left transition-all ${selectedContras.includes(contra.id)
                                    ? 'bg-red-50 border-red-500 text-red-700'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div>
                                    <div className="font-bold text-xs">{contra.label}</div>
                                    <div className="text-[10px] opacity-80">Risk: {contra.risk}</div>
                                </div>
                                {selectedContras.includes(contra.id) && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* FLOATING VOICE BUTTON */}
            <div className="absolute bottom-6 right-6">
                <VoiceCommand onCommand={handleVoiceCommand} />
            </div>

        </div>
    );
};
