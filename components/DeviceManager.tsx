import React, { useState } from 'react';
import { Device } from '../types';
import { Cpu, Wifi, RefreshCw, QrCode, AlertCircle, Battery } from 'lucide-react';

interface DeviceManagerProps {
    devices: Device[];
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({ devices }) => {
    const [scanning, setScanning] = useState(false);

    return (
        <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                    <Cpu className="text-cyan-400" size={20} />
                    <span className="futuristic-font">Device Command</span>
                </h3>
                <button
                    onClick={() => setScanning(!scanning)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest bg-cyan-900/30 border border-cyan-500/30 px-3 py-1.5 rounded-full text-cyan-400 hover:bg-cyan-900/50 transition-colors"
                >
                    <QrCode size={12} /> {scanning ? 'Scanning...' : 'Link Device'}
                </button>
            </div>

            {scanning && (
                <div className="mb-6 p-4 bg-cyan-900/20 rounded-xl border border-cyan-500/50 animate-pulse flex items-center justify-center h-32">
                    <p className="text-cyan-400 text-xs font-mono">Simulating Camera Feed... [QR_SCAN_ACTIVE]</p>
                </div>
            )}

            <div className="space-y-4">
                {devices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No active devices. Scan QR code on hardware to provision.
                    </div>
                ) : (
                    devices.map((device) => (
                        <div key={device.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm text-cyan-50">{device.name}</h4>
                                        <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-mono mt-1">S/N: {device.serial}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Status</span>
                                    <span className={`text-[10px] font-bold ${device.status === 'ONLINE' ? 'text-emerald-400' : 'text-gray-500'}`}>{device.status}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="p-2 bg-slate-800 rounded flex items-center gap-2">
                                    <Wifi size={12} className="text-gray-500" />
                                    <span className="text-[10px] text-gray-400">Signal: 98%</span>
                                </div>
                                <div className="p-2 bg-slate-800 rounded flex items-center gap-2">
                                    <Battery size={12} className="text-gray-500" />
                                    <span className="text-[10px] text-gray-400">Power: AC</span>
                                </div>
                            </div>

                            {device.rentalExpiry && (
                                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[10px] text-amber-500">
                                    <AlertCircle size={10} />
                                    Rental Expires: {device.rentalExpiry}
                                </div>
                            )}

                            {/* Maintenance Mode / Updates */}
                            <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[9px] text-cyan-400 flex items-center gap-1 hover:underline">
                                    <RefreshCw size={10} /> Check Firmware
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
