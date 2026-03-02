import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ShieldCheck, Flame, ChevronDown, ChevronUp, ArrowRight,
    CheckCircle, AlertTriangle, Phone, Package, Award,
    Zap, Clock, Wrench, FileText, Mail, ExternalLink
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const PRODUCTS = [
    {
        id: 'cannula-valve',
        name: 'Firesafe™ Cannula Valve',
        tagline: 'In-circuit fire isolation',
        partNumber: '827-2001',
        description:
            'Fitted directly in the oxygen delivery circuit between the supply source and the patient. Acts as a thermal fuse — when fire heat reaches the device, a spring-loaded valve closes instantly, isolating oxygen flow and extinguishing the fire before it can reach the source.',
        specs: [
            { label: 'Intended Life', value: '5 Years' },
            { label: 'Pack Size', value: '100 Units' },
            { label: 'Box Dimensions', value: '18.6 × 12 × 4 cm' },
            { label: 'Box Weight', value: '0.5 kg' },
            { label: 'Maintenance', value: 'None Required' },
            { label: 'Standard', value: 'ISO 13544-2' },
        ],
        benefits: [
            'Reduces fire spread rate',
            'Protects patients & staff',
            'Maintenance-free',
            'Drop-in circuit fit',
        ],
        color: 'from-orange-500/10 to-red-500/5',
        accent: 'bg-orange-500',
        accentText: 'text-orange-600',
        accentBorder: 'border-orange-200',
        accentBg: 'bg-orange-50',
    },
    {
        id: 'nozzle-diss',
        name: 'Firesafe™ Nozzle – DISS Female',
        tagline: 'Supply interface protection',
        partNumber: '827-0031',
        description:
            'Fitted at the interface between oxygen supply equipment and the delivery circuit. Automatically arrests oxygen flow during a fire. Designed for use with FireSafe™ Flowmeters and compatible oxygen supply devices.',
        specs: [
            { label: 'Intended Life', value: '8 Years' },
            { label: 'Pack Size', value: '20 Units' },
            { label: 'Maintenance', value: 'None Required' },
            { label: 'Connection', value: 'DISS Female' },
        ],
        benefits: [
            'Protects supply source',
            'Auto fire arrest',
            'Longest service life',
            'Flowmeter compatible',
        ],
        color: 'from-cyan-500/10 to-blue-500/5',
        accent: 'bg-cyan-500',
        accentText: 'text-cyan-600',
        accentBorder: 'border-cyan-200',
        accentBg: 'bg-cyan-50',
    },
    {
        id: 'nozzle-mlr',
        name: 'Firesafe™ Nozzle – Male Lock Ring',
        tagline: 'Alternative connector type',
        partNumber: '827-0021',
        description:
            'Identical fire-arrest performance to the DISS Female Nozzle, with a Male Lock Ring connector for compatibility with a wider range of oxygen supply and flowmeter configurations. Automatically isolates oxygen during a fire event.',
        specs: [
            { label: 'Intended Life', value: '8 Years' },
            { label: 'Pack Size', value: '10 Units' },
            { label: 'Maintenance', value: 'None Required' },
            { label: 'Connection', value: 'Male Lock Ring' },
        ],
        benefits: [
            'Broad device compatibility',
            'Auto fire arrest',
            'Same proven mechanism',
            'Flowmeter compatible',
        ],
        color: 'from-purple-500/10 to-indigo-500/5',
        accent: 'bg-purple-500',
        accentText: 'text-purple-600',
        accentBorder: 'border-purple-200',
        accentBg: 'bg-purple-50',
    },
    {
        id: 'admin-kit',
        name: 'Firesafe™ Oxygen Administration Kit',
        tagline: 'All-in-one, ready to fit',
        partNumber: 'Multiple',
        description:
            'Pre-assembled complete oxygen delivery circuit developed in consultation with hospices and care homes across the UK. Includes tubing, mask or cannula, built-in firebreaks, and connectors. Ready to fit — no assembly required by clinical staff.',
        specs: [
            { label: 'Tubing Options', value: '2m / 5m / 9m' },
            { label: 'Valve Config', value: '1 or 2 per kit' },
            { label: 'Delivery Type', value: 'Mask or Cannula' },
            { label: 'Fit By', value: 'Nurse or Carer' },
        ],
        benefits: [
            'Zero assembly needed',
            'Hospice & care home ready',
            'Meets firebreak mandate',
            '6 variants available',
        ],
        color: 'from-emerald-500/10 to-teal-500/5',
        accent: 'bg-emerald-500',
        accentText: 'text-emerald-600',
        accentBorder: 'border-emerald-200',
        accentBg: 'bg-emerald-50',
    },
] as const;

