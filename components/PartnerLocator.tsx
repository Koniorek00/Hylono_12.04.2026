import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Globe, Clock, Star, Filter, ChevronDown, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
// @ts-expect-error - Leaflet internal property not in types
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Partner {
    id: string;
    name: string;
    type: 'clinic' | 'distributor' | 'showroom';
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    website?: string;
    hours: string;
    rating: number;
    features: string[];
    coordinates: { lat: number; lng: number };
}

const partners: Partner[] = [
    { id: '1', name: 'Hylono Showroom Warsaw', type: 'showroom', address: 'ul. Nowy Świat 25', city: 'Warsaw', country: 'Poland', phone: '+48 22 123 4567', email: 'warsaw@hylono.com', hours: 'Mon-Fri 9:00-18:00', rating: 5, features: ['HBOT', 'PEMF', 'RLT', 'Hydrogen'], coordinates: { lat: 52.23, lng: 21.01 } },
    { id: '2', name: 'BioWellness Krakow', type: 'clinic', address: 'ul. Floriańska 12', city: 'Krakow', country: 'Poland', phone: '+48 12 345 6789', email: 'info@biowellness.pl', website: 'https://biowellness.pl', hours: 'Mon-Sat 8:00-20:00', rating: 4.8, features: ['HBOT', 'PEMF'], coordinates: { lat: 50.06, lng: 19.94 } },
    { id: '3', name: 'Regeneration Center Berlin', type: 'clinic', address: 'Friedrichstraße 100', city: 'Berlin', country: 'Germany', phone: '+49 30 1234567', email: 'info@regen-berlin.de', website: 'https://regen-berlin.de', hours: 'Mon-Fri 9:00-19:00', rating: 4.9, features: ['HBOT', 'RLT', 'Hydrogen'], coordinates: { lat: 52.52, lng: 13.40 } },
    { id: '4', name: 'Nordic Wellness Solutions', type: 'distributor', address: 'Storgatan 45', city: 'Stockholm', country: 'Sweden', phone: '+46 8 123 456', email: 'sales@nws.se', hours: 'Mon-Fri 8:00-17:00', rating: 4.7, features: ['HBOT', 'PEMF', 'RLT'], coordinates: { lat: 59.33, lng: 18.07 } },
    { id: '5', name: 'Vitality Hub Prague', type: 'clinic', address: 'Václavské náměstí 5', city: 'Prague', country: 'Czech Republic', phone: '+420 123 456 789', email: 'hello@vitalityhub.cz', hours: 'Mon-Fri 10:00-20:00', rating: 4.6, features: ['HBOT', 'PEMF'], coordinates: { lat: 50.08, lng: 14.43 } },
    { id: '6', name: 'MedTech Austria', type: 'distributor', address: 'Mariahilfer Straße 88', city: 'Vienna', country: 'Austria', phone: '+43 1 234 5678', email: 'sales@medtech.at', hours: 'Mon-Fri 9:00-17:00', rating: 4.8, features: ['HBOT', 'PEMF', 'RLT', 'Hydrogen'], coordinates: { lat: 48.20, lng: 16.37 } },
];

const typeColors = {
    clinic: 'bg-emerald-500',
    distributor: 'bg-purple-500',
    showroom: 'bg-cyan-500'
};

const typeLabels = {
    clinic: 'Wellness Clinic',
    distributor: 'Authorized Distributor',
    showroom: 'Hylono Showroom'
};

const RecenterMap: React.FC<{ coords: { lat: number; lng: number } }> = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([coords.lat, coords.lng], 13);
    }, [coords, map]);
    return null;
};

