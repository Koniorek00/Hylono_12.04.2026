import React, { useState } from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    Activity,
    Wrench,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    Clock,
    MoreHorizontal,
    Plus,
    FileText,
    Calendar,
    X,
    Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock Data
interface ServiceLog {
    id: string;
    date: string;
    type: 'routine' | 'repair' | 'issue';
    description: string;
    technician: string;
}

interface Device {
    id: string;
    model: string;
    type: 'HBOT' | 'PEMF' | 'RLT';
    serial: string;
    status: 'active' | 'maintenance' | 'offline';
    health: number;
    warrantyDate: string;
    nextService: string;
    logs: ServiceLog[];
    image: string; // Placeholder color/gradient for now
}

const getTodayDate = (): string => new Date().toISOString().split('T')[0] ?? '';

const INITIAL_DEVICES: Device[] = [
    {
        id: 'd1',
        model: 'Pinnacle 360 Hard Shell',
        type: 'HBOT',
        serial: 'SN-8821-HB',
        status: 'active',
        health: 98,
        warrantyDate: '2028-11-15',
        nextService: '2026-03-01',
        image: 'bg-emerald-100',
        logs: [
            { id: 'l1', date: '2025-11-15', type: 'routine', description: 'Installation & Calibration', technician: 'Hylono Install Team' },
            { id: 'l2', date: '2026-01-10', type: 'routine', description: 'Filter Check - Passed', technician: 'Internal Staff (Mike)' }
        ]
    },
    {
        id: 'd2',
        model: 'Aurora Pro Panel (Waitlist Edition)',
        type: 'RLT',
        serial: 'RLT-99X-02',
        status: 'active',
        health: 100,
        warrantyDate: '2027-02-20',
        nextService: '2026-06-15',
        image: 'bg-rose-100',
        logs: [
            { id: 'l3', date: '2025-02-20', type: 'routine', description: 'Initial Setup', technician: 'Self-Install' }
        ]
    },
    {
        id: 'd3',
        model: 'Core PEMF Mat',
        type: 'PEMF',
        serial: 'PEMF-PRO-55',
        status: 'maintenance',
        health: 75,
        warrantyDate: '2026-05-10',
        nextService: 'OVERDUE',
        image: 'bg-indigo-100',
        logs: [
            { id: 'l4', date: '2026-01-14', type: 'issue', description: 'Controller intermittent power', technician: 'Reported by Staff' }
        ]
    }
];

const StatusBadge: React.FC<{ status: Device['status'] }> = ({ status }) => {
    switch (status) {
        case 'active': return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Online</span>;
        case 'maintenance': return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold uppercase flex items-center gap-1"><Wrench className="w-3 h-3" /> Service</span>;
        case 'offline': return <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs font-bold uppercase flex items-center gap-1"><X className="w-3 h-3" /> Offline</span>;
    }
};