const KIT_VARIANTS = [
    { part: '827-0100', length: '5 metres', valves: '2' },
    { part: '827-0103', length: '2 metres', valves: '2' },
    { part: '827-0105', length: '9 metres', valves: '2' },
    { part: '827-0107', length: '5 metres', valves: '1' },
    { part: '827-0109', length: '2 metres', valves: '1' },
    { part: '827-0111', length: '9 metres', valves: '1' },
];

const FAQS = [
    {
        q: 'Does the Firesafe™ device affect oxygen flow rate?',
        a: 'No. The Firesafe™ Cannula Valve and Nozzles have been carefully designed to minimise resistance to oxygen flow. Even with two valves installed in series, the actual flow deviation is negligible — at a prescribed rate of 5 L/min, the actual flow is approximately 5.05 L/min.',
    },
    {
        q: 'Will the Cannula Valve fit standard oxygen delivery tubing?',
        a: 'Yes, provided ISO 13544-2 compliant connectors are used. This international standard (Respiratory Therapy Tubing and Connectors) prescribes exact dimensions for barb connectors. Standard trumpet connectors from major patient circuit manufacturers are designed to this specification and fit correctly.',
    },
    {
        q: 'Is any maintenance or servicing required?',
        a: 'No. All Firesafe™ devices are completely maintenance-free for their entire intended service life — 5 years for the Cannula Valve and 8 years for the Nozzles. Once installed, no inspection, calibration, or replacement is required until end-of-life.',
    },
    {
        q: 'When should I choose 1 vs 2 Cannula Valves in the Administration Kit?',
        a: 'Choose the 1 Firesafe™ Cannula Valve option if you already have Firesafe™ Nozzles installed with piped oxygen at the supply interface. All other configurations should use the 2-per-kit option to ensure full protection at both the supply and patient end of the circuit.',
    },
    {
        q: 'Where exactly in the circuit should each device be installed?',
        a: 'For oxygen concentrator setups: fit a Firesafe™ Nozzle at the interface between the concentrator oxygen outlet and the delivery tubing — this isolates the supply at source. Then fit a Firesafe™ Cannula Valve close to the patient, normally at the nasal cannula or mask connection. This two-point protection gives maximum coverage of the entire delivery circuit.',
    },
    {
        q: 'Is the Cannula Valve reusable or sterilisable?',
        a: 'No. The Firesafe™ Cannula Valve is a single-use device. It must not be reused on another patient or cleaned internally. The exterior may be wiped with a mild soap solution, taking care not to allow any liquid to enter either orifice. No sterilisation must be attempted at any time.',
    },
];