export const PartnerLocator: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedTech, setSelectedTech] = useState<string>('all');
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    const countries = useMemo(() => [...new Set(partners.map(p => p.country))], []);
    const technologies = ['HBOT', 'PEMF', 'RLT', 'Hydrogen'];

    const filteredPartners = useMemo(() => {
        return partners.filter(p => {
            if (selectedCountry !== 'all' && p.country !== selectedCountry) return false;
            if (selectedType !== 'all' && p.type !== selectedType) return false;
            if (selectedTech !== 'all' && !p.features.includes(selectedTech)) return false;
            return true;
        });
    }, [selectedCountry, selectedType, selectedTech]);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <MapPin className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Find a Partner</h1>
                    <p className="text-lg text-slate-600">Locate clinics, distributors, and showrooms near you</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs text-slate-500 mb-1 block">Country</label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="all">All Countries</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs text-slate-500 mb-1 block">Partner Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="all">All Types</option>
                                <option value="showroom">Hylono Showroom</option>
                                <option value="clinic">Wellness Clinic</option>
                                <option value="distributor">Distributor</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs text-slate-500 mb-1 block">Technology</label>
                            <select
                                value={selectedTech}
                                onChange={(e) => setSelectedTech(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="all">All Technologies</option>
                                {technologies.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Live Leaflet Map */}
                    <div className="bg-slate-200 rounded-2xl h-[500px] relative overflow-hidden shadow-inner border border-slate-200">
                        <MapContainer
                            center={[52.23, 21.01]}
                            zoom={4}
                            style={{ height: '100%', width: '100%', zIndex: 10 }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredPartners.map((p) => (
                                <Marker
                                    key={p.id}
                                    position={[p.coordinates.lat, p.coordinates.lng]}
                                    eventHandlers={{
                                        click: () => setSelectedPartner(p),
                                    }}
                                >
                                    <Popup>
                                        <div className="p-1">
                                            <h4 className="font-bold text-slate-900 m-0">{p.name}</h4>
                                            <p className="text-xs text-slate-500 my-1">{p.city}, {p.country}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {p.features.slice(0, 2).map(f => (
                                                    <span key={f} className="text-[8px] px-1.5 py-0.5 bg-slate-100 rounded">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                            {selectedPartner && <RecenterMap coords={selectedPartner.coordinates} />}
                        </MapContainer>

                        {/* Coming Soon Map Overlay */}
                        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-slate-100/90 backdrop-blur-sm rounded-2xl">
                            <MapPin size={36} className="text-cyan-500 mb-3" />
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Interactive Map Coming Soon</h3>
                            <p className="text-sm text-slate-500 text-center max-w-xs px-4">
                                We&apos;re integrating a live partner map. In the meantime, use the partner list on the right to find a certified Hylono centre near you.
                            </p>
                        </div>

                        {/* Map Overlay Stats */}
                        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-200 pointer-events-none">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Partners</p>
                            <p className="text-lg font-bold text-slate-900">{filteredPartners.length}</p>
                        </div>
                    </div>

                    {/* Partner List */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        <p className="text-sm text-slate-500">{filteredPartners.length} partners found</p>

                        <AnimatePresence>
                            {filteredPartners.map((partner) => (
                                <motion.div
                                    key={partner.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onClick={() => setSelectedPartner(partner)}
                                    className={`bg-white rounded-xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedPartner?.id === partner.id ? 'ring-2 ring-cyan-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <span className={`text-[10px] px-2 py-1 rounded-full text-white ${typeColors[partner.type]}`}>
                                                {typeLabels[partner.type]}
                                            </span>
                                            <h3 className="font-bold text-slate-900 mt-2">{partner.name}</h3>
                                            <p className="text-sm text-slate-500">{partner.city}, {partner.country}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-sm font-medium">{partner.rating}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {partner.features.map(f => (
                                            <span key={f} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {partner.hours}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Selected Partner Detail Modal */}
                <AnimatePresence>
                    {selectedPartner && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedPartner(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            >
                                <span className={`text-xs px-3 py-1 rounded-full text-white ${typeColors[selectedPartner.type]}`}>
                                    {typeLabels[selectedPartner.type]}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-2">{selectedPartner.name}</h2>

                                <div className="space-y-3 mb-6">
                                    <p className="flex items-center gap-3 text-slate-600">
                                        <MapPin size={16} className="text-slate-400" />
                                        {selectedPartner.address}, {selectedPartner.city}
                                    </p>
                                    <p className="flex items-center gap-3 text-slate-600">
                                        <Phone size={16} className="text-slate-400" />
                                        {selectedPartner.phone}
                                    </p>
                                    <p className="flex items-center gap-3 text-slate-600">
                                        <Mail size={16} className="text-slate-400" />
                                        {selectedPartner.email}
                                    </p>
                                    {selectedPartner.website && (
                                        <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-cyan-600 hover:underline">
                                            <Globe size={16} /> Visit Website <ExternalLink size={12} />
                                        </a>
                                    )}
                                    <p className="flex items-center gap-3 text-slate-600">
                                        <Clock size={16} className="text-slate-400" />
                                        {selectedPartner.hours}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedPartner.features.map(f => (
                                        <span key={f} className="text-xs px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full font-medium">
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={`mailto:${selectedPartner.email}`}
                                        className="flex-1 py-3 bg-slate-900 text-white text-center rounded-xl font-bold hover:bg-slate-800"
                                    >
                                        Contact
                                    </a>
                                    <button
                                        onClick={() => setSelectedPartner(null)}
                                        className="px-6 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