const DeviceModal: React.FC<{
    device: Device;
    onClose: () => void;
    onAddLog: (deviceId: string, log: Omit<ServiceLog, 'id'>) => void;
}> = ({ device, onClose, onAddLog }) => {
    const [isAddingLog, setIsAddingLog] = useState(false);
    const [newLog, setNewLog] = useState<Omit<ServiceLog, 'id'>>({
        date: getTodayDate(),
        type: 'routine',
        description: '',
        technician: ''
    });

    const handleSubmitLog = (e: React.FormEvent) => {
        e.preventDefault();
        onAddLog(device.id, newLog);
        setIsAddingLog(false);
        setNewLog({
            date: getTodayDate(),
            type: 'routine',
            description: '',
            technician: ''
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="fleet-health-modal-title"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-slate-900 p-4 md:p-6 text-white flex justify-between items-start shrink-0">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700 text-cyan-400">{device.serial}</span>
                            <StatusBadge status={device.status} />
                        </div>
                        <h2 id="fleet-health-modal-title" className="text-lg md:text-2xl font-bold truncate">{device.model}</h2>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm text-slate-400">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" /> Warranty: {device.warrantyDate}</span>
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" /> Health: {device.health}%</span>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Close device details" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors shrink-0">
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6 overflow-y-auto">

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                        <button className="flex items-center justify-center gap-2 p-2 md:p-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-bold text-slate-700 transition-colors text-xs md:text-sm">
                            <FileText className="w-4 h-4" /> View Manual
                        </button>
                        <button className="flex items-center justify-center gap-2 p-2 md:p-3 border border-amber-200 bg-amber-50 rounded-lg hover:bg-amber-100 font-bold text-amber-800 transition-colors text-xs md:text-sm">
                            <AlertTriangle className="w-4 h-4" /> Report Issue
                        </button>
                    </div>

                    {/* Service Log Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" /> Service History
                        </h3>
                        {!isAddingLog && (
                            <button
                                onClick={() => setIsAddingLog(true)}
                                className="text-xs bg-cyan-50 text-cyan-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" /> Add Log
                            </button>
                        )}
                    </div>

                    {/* Add Log Form */}
                    <AnimatePresence>
                        {isAddingLog && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-hidden"
                                onSubmit={handleSubmitLog}
                            >
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                                        <select
                                            value={newLog.type}
onChange={(e) => setNewLog({ ...newLog, type: e.target.value as 'routine' | 'repair' | 'issue' })}
                                            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-400"
                                        >
                                            <option value="routine">Routine Maintenance</option>
                                            <option value="repair">Repair</option>
                                            <option value="issue">Issue Report</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={newLog.date}
                                            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                                            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-400"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Filter replacement"
                                        value={newLog.description}
                                        onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                                        required
                                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Technician</label>
                                    <input
                                        type="text"
                                        placeholder="Name or ID"
                                        value={newLog.technician}
                                        onChange={(e) => setNewLog({ ...newLog, technician: e.target.value })}
                                        required
                                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingLog(false)}
                                        className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 flex items-center gap-2"
                                    >
                                        <Save className="w-3.5 h-3.5" /> Save Record
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Log List */}
                    <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
                        {device.logs.map((log) => (
                            <div key={log.id} className="relative">
                                {/* Dot */}
                                <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white ring-2 ${log.type === 'issue' ? 'ring-red-200 bg-red-400' : 'ring-slate-100 bg-slate-300'}`} />

                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{log.description}</p>
                                        <p className="text-xs text-slate-500 mt-1">Tech: {log.technician}</p>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">{log.date}</span>
                                </div>
                            </div>
                        ))}
                        <div className="relative">
                            <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white ring-2 ring-emerald-100 bg-emerald-400" />
                            <p className="text-sm font-bold text-slate-800">Unit Commissioned</p>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export const FleetHealth: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

    const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null;

    const handleAddLog = (deviceId: string, log: Omit<ServiceLog, 'id'>) => {
        const newLog: ServiceLog = {
            ...log,
            id: `l${Date.now()}` // Simple ID generation
        };

        setDevices(currentDevices =>
            currentDevices.map(device => {
                if (device.id === deviceId) {
                    return {
                        ...device,
                        logs: [newLog, ...device.logs] // Add new log to the beginning
                    };
                }
                return device;
            })
        );
    };

    return (
        <PartnerLayout title="Fleet Health & Warranty">
            <AnimatePresence>
                {selectedDevice && (
                    <DeviceModal
                        device={selectedDevice}
                        onClose={() => setSelectedDeviceId(null)}
                        onAddLog={handleAddLog}
                    />
                )}
            </AnimatePresence>

            <div className="space-y-6">

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Fleet</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{devices.filter(d => d.status === 'active').length} <span className="text-xs text-slate-400 font-normal">Units</span></p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Warranty Status</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">100% <span className="text-xs text-emerald-500 font-bold">Covered</span></p>
                        </div>
                        <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Next Service</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">Mar 01 <span className="text-xs text-slate-400 font-normal">('26)</span></p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Fleet List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h2 className="font-bold text-slate-900">My Devices</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                            <Plus className="w-4 h-4" /> Register New Device
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {devices.map((device) => (
                            <div
                                key={device.id}
                                className="p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                                onClick={() => setSelectedDeviceId(device.id)}
                            >
                                {/* Thumbnail */}
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg ${device.image} flex items-center justify-center text-slate-600 font-bold text-xs shrink-0`}>
                                    {device.type}
                                </div>

                                {/* Info */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 items-start sm:items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-cyan-600 transition-colors text-sm md:text-base">{device.model}</h3>
                                        <p className="text-xs font-mono text-slate-400">{device.serial}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1 hidden sm:block">Status</p>
                                        <StatusBadge status={device.status} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1 hidden sm:block">Warranty Ends</p>
                                        <p className="text-sm font-medium text-slate-700">{device.warrantyDate}</p>
                                    </div>

                                    <div className="hidden lg:block text-right">
                                        {device.status === 'maintenance' ? (
                                            <button className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-bold">
                                                Update Ticket
                                            </button>
                                        ) : (
                                            <button className="p-2 text-slate-300 hover:text-slate-600 rounded-full hover:bg-slate-100">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </PartnerLayout>
    );
};
