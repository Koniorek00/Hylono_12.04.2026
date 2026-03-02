import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, CheckCircle, FileText, ShieldCheck, Upload, AlertCircle } from 'lucide-react';

interface DeviceData {
    id: string;
    name: string;
    model: string;
    serial: string;
    warrantyStatus: 'active' | 'expired' | 'pending';
    warrantyDate: string;
    manualUrl: string;
}

const MOCK_DEVICES: DeviceData[] = [
    {
        id: 'hbt-2025-001',
        name: 'Hylono Oxygen Pod Pro',
        model: 'HBOT-X1',
        serial: 'SN-8829-4421',
        warrantyStatus: 'active',
        warrantyDate: '2028-11-15',
        manualUrl: '#'
    },
    {
        id: 'pemf-2025-055',
        name: 'Hylono Pulsed Field Mat',
        model: 'PEMF-CORE',
        serial: 'SN-1102-9938',
        warrantyStatus: 'expired',
        warrantyDate: '2025-01-10',
        manualUrl: '#'
    }
];

const DEFAULT_DEVICE: DeviceData = MOCK_DEVICES[0] ?? {
    id: 'fallback-device',
    name: 'Hylono Device',
    model: 'UNKNOWN',
    serial: 'N/A',
    warrantyStatus: 'pending',
    warrantyDate: 'N/A',
    manualUrl: '#',
};

export const DeviceScanner: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [foundDevice, setFoundDevice] = useState<DeviceData | null>(null);
    const [manualInput, setManualInput] = useState('');
    const [error, setError] = useState('');

    const handleScan = () => {
        setIsScanning(true);
        setFoundDevice(null);
        setScanProgress(0);
        setError('');

        // Simulate scanning process
        const duration = 2000;
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setScanProgress((currentStep / steps) * 100);

            if (currentStep >= steps) {
                clearInterval(timer);
                setIsScanning(false);
                // Randomly pick a mock device for demo purposes
                const randomDevice = MOCK_DEVICES[Math.floor(Math.random() * MOCK_DEVICES.length)] ?? DEFAULT_DEVICE;
                setFoundDevice(randomDevice);
            }
        }, interval);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFoundDevice(null);
        setError('');

        // Simple mock check
        if (manualInput.length > 5) {
            const randomDevice = DEFAULT_DEVICE;
            setFoundDevice(randomDevice);
        } else {
            setError('Invalid serial number format');
        }
    };

    const getWarrantyColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'expired': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-16">
            <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                {/* Header Gradient */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Scan size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Device Identity</h2>
                            </div>
                            <p className="text-slate-500 max-w-lg">
                                Instantly load your device specific manual, warranty status, and maintenance schedule by scanning its unique QR code.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left: Scanner Interaction */}
                        <div className="relative min-h-[300px] flex flex-col">
                            <AnimatePresence mode='wait'>
                                {!isScanning && !foundDevice ? (
                                    <motion.div
                                        key="initial"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 text-slate-400">
                                            <Scan size={32} />
                                        </div>
                                        <button
                                            onClick={handleScan}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center gap-2"
                                        >
                                            <Scan size={18} />
                                            Scan QR Code
                                        </button>
                                        <p className="mt-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
                                            or enter serial manually
                                        </p>
                                    </motion.div>
                                ) : isScanning ? (
                                    <motion.div
                                        key="scanning"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 rounded-2xl bg-black relative overflow-hidden flex items-center justify-center"
                                    >
                                        {/* Mock Camera UI */}
                                        <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none z-10">
                                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-lg" />
                                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-lg" />
                                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-lg" />
                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-lg" />
                                        </div>

                                        {/* Scanning Beam */}
                                        <motion.div
                                            animate={{ top: ['10%', '90%', '10%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-4 right-4 h-0.5 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20"
                                        />

                                        <div className="absolute bottom-8 left-0 w-full text-center text-white/80 font-mono text-sm">
                                            SEARCHING... {Math.round(scanProgress)}%
                                        </div>

                                        {/* Background Abstract */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                                    </motion.div>
                                ) : foundDevice && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex-1 flex flex-col items-center justify-center p-8 bg-emerald-50/50 border border-emerald-100 rounded-2xl"
                                    >
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">Device Identified</h3>
                                        <p className="text-slate-500 text-sm mb-6">{foundDevice.name}</p>
                                        <button
                                            onClick={() => { setFoundDevice(null); setIsScanning(false); }}
                                            className="text-xs text-slate-400 font-bold uppercase tracking-wider hover:text-slate-600"
                                        >
                                            Scan Another
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right: Manual Input or Results */}
                        <div className="flex flex-col justify-center">
                            <AnimatePresence mode='wait'>
                                {foundDevice ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Model & Serial</p>
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-slate-900 font-mono font-bold">{foundDevice.model}</p>
                                                <p className="text-slate-500 font-mono text-xs">{foundDevice.serial}</p>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-xl border flex items-center gap-4 ${getWarrantyColor(foundDevice.warrantyStatus)}`}>
                                            <ShieldCheck size={24} />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Warranty Status</p>
                                                <p className="font-bold capitalize">{foundDevice.warrantyStatus} <span className="text-xs opacity-60 font-normal">until {foundDevice.warrantyDate}</span></p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-all font-bold text-slate-600 text-sm">
                                                <FileText size={18} />
                                                Manual
                                            </button>
                                            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-all font-bold text-slate-600 text-sm">
                                                <Upload size={18} />
                                                Drivers
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="manual-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col justify-center"
                                    >
                                        <form onSubmit={handleManualSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                    Manual Lookup
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Serial Number (e.g., SN-8829-4421)"
                                                    value={manualInput}
                                                    onChange={(e) => setManualInput(e.target.value)}
                                                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                            {error && (
                                                <div className="flex items-center gap-2 text-rose-500 text-sm">
                                                    <AlertCircle size={16} />
                                                    {error}
                                                </div>
                                            )}
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={!manualInput}
                                                    className="w-full  py-3 bg-slate-100 text-slate-400 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 hover:text-white transition-all"
                                                >
                                                    Fetch Data
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