const TESTIMONIALS = [
    {
        quote:
            'Oxygen is one of the most commonly used medicines at University Hospitals Leicester and, as a highly flammable substance, presents inherent risks. We implemented the deployment of over 3,000 Firesafe nozzles, one for every patient bed across all hospital sites and emergency departments. These devices have proven effective and provide reassurance and peace of mind to our medical engineering team.',
        name: 'Arif Tai',
        title: 'Medical Devices Safety Officer / Section Leader',
        org: 'University Hospitals Leicester',
    },
    {
        quote:
            "We see people who have suffered burns from home oxygen fires all the time. When you look at the results in the UK, you wonder why they are not more widely adopted. Adding a couple of thermal fuses to someone's oxygen equipment seems like a no-brainer to me.",
        name: 'Kevin Raver',
        title: 'Respiratory Therapist',
        org: 'Valley Hospital, USA',
    },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export const FiresafePage: React.FC = () => {
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const toggleProduct = (id: string) =>
        setExpandedProduct(prev => (prev === id ? null : id));

    const toggleFaq = (idx: number) =>
        setExpandedFaq(prev => (prev === idx ? null : idx));

    return (
        <div className="min-h-screen bg-white">

            {/* ════════════════════════════════════════════
                HERO
            ════════════════════════════════════════════ */}
            <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-300 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                                <Award size={10} /> Award Winning
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                                <ShieldCheck size={10} /> Official EU Distributor
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                                <CheckCircle size={10} /> BPR Medical
                            </span>
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none futuristic-font">
                                Firesafe™ Range
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-4">
                                Medical-grade fire safety for oxygen therapy.
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-10 max-w-2xl">
                                The Firesafe™ range automatically isolates oxygen flow and extinguishes fires
                                that track back along oxygen delivery tubing — protecting patients, staff, and
                                infrastructure. As Hylono's official EU distribution partner, we supply the full
                                range for clinical, hospice, and home oxygen settings.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="mailto:info@hylono.com?subject=Firesafe™ Range Enquiry"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-xl shadow-black/20"
                                >
                                    <Mail size={16} /> Request a Quote
                                </a>
                                <button
                                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/15 transition-all"
                                >
                                    View All Products <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                PROBLEM CONTEXT — 3 STAT CARDS
            ════════════════════════════════════════════ */}
            <section className="py-16 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Flame size={24} className="text-orange-500" />,
                                stat: 'Significant',
                                label: 'Number of avoidable deaths',
                                sub: 'Each year, home oxygen fires cause a significant number of preventable deaths across Europe.',
                            },
                            {
                                icon: <AlertTriangle size={24} className="text-amber-500" />,
                                stat: 'Standard',
                                label: 'Firebreaks now required',
                                sub: 'Firebreaks are now a standard safety requirement for oxygen delivery in clinical environments.',
                            },
                            {
                                icon: <ShieldCheck size={24} className="text-emerald-500" />,
                                stat: '3,000+',
                                label: 'Devices at one NHS Trust',
                                sub: 'University Hospitals Leicester deployed over 3,000 Firesafe nozzles across all patient beds.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm"
                            >
                                <div className="mb-4">{item.icon}</div>
                                <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{item.stat}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{item.label}</div>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                HOW IT WORKS
            ════════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 block mb-4">Mechanism</span>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How Firesafe™ Works</h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
                                A passive, spring-loaded thermal mechanism. No power, no electronics, no maintenance — just physics.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: <Flame size={28} className="text-orange-500" />,
                                title: 'Fire Ignites',
                                desc: 'A fire starts in the oxygen delivery tubing near the patient. In an oxygen-enriched environment, fires can track back rapidly toward the supply source.',
                                color: 'bg-orange-50 border-orange-100',
                            },
                            {
                                step: '02',
                                icon: <Zap size={28} className="text-amber-500" />,
                                title: 'Fusible Ledge Activates',
                                desc: 'As heat reaches the Firesafe™ device, a fusible ledge inside softens. This releases a spring-loaded valve probe held in the open position by a T-bar arrangement.',
                                color: 'bg-amber-50 border-amber-100',
                            },
                            {
                                step: '03',
                                icon: <ShieldCheck size={28} className="text-emerald-500" />,
                                title: 'Oxygen Isolated',
                                desc: 'The valve closes instantly, cutting off oxygen flow. The fire is starved of fuel and extinguished before it can reach the supply source or spread further.',
                                color: 'bg-emerald-50 border-emerald-100',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`relative rounded-3xl p-8 border ${item.color}`}
                            >
                                <span className="absolute top-6 right-6 text-6xl font-black text-black/5 leading-none select-none">{item.step}</span>
                                <div className="mb-5">{item.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Technical note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-10 p-6 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4"
                    >
                        <div className="shrink-0 w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                            <CheckCircle size={18} className="text-cyan-400" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-1">Technical Note</span>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The Firesafe™ mechanism introduces negligible flow resistance. With two valves installed in series,
                                the actual oxygen flow at 5 L/min reads approximately 5.05 L/min — a &lt;1% deviation with no
                                clinical significance. ISO 13544-2 compliant connections throughout.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                PRODUCTS
            ════════════════════════════════════════════ */}
            <section id="products" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 block mb-4">Product Range</span>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Four Devices, Complete Protection</h2>
                            <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed">
                                From individual circuit components to all-in-one kits — we supply the full Firesafe™ range.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {PRODUCTS.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                            >
                                {/* Card Header */}
                                <div className={`p-8 bg-gradient-to-br ${product.color}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`w-2 h-2 rounded-full ${product.accent}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${product.accentText}`}>
                                                    {product.tagline}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                                            {product.partNumber && (
                                                <span className="text-[10px] text-slate-400 font-mono">Part: {product.partNumber}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleProduct(product.id)}
                                            className="shrink-0 w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 transition-all"
                                            aria-label={expandedProduct === product.id ? 'Collapse details' : 'Expand details'}
                                            aria-expanded={expandedProduct === product.id}
                                        >
                                            {expandedProduct === product.id
                                                ? <ChevronUp size={18} />
                                                : <ChevronDown size={18} />}
                                        </button>
                                    </div>

                                    <p className="text-sm text-slate-600 leading-relaxed mt-4">{product.description}</p>

                                    {/* Benefits pills */}
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {product.benefits.map(b => (
                                            <span key={b} className={`text-[10px] font-bold px-3 py-1 rounded-full ${product.accentBg} ${product.accentText} border ${product.accentBorder}`}>
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Expandable Specs */}
                                <AnimatePresence>
                                    {expandedProduct === product.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-8 border-t border-slate-100">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-5">Specifications</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {product.specs.map(spec => (
                                                        <div key={spec.label} className="bg-slate-50 rounded-xl p-4">
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">{spec.label}</span>
                                                            <span className="text-base font-bold text-slate-900">{spec.value}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Kit variant table */}
                                                {product.id === 'admin-kit' && (
                                                    <div className="mt-6">
                                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Kit Variants</h4>
                                                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                                                            <table className="w-full text-sm">
                                                                <thead>
                                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                                        <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Part No.</th>
                                                                        <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Tubing</th>
                                                                        <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-3">Valves</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {KIT_VARIANTS.map((v, idx) => (
                                                                        <tr key={v.part} className={`border-b border-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                                                            <td className="px-4 py-3 font-mono text-xs text-slate-700">{v.part}</td>
                                                                            <td className="px-4 py-3 text-slate-700">{v.length}</td>
                                                                            <td className="px-4 py-3 text-slate-700">{v.valves}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 mt-3 italic">
                                                            * Use 1-valve kits only if Firesafe™ Nozzles are already installed at the piped oxygen supply.
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                                                    <Package size={14} />
                                                    <span>Contact us to confirm availability and bulk pricing for your region.</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                TESTIMONIALS
            ════════════════════════════════════════════ */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 block mb-4">Clinical Experience</span>
                            <h2 className="text-3xl font-black text-white tracking-tight">Trusted by Healthcare Professionals</h2>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8"
                            >
                                <div className="text-4xl text-cyan-500/30 font-black leading-none mb-4 select-none">"</div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">{t.quote}</p>
                                <div className="border-t border-slate-700/50 pt-5">
                                    <span className="font-bold text-white block">{t.name}</span>
                                    <span className="text-xs text-slate-400 block mt-1">{t.title}</span>
                                    <span className="text-xs text-cyan-400 font-bold mt-1 block">{t.org}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                FAQ
            ════════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 block mb-4">FAQ</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Common Questions</h2>
                        </motion.div>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.06 }}
                                className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                    aria-expanded={expandedFaq === idx}
                                >
                                    <span className="font-bold text-slate-900 text-sm pr-4 group-hover:text-cyan-600 transition-colors">{faq.q}</span>
                                    {expandedFaq === idx
                                        ? <ChevronUp size={18} className="text-slate-400 shrink-0" />
                                        : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                </button>
                                <AnimatePresence>
                                    {expandedFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                WHITE PAPERS
            ════════════════════════════════════════════ */}
            <section className="py-16 bg-slate-50 border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 block mb-3">Research</span>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">White Papers from BPR Medical</h2>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            {
                                title: 'A Risk-based Approach to Safer Home Oxygen Delivery',
                                desc: 'How firebreaks could help the home oxygen industry reduce the medical and financial burden of oxygen fires.',
                                href: 'https://www.bprmedical.com/products/firesafe/',
                            },
                            {
                                title: 'The Under-reported Problem of Home Oxygen Fires in Europe',
                                desc: 'Each year, home oxygen fires cause a significant number of avoidable deaths and severe burn-related injuries across Europe.',
                                href: 'https://www.bprmedical.com/products/firesafe/',
                            },
                        ].map((paper, i) => (
                            <motion.a
                                key={i}
                                href={paper.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex gap-5 bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all"
                            >
                                <div className="shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                                    <FileText size={20} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug group-hover:text-cyan-600 transition-colors">{paper.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{paper.desc}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-500">
                                        Download via BPR Medical <ExternalLink size={10} />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                ENQUIRY CTA
            ════════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <ShieldCheck size={28} className="text-cyan-400" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-5 tracking-tight">
                            Enquire About Firesafe™
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-xl mx-auto">
                            As Hylono's official EU distribution partner for the Firesafe™ range, we can help you
                            select the right products for your facility, provide volume pricing, and arrange
                            delivery across Europe. Contact us to discuss your requirements.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="mailto:info@hylono.com?subject=Firesafe™ Enquiry"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                            >
                                <Mail size={16} /> Email Us
                            </a>
                            <a
                                href="tel:+441234567890"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-sm hover:border-slate-400 transition-all"
                            >
                                <Phone size={16} /> Speak to an Expert
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span>EU-wide delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span>Volume pricing available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span>Full product documentation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span>Official BPR Medical distributor</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Medical disclaimer */}
            <div className="py-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                        Firesafe™ is a registered trademark of BPR Medical Ltd. Hylono is an authorised EU distributor. All product information is provided for reference purposes. Product specifications and availability are subject to change. Contact us for current pricing and availability in your region.
                    </p>
                </div>
            </div>
        </div>
    );
};

