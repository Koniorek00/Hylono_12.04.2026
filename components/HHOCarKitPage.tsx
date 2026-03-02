import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, CheckCircle, Shield, Zap, Fuel, Wind,
  ChevronDown, ChevronUp, Star, Package, Settings, Gauge,
  Leaf, BarChart3, Cpu, Phone, Calendar, AlertTriangle, Truck, Car
} from 'lucide-react';
import { HHOROICalculator } from './HHOROICalculator';

interface HHOCarKitPageProps {
  initialFuelContext?: {
    fuelData: {
      petrol: number;
      diesel: number;
      currency: string;
      symbol: string;
      countryName: string;
    };
    countryCode: string;
    locationStatus: 'detected' | 'fallback';
  };
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

type Variant = 'car' | 'truck';

// ─── DATA ────────────────────────────────────────────────────────────────────

const VARIANTS = {
  car: {
    id: 'car' as Variant,
    label: 'Car Kit',
    icon: <Car size={20} />,
    tagline: 'Precision hydrogen combustion enhancement for petrol and diesel vehicles — engineered to extract more from every combustion cycle.',
    displacement: '1.0–6.0L',
    fuelEconomy: '15–20%',
    power: '+20–25%',
    emissions: '−50%',
    powerSupply: '3.8V / 15A',
    hhoRate: '0.15–3 L/min',
    dimensions: 'Compact form factor',
    gradient: 'from-cyan-500 to-teal-600',
    accentBg: 'bg-cyan-600',
    accentText: 'text-cyan-600',
    accentLight: 'bg-cyan-100 text-cyan-700',
    stats: [
      { value: '15–20%', label: 'Fuel Economy', color: 'text-cyan-500' },
      { value: '+25%', label: 'Engine Power', color: 'text-teal-400' },
      { value: '−50%', label: 'Emissions', color: 'text-emerald-400' },
      { value: '1.0–6.0L', label: 'Displacement', color: 'text-slate-400' },
    ],
    kitContents: [
      { name: 'PEM Hydrogen Generator', desc: 'Core electrolysis unit using proton exchange membrane' },
      { name: 'Microcomputer Controller', desc: '7nm US-imported chip — optimises ignition timing & shift points in real-time' },
      { name: 'Transformer Module', desc: 'Powers the cell efficiently at 3.8V / 15A' },
      { name: 'Water-Gas Separator', desc: 'Separates pure H₂ from moisture before engine intake' },
      { name: 'Water Tank', desc: 'Reservoir for distilled/pure water — no additives needed' },
      { name: 'Resin Filter', desc: 'Polishes water for optimal electrolysis purity' },
      { name: 'Water Pump', desc: 'Circulates water to the electrolysis cell on demand' },
      { name: 'Connecting Cables & Hardware', desc: 'Full wiring harness and mounting hardware included' },
    ],
    subModels: null,
    techLabel: 'Microcomputer',
    techDesc: 'The 7nm microcomputer continuously adapts ignition advance angle and transmission shift timing to match your driving habits and hydrogen flow, maximising combustion efficiency on every cycle.',
    howItWorks: 'Combustion in a petrol or diesel engine is inherently incomplete — particularly under low-torque, stop-start conditions below 3000 RPM where fuel injection outpaces the flame front. The HHO Car Kit addresses this at the source: pure hydrogen gas is generated on demand from distilled water via PEM electrolysis, and a precise trace volume is introduced into the air intake. Hydrogen burns 8× faster than petrol and diffuses 12× more readily — enabling full combustion of the fuel charge on every cycle. The 7nm microcomputer continuously fine-tunes ignition advance angle and transmission shift points to match your specific driving pattern.',
    howItWorksTech: 'PEM electrolysis splits H₂O at 3.8V / 15A via a solid polymer membrane. The resulting trace H₂ (0.15–3 L/min) enters the intake manifold, accelerating flame front velocity ~8× and improving diffusivity ~12× vs gasoline vapour — promoting complete combustion under low-torque sub-3000 RPM conditions. The 7nm microcontroller adapts injector timing and transmission shift mapping based on hydrogen flow rate and driver input patterns.',
  },
  truck: {
    id: 'truck' as Variant,
    label: 'Truck Kit',
    icon: <Truck size={20} />,
    tagline: 'Industrial-grade PEM hydrogen combustion technology for diesel fleets. Validated on live freight operations — engineered for the demands of commercial transport.',
    displacement: '6.0L and below',
    fuelEconomy: '10–18%',
    power: '+10–15%',
    emissions: '−50%',
    powerSupply: '12V/24V input — 4V/6V output',
    hhoRate: 'Up to 1000 ml/min (DH-Power)',
    dimensions: '37 × 25 × 40 cm · 12 kg',
    gradient: 'from-slate-600 to-slate-800',
    accentBg: 'bg-slate-700',
    accentText: 'text-slate-700',
    accentLight: 'bg-slate-100 text-slate-700',
    stats: [
      { value: '10–18%', label: 'Fuel Economy', color: 'text-cyan-500' },
      { value: '+15%', label: 'Horsepower', color: 'text-teal-400' },
      { value: '−50%', label: 'Emissions', color: 'text-emerald-400' },
      { value: '≤6.0L', label: 'Displacement', color: 'text-slate-400' },
    ],
    kitContents: [
      { name: 'PEM Hydrogen Generator', desc: 'Heavy-duty electrolysis cell sized for diesel truck engines' },
      { name: 'Performance Chips', desc: '7nm US-imported chip — optimises combustion, ignition, and shift strategy' },
      { name: 'Transformer Module', desc: 'Powers the cell from 12V/24V truck electrical system' },
      { name: 'Water-Gas Separator', desc: 'Separates pure H₂ before entering the diesel air intake' },
      { name: 'Water Tank', desc: 'Reservoir for pure water — no KOH or NaOH required' },
      { name: 'Resin Filter', desc: 'Conditions water for clean, reliable electrolysis' },
      { name: 'Water Pump', desc: 'Delivers water to the electrolysis cell on demand' },
      { name: 'Connecting Cables & Hardware', desc: 'Full truck-spec wiring harness and mounting kit' },
    ],
    subModels: [
      {
        name: 'DL-Power',
        desc: 'Entry-level truck kit for lighter commercial vehicles and vans',
        specs: [
          { label: 'Displacement', value: '≤6.0L' },
          { label: 'Electrolyte', value: 'Pure water' },
          { label: 'Power In', value: '12V / 24V' },
          { label: 'Power Out', value: '4V' },
          { label: 'Dimensions', value: '37×25×40 cm' },
          { label: 'Weight', value: '12 kg' },
        ],
      },
      {
        name: 'DM-Power',
        desc: 'Mid-range kit for standard cargo trucks and medium-duty diesels',
        specs: [
          { label: 'Displacement', value: '≤6.0L' },
          { label: 'Electrolyte', value: 'Pure water' },
          { label: 'Power In', value: '12V / 24V' },
          { label: 'Power Out', value: '6V' },
          { label: 'Dimensions', value: '37×25×40 cm' },
          { label: 'Weight', value: '12 kg' },
        ],
      },
      {
        name: 'DH-Power',
        desc: 'High-output kit for heavy freight trucks and long-haul fleets',
        specs: [
          { label: 'H₂ Output', value: '1000 ml/min' },
          { label: 'Electrolyte', value: 'Pure water' },
          { label: 'Power In', value: '12V / 24V' },
          { label: 'Power Out', value: '4V' },
          { label: 'Dimensions', value: '37×25×40 cm' },
          { label: 'Weight', value: '12 kg' },
        ],
      },
    ],
    techLabel: 'Performance Chips',
    techDesc: 'The 7nm Performance Chips monitor hydrogen flow, engine load, and driver habits to optimise ignition advance angle and transmission shift timing — giving diesel trucks fuel efficiency gains comparable to modern electric-assist systems.',
    howItWorks: 'Diesel combustion efficiency varies significantly with engine load and duty cycle. At partial throttle — the dominant condition across urban delivery, highway cruise, and loaded haul — incomplete combustion is the primary driver of excess fuel consumption and carbon deposit accumulation. The Truck Kit introduces trace hydrogen into the diesel air intake, accelerating the flame front and enabling complete combustion across the full operating range. Validated on live commercial freight fleet installations, the system delivers 10–18% fuel economy improvement within the first few tanks, with carbon deposit removal extending engine service intervals.',
    howItWorksTech: 'PEM electrolysis produces up to 1000ml/min of H₂ (DH-Power model) from pure water at low input voltage (12V/24V). The H₂ enters the diesel air intake, improving flame front propagation and ensuring complete combustion of diesel fuel. The 7nm Performance Chips adapt fuel injection timing, ignition advance, and transmission shift logic to the specific load profile of the truck — validated on live freight fleet installations.',
  },
};

const PEM_VS_CONVENTIONAL = [
  { feature: 'Electrolyte', pem: 'Pure distilled water only', conv: 'Requires KOH or NaOH additives' },
  { feature: 'Power Draw', pem: 'Low consumption (3.8–6V)', conv: 'High consumption (13V / 30A)' },
  { feature: 'Corrosion Risk', pem: 'None — no caustic chemicals', conv: 'High — corrosive environment' },
  { feature: 'Size & Weight', pem: 'Compact and lightweight', conv: 'Large and heavy' },
  { feature: 'H₂ Generation', pem: 'On-demand trace generation', conv: 'Continuous, excess production' },
  { feature: 'Safety', pem: 'Insured by Pacific Insurance', conv: 'Hazardous chemical handling' },
];

const FAQS = [
  {
    q: 'Does installation require engine modifications or ECU remapping?',
    a: 'No. Both kits use non-destructive installation — hydrogen is introduced into the air intake alongside normal airflow. No engine modification or ECU remapping is required. Fully reversible.',
  },
  {
    q: 'What fuel types are compatible?',
    a: 'Both kits are compatible with petrol and diesel engines. The Truck Kit is specifically optimised for diesel engines in commercial vehicles.',
  },
  {
    q: 'What water does the system use?',
    a: 'Only pure or distilled water. No additives, KOH, or NaOH are required — unlike conventional alkaline HHO generators. This makes the system safer and virtually maintenance-free.',
  },
  {
    q: 'Which truck sub-model should I choose?',
    a: 'DL-Power suits lighter commercial vehicles and vans. DM-Power is ideal for standard cargo trucks. DH-Power (1000ml/min H₂ output) is recommended for heavy freight and long-haul operations. Contact Hylono for a vehicle-specific recommendation.',
  },
  {
    q: 'How long until I see results?',
    a: 'Fuel economy improvements are typically noticeable within the first full tank. Carbon deposit removal and full engine optimisation may take 2–4 weeks of regular use.',
  },
  {
    q: 'Is this covered by warranty or insurance?',
    a: 'Yes. All kits are covered by Pacific Insurance. Hylono provides a 12-month distributor warranty on hardware defects and full EU technical support.',
  },
];

const REVIEWS = [
  {
    name: 'Thomas Groves',
    variant: 'Car Kit',
    rating: 5,
    text: 'I installed it and I am very pleased. The first thing I noticed was how smooth my engine ran. My fuel mileage improved from 21.5 to 27.8 — a real, measurable difference.',
  },
  {
    name: 'John Soultanias',
    variant: 'Car Kit',
    rating: 5,
    text: 'Customer service is amazing, lots of options and answers to all my questions. Received the package in 5 days. Checked the product — exactly as described. Outstanding.',
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const HHOCarKitPage: React.FC<HHOCarKitPageProps> = ({
  initialFuelContext,
  onBack,
  onNavigate,
}) => {
  const [variant, setVariant] = useState<Variant>('car');
  const [selectedSubModel, setSelectedSubModel] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSafety, setShowSafety] = useState(false);
  const [activeTab, setActiveTab] = useState<'simple' | 'tech'>('simple');

  const v = VARIANTS[variant];
  const selectedTruckSubModel =
    variant === 'truck'
      ? v.subModels?.[selectedSubModel] ?? v.subModels?.[0] ?? null
      : null;

  return (
    <div className="min-h-screen bg-white">

      {/* ── VARIANT SELECTOR ─────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-100 pt-6 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-0">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Hydrogen Combustion System — Select your vehicle type
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                HHO Hydrogen Kit
              </h1>
            </div>
            {/* Tab switcher */}
            <div className="flex gap-2 pb-0">
              {(['car', 'truck'] as Variant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setVariant(v); setSelectedSubModel(0); setActiveTab('simple'); }}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-t-2xl font-bold text-sm border-t border-x transition-all ${
                    variant === v
                      ? 'bg-white border-slate-200 text-slate-900 shadow-sm -mb-px'
                      : 'bg-slate-100 border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {VARIANTS[v].icon}
                  {VARIANTS[v].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-100/30 blur-3xl" />
              <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-teal-100/20 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* LEFT */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle size={10} /> Pacific Insurance Covered
                    </span>
                    <span className="text-[10px] bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                      PEM Technology
                    </span>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${v.accentLight}`}>
                      {v.label}
                    </span>
                  </div>

                  <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-none">
                    {v.label}
                  </h2>
                  <p className="text-xl text-slate-500 font-light mb-8 leading-relaxed">
                    {v.tagline}
                  </p>

                  {/* Key stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {v.stats.map((s) => (
                      <div key={s.label} className="text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <span className={`text-2xl font-black block ${s.color}`}>{s.value}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-0.5 block leading-snug">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                      onClick={() => onNavigate?.('contact')}
                      className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                    >
                      Get a Quote <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={() => onNavigate?.('contact')}
                      className="flex-1 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-sm hover:border-slate-400 transition-all flex items-center justify-center gap-3"
                    >
                      <Calendar size={18} /> Book a Call
                    </button>
                  </div>

                  {/* Trust row */}
                  <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                    <div className="flex items-center gap-2"><Shield size={16} className="text-emerald-500" /><span>12-Month Warranty</span></div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /><span>No Engine Mods Required</span></div>
                    <div className="flex items-center gap-2"><Phone size={16} className="text-emerald-500" /><span>EU Distributor Support</span></div>
                  </div>
                </div>

                {/* RIGHT: Visual */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-80 h-80 md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-white to-slate-100 shadow-2xl shadow-slate-200/60 flex items-center justify-center border border-slate-100">
                      <div className={`w-52 h-52 md:w-64 md:h-64 rounded-full bg-gradient-to-br ${v.gradient} flex flex-col items-center justify-center text-white shadow-xl gap-3`}>
                        {variant === 'car' ? <Car size={52} strokeWidth={1.5} /> : <Truck size={52} strokeWidth={1.5} />}
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">{v.label}</span>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-2.5 text-center">
                      <span className="text-xs text-slate-500 block">Engine Range</span>
                      <span className="text-sm font-black text-slate-900">{v.displacement}</span>
                    </div>
                    <div className={`absolute -bottom-4 -left-4 ${v.accentBg} rounded-2xl shadow-lg px-4 py-2.5 text-center`}>
                      <span className="text-xs text-white/70 block">Technology</span>
                      <span className="text-sm font-black text-white">PEM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── STAT STRIP ─────────────────────────────────────── */}
          <section className="py-14 bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: <Gauge size={22} />, value: v.fuelEconomy, label: 'Fuel Economy Improvement', color: 'text-cyan-500' },
                  { icon: <Zap size={22} />, value: v.power, label: 'Engine Power Increase', color: 'text-teal-400' },
                  { icon: <Leaf size={22} />, value: v.emissions, label: 'Exhaust Emissions Reduced', color: 'text-emerald-400' },
                  { icon: <Settings size={22} />, value: v.displacement, label: 'Engine Displacement Range', color: 'text-slate-400' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-2 bg-slate-800 rounded-xl">
                        <span className={stat.color}>{stat.icon}</span>
                      </div>
                    </div>
                    <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-slate-400 font-medium leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TRUCK SUB-MODELS (only for truck variant) ──────── */}
          {variant === 'truck' && v.subModels && selectedTruckSubModel && (
            <section className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Model</h2>
                  <p className="text-slate-500 max-w-lg mx-auto">
                    Three power configurations to match your truck type — from light commercial vehicles to heavy freight fleets.
                  </p>
                </div>

                {/* Model tabs */}
                <div className="flex gap-3 mb-8 justify-center flex-wrap">
                  {v.subModels.map((m, idx) => (
                    <button
                      key={m.name}
                      onClick={() => setSelectedSubModel(idx)}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                        selectedSubModel === idx
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSubModel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="bg-slate-50 rounded-3xl border border-slate-100 p-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-lg mb-4">
                          {selectedTruckSubModel.name}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg">{selectedTruckSubModel.desc}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedTruckSubModel.specs.map((spec) => (
                          <div key={spec.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">{spec.label}</span>
                            <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* ── HOW IT WORKS ───────────────────────────────────── */}
          <section className={`py-20 ${variant === 'truck' ? 'bg-slate-50' : 'bg-white'}`}>
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-slate-900">
                  {activeTab === 'simple' ? 'How It Works' : 'The Science Behind It'}
                </h2>
                <div className="inline-flex bg-slate-100 p-1 rounded-full">
                  <button
                    onClick={() => setActiveTab('simple')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'simple' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setActiveTab('tech')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'tech' ? 'bg-cyan-500 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Technical
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'simple' ? (
                  <motion.p key="simple" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-xl text-slate-600 leading-relaxed">
                    {v.howItWorks}
                  </motion.p>
                ) : (
                  <motion.div key="tech" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-900 rounded-3xl p-8">
                    <p className="text-lg text-cyan-100/80 font-mono leading-relaxed mb-8">{v.howItWorksTech}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Power Supply', value: v.powerSupply },
                        { label: 'H₂ Output Rate', value: v.hhoRate },
                        { label: 'Engine Range', value: v.displacement },
                        { label: 'Electrolyte', value: 'Pure H₂O' },
                        { label: 'Chip Node', value: '7nm US' },
                        { label: 'Dimensions', value: v.dimensions },
                      ].map((spec) => (
                        <div key={spec.label} className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
                          <span className="text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">{spec.label}</span>
                          <span className="text-lg font-mono font-bold text-white">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* ── WHAT'S IN THE BOX ──────────────────────────────── */}
          <section className={`py-20 ${variant === 'truck' ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">What's in the Box</h2>
                  <p className="text-slate-500 mt-1">Everything needed for a complete, clean installation.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {v.kitContents.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 font-black text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-sm text-slate-500 mt-0.5 block">{item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SMART CONTROLLER ───────────────────────────────── */}
          <section className={`py-20 ${variant === 'truck' ? 'bg-slate-50' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-700"><Cpu size={20} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Core Intelligence</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">The {v.techLabel}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">{v.techDesc}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Chip Node', value: '7nm US Import' },
                      { label: 'Precision', value: 'High-accuracy' },
                      { label: 'Power Draw', value: 'Ultra-low' },
                      { label: 'Response', value: 'Real-time' },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-72 h-72 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-2xl flex flex-col items-center justify-center gap-4 text-white">
                    <Cpu size={56} strokeWidth={1} className="text-cyan-400" />
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">7nm</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest">{v.techLabel}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-6 w-full">
                      {['IGN', 'H₂', 'RPM'].map((tag) => (
                        <div key={tag} className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg py-1 text-center">
                          <span className="text-[10px] font-mono text-cyan-300">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* ── PEM vs CONVENTIONAL (shared) ─────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">PEM vs Conventional HHO</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Not all hydrogen generators are equal. See why PEM is the safer, smarter choice.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white px-6 py-4">
              <span className="text-slate-400 uppercase tracking-wider text-xs font-bold">Feature</span>
              <span className="text-cyan-400 uppercase tracking-wider text-xs font-bold">Our PEM System</span>
              <span className="text-slate-500 uppercase tracking-wider text-xs font-bold">Conventional HHO</span>
            </div>
            {PEM_VS_CONVENTIONAL.map((row, idx) => (
              <div key={row.feature} className={`grid grid-cols-3 px-6 py-4 text-sm border-b border-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <span className="font-bold text-slate-700">{row.feature}</span>
                <span className="text-emerald-600 font-medium flex items-start gap-2">
                  <CheckCircle size={14} className="mt-0.5 shrink-0" /> {row.pem}
                </span>
                <span className="text-slate-400 flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" /> {row.conv}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS GRID (shared) ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Key Benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Gauge size={20} />, title: 'Fuel Savings', desc: 'Measurable economy gains on every tank', color: 'bg-cyan-100 text-cyan-600' },
              { icon: <Zap size={20} />, title: 'More Power', desc: 'Stronger acceleration and engine response', color: 'bg-teal-100 text-teal-600' },
              { icon: <Leaf size={20} />, title: 'Clean Exhaust', desc: '50% reduction in harmful exhaust emissions', color: 'bg-emerald-100 text-emerald-600' },
              { icon: <Settings size={20} />, title: 'Carbon Removal', desc: 'Cleans deposits, extends engine life', color: 'bg-slate-100 text-slate-600' },
              { icon: <Wind size={20} />, title: 'Smooth Drive', desc: 'Eliminates hesitation and gear lag', color: 'bg-sky-100 text-sky-600' },
              { icon: <Shield size={20} />, title: 'Safe Install', desc: 'Non-destructive, reversible, insured', color: 'bg-green-100 text-green-600' },
              { icon: <BarChart3 size={20} />, title: 'City Gains', desc: 'Greatest savings in stop-start conditions', color: 'bg-violet-100 text-violet-600' },
              { icon: <Cpu size={20} />, title: 'On-Demand H₂', desc: 'Hydrogen generated only when needed', color: 'bg-orange-100 text-orange-600' },
            ].map((b) => (
              <motion.div key={b.title} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 ${b.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>{b.icon}</div>
                <span className="font-bold text-slate-900 block mb-1">{b.title}</span>
                <span className="text-xs text-slate-500 leading-snug">{b.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR (shared) ──────────────────────────────── */}
      <HHOROICalculator variant={variant} initialFuelContext={initialFuelContext} />

      {/* ── REVIEWS (shared) ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{r.variant}</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4 italic">"{r.text}"</p>
                <span className="text-sm font-bold text-slate-900">— {r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (shared) ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={faq.q} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                  {expandedFaq === idx
                    ? <ChevronUp className="text-slate-400 shrink-0" size={20} />
                    : <ChevronDown className="text-slate-400 shrink-0" size={20} />}
                </button>
                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGINEERING PEDIGREE ─────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-100 rounded-xl text-cyan-600"><Zap size={20} /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">8 Years of Hydrogen Engineering</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Built on Proven Automotive Expertise</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The technology behind every Hylono HHO Kit was developed by a dedicated hydrogen energy R&D team with over 8 years of applied research in automotive hydrogen combustion.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Chief Technical Engineer Michael Wu studied transportation engineering at Sun Yat-sen University and spent years in engine R&D at Dongfeng Nissan's Passenger Car Technology Centre and GAC Research Institute, leading engine development programmes across full vehicle series. His sustained research into the combustion characteristics of hydrogen-supplemented fuel engines became the engineering foundation for the SENZA PEM system.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                That expertise — refined through years of real-world fleet testing and laboratory validation — is what Hylono brings to the European market.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'R&D Experience', value: '8+ Years', sub: 'Hydrogen energy application' },
                { label: 'Engineering Background', value: 'Automotive', sub: 'Sun Yat-sen University' },
                { label: 'Industry Validation', value: 'Fleet-tested', sub: 'Commercial truck installations' },
                { label: 'Hylono Distribution', value: 'EU-wide', sub: 'Authorised distributor' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">{item.label}</span>
                  <span className="text-lg font-black text-slate-900 block">{item.value}</span>
                  <span className="text-xs text-slate-500">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SAFETY / COMPLIANCE ──────────────────────────────────── */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => setShowSafety(!showSafety)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Shield size={20} /></div>
              <div className="text-left">
                <span className="font-bold text-slate-900 block">Important Notices</span>
                <span className="text-xs text-slate-500">Installation, insurance, and product disclaimers</span>
              </div>
            </div>
            {showSafety ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>
          <AnimatePresence>
            {showSafety && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-4 p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p><strong className="text-slate-900">Installation:</strong> Non-destructive installation — no engine modifications or ECU changes required. Professional installation recommended. Full EU technical support from Hylono.</p>
                  <p><strong className="text-slate-900">Insurance:</strong> Covered by Pacific Insurance. 12-month Hylono distributor warranty against hardware defects.</p>
                  <p><strong className="text-slate-900">Compatibility:</strong> Car Kit for petrol/diesel 1.0–6.0L. Truck Kit for diesel commercial vehicles ≤6.0L. Results vary by vehicle condition, driving style, and load.</p>
                  <p className="text-[11px] text-slate-400 italic border-t border-slate-100 pt-4">
                    Performance figures are based on manufacturer road testing. Results are not guaranteed and may vary. Hylono is an authorised European distributor of SENZA Hydrogen Energy products.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider mb-6">
            <Leaf size={12} /> EU Authorised Distributor
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to improve your {variant === 'car' ? 'drive' : 'fleet'}?
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Contact the Hylono team for a personalised quote, vehicle compatibility check, and EU shipping options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate?.('contact')} className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-bold text-sm hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30">
              Get a Quote <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate?.('contact')} className="px-10 py-4 bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold text-sm hover:border-slate-500 transition-all flex items-center justify-center gap-3">
              <Phone size={18} /> Speak to the Team
            </button>
          </div>
        </div>
      </section>

      {/* ── STICKY CTA BAR ───────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 py-4 px-6 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <span className="text-lg font-black text-slate-900">HHO {v.label}</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">EU Distributor · PEM Technology</span>
            <div className="flex gap-2 ml-2">
              {(['car', 'truck'] as Variant[]).map((vt) => (
                <button
                  key={vt}
                  onClick={() => { setVariant(vt); setSelectedSubModel(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    variant === vt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {VARIANTS[vt].icon} {VARIANTS[vt].label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={() => onNavigate?.('contact')} className="flex-1 md:flex-none px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg">
              Get a Quote <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
};
