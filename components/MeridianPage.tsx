"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useMotionTemplate, useInView, AnimatePresence, type MotionValue } from 'framer-motion';

// --- DESIGN SYSTEM & CONSTANTS ---
const COLORS = {
    ivory: '#F6F3EC',
    mist: '#EBF0E8',
    parchment: '#EDE8DC',
    botanical: '#1B4332',
    living: '#40916C',
    copper: '#B07156',
    textPrimary: '#1C1C1A',
    textSecondary: '#7A7768',
    textTertiary: '#A8A392',
    divider: '#D8D3C7',
    modalities: {
        oxygen: '#D4E8F0',
        hydrogen: '#E6DFF0',
        light: '#F5E6DB',
        signal: '#DAE8DE'
    }
};

const FONTS = {
    display: '"Cormorant Garamond", serif',
    ui: '"Space Grotesk", sans-serif',
    body: '"Source Sans 3", sans-serif',
    mono: '"JetBrains Mono", monospace'
};

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1]; // "Quiet Precision"

// --- UTILITY COMPONENTS ---

const Section = ({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) => {
    return (
        <section id={id} className={`relative w-full ${className}`}>
            {children}
        </section>
    );
};

const Reveal = ({ children, delay = 0, width = "100%" }: { children: React.ReactNode; delay?: number; width?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} style={{ width, overflow: 'hidden' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.0, delay, ease: EASING }}
            >
                {children}
            </motion.div>
        </div>
    );
};

const SplitText = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
    const words = text.split(" ");
    return (
        <span className={`${className} inline-block`}>
            {words.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: delay + i * 0.05, ease: EASING }}
                        className="inline-block"
                    >
                        {word}&nbsp;
                    </motion.span>
                </span>
            ))}
        </span>
    );
};

// --- PATHWAY LINE COMPONENT ---
const PathwayLine = () => {
    const { scrollYProgress } = useScroll();
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Nodes positions (approximate scroll percentages for major sections)
    const nodes = [0.05, 0.15, 0.28, 0.45, 0.60, 0.75, 0.90];

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5] hidden lg:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
                <motion.path
                    ref={pathRef}
                    d="M 120 0 C 120 100, 100 200, 120 300 C 140 400, 120 500, 100 600 C 80 700, 120 800, 120 1000 C 120 1200, 140 1400, 100 1600 C 60 1800, 120 2000, 120 2200 C 120 2400, 100 2600, 120 2800 C 140 3000, 120 3200, 100 3400 V 5000"
                    fill="none"
                    stroke={COLORS.living}
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    strokeDasharray={pathLength}
                    style={{ pathLength: draw }}
                />
                {nodes.map((pos, i) => (
                    <Node key={`node-${pos}-${i}`} scrollProgress={scrollYProgress} triggerPos={pos} />
                ))}
            </svg>
        </div>
    );
};

const Node = ({ scrollProgress, triggerPos }: { scrollProgress: MotionValue<number>; triggerPos: number }) => {
    const [active, setActive] = useState(false);

    useTransform(scrollProgress, (latest) => {
        if (latest > triggerPos && !active) setActive(true);
    });

    return (
        <motion.g
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* We need fixed positions for SVG nodes based on the path. For simplicity in this demo, 
                 we'll approximate Y positions. In a real math-heavy implementation we'd use getPointAtLength.
                 Here we assume 5000px height for path logic correlation */}
            <circle cx="120" cy={triggerPos * 5000} r="6" fill={COLORS.botanical} />
            <motion.circle
                cx="120"
                cy={triggerPos * 5000}
                r="6"
                stroke={COLORS.botanical}
                strokeWidth="1"
                fill="none"
                animate={active ? { r: [6, 20], opacity: [1, 0] } : {}}
                transition={{ duration: 1.5, repeat: 0 }}
            />
        </motion.g>
    );
};

// --- MAIN PAGE COMPONENT ---

export const MeridianPage = () => {
    const router = useRouter();

    // Inject Fonts
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Space+Grotesk:wght@500;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    const { scrollY } = useScroll();
    const navBorderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
    const navBorderColor = useMotionTemplate`rgba(216, 211, 199, ${navBorderOpacity})`;

    const navigateTo = (path: string) => {
        router.push(path);
        window.scrollTo(0, 0);
    };

    return (
        <div className="w-full min-h-screen bg-[#F6F3EC] overflow-x-hidden selection:bg-[#B07156] selection:text-white"
            style={{ fontFamily: FONTS.body, color: COLORS.textPrimary }}>

            <PathwayLine />

            {/* --- NAV --- */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 backdrop-blur-md bg-[#F6F3EC]/90"
                style={{ borderBottom: '1px solid', borderBottomColor: navBorderColor }}
            >
                {/* Back to Home + Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        aria-label="Go back"
                        style={{ fontFamily: FONTS.ui, fontSize: '12px', color: COLORS.textSecondary, letterSpacing: '1px' }}
                        className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
                    >
                        ← BACK
                    </button>
                    <div style={{ width: '1px', height: '16px', backgroundColor: COLORS.divider }} className="hidden md:block" />
                    <span style={{ fontFamily: FONTS.display, fontSize: '18px', fontWeight: 600, letterSpacing: '1px', color: COLORS.botanical }}>
                        hylono<span style={{ color: COLORS.copper }}>●</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {['ECOSYSTEM', 'ACCESS', 'STANDARDS', 'PROFESSIONALS'].map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium tracking-[1.5px] text-[#7A7768] hover:text-[#1B4332] transition-colors" style={{ fontFamily: FONTS.ui }}>
                            {item}
                        </a>
                    ))}
                    <div className="h-4 w-[1px] bg-[#D8D3C7]"></div>
                    <button className="bg-[#1B4332] text-[#F6F3EC] px-5 py-2 text-[13px] font-bold tracking-[1.5px] hover:bg-[#40916C] transition-colors duration-300" style={{ fontFamily: FONTS.ui }}>
                        BEGIN
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden font-mono text-xs tracking-widest text-[#1B4332]">MENU</div>
            </motion.nav>


            {/* --- HERO --- */}
            <Section className="min-h-screen pt-20 flex flex-col md:flex-row relative">
                {/* Left Text Zone */}
                <div className="w-full md:w-[55%] flex flex-col justify-center px-6 md:pl-[140px] md:pr-12 py-20 relative z-10">
                    <div className="font-mono text-xs text-[#B07156] mb-8 tracking-wider">
                        EST. 2024 — AMSTERDAM, NL — REGENERATION ACCESS INFRASTRUCTURE
                    </div>

                    <h1 className="text-[42px] md:text-[72px] leading-[1.08] text-[#1C1C1A] mb-8 max-w-[620px]" style={{ fontFamily: FONTS.display, fontWeight: 300 }}>
                        <SplitText text="The architecture of" /> <br />
                        <span style={{ color: COLORS.botanical }}><SplitText text="regeneration," delay={0.2} /></span> <br />
                        <SplitText text="made accessible." delay={0.4} />
                    </h1>

                    <p className="text-[18px] text-[#7A7768] leading-[1.7] max-w-[460px] mb-10">
                        Hylono verifies the world's most advanced non-invasive regeneration technologies, designs outcome-driven protocols around them, and makes everything accessible through rental and subscription — never requiring you to purchase a single device.
                    </p>

                    <div className="flex flex-col items-start gap-4">
                        <a href="#ecosystem" className="group flex items-center gap-4 text-[17px] text-[#1B4332] italic hover:gap-6 transition-all duration-300" style={{ fontFamily: FONTS.display }}>
                            <span className="relative">
                                Explore the Protocol Ecosystem
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#40916C] group-hover:w-full transition-all duration-500"></span>
                            </span>
                            →
                        </a>
                        <a href="#access" className="group flex items-center gap-4 text-[17px] text-[#7A7768] italic hover:text-[#1B4332] hover:gap-6 transition-all duration-300" style={{ fontFamily: FONTS.display }}>
                            <span>How Hylono Access Works</span>
                            →
                        </a>
                    </div>
                </div>

                {/* Right Visual Zone */}
                <div className="w-full md:w-[45%] h-[50vh] md:h-screen sticky top-0 md:relative flex items-center justify-center overflow-hidden bg-[#FBFBF9]">
                    <div className="relative w-full h-full max-w-[600px] max-h-[800px]">
                        {/* Parallax Panels */}
                        <ParallaxPanel color={COLORS.modalities.oxygen} speed={0.02} z={1} label="O₂" />
                        <ParallaxPanel color={COLORS.modalities.hydrogen} speed={0.04} z={2} label="H₂" offset="20%" />
                        <ParallaxPanel color={COLORS.modalities.light} speed={0.06} z={3} label="λ" offset="40%" align="right" />
                        <ParallaxPanel color={COLORS.modalities.signal} speed={0.08} z={4} label="Hz" offset="10%" align="center" top="10%" />
                    </div>
                    {/* Scroll Hint */}
                    <div className="absolute bottom-8 right-8 font-mono text-[11px] text-[#A8A392] animate-pulse">
                        SCROLL TO NAVIGATE THE MERIDIAN ↓
                    </div>
                </div>
            </Section>

            {/* --- THESIS --- */}
            <Section className="bg-[#EBF0E8] py-32 md:py-48 relative">
                <div className="max-w-[1280px] mx-auto px-6 md:pl-[300px] relative">
                    <div className="absolute left-6 md:left-[140px] top-32 text-[96px] text-[#B07156]/20 font-light" style={{ fontFamily: FONTS.display }}>01</div>

                    <div className="max-w-[680px] ml-auto">
                        <div className="font-sans text-xs font-bold text-[#1B4332] tracking-[3px] mb-6">THE THESIS</div>
                        <Reveal>
                            <h2 className="text-[38px] leading-[1.15] text-[#1C1C1A] font-semibold mb-8" style={{ fontFamily: FONTS.display }}>
                                The regeneration revolution has a trust problem and an access problem. Hylono solves both.
                            </h2>
                        </Reveal>

                        <div className="space-y-6 text-[#7A7768] text-[16.5px] leading-[1.75]">
                            <Reveal delay={0.1}>
                                <p>Non-invasive regeneration technologies — hyperbaric oxygen, molecular hydrogen, red light therapy, pulsed electromagnetic fields — have crossed the threshold from experimental to evidence-supported. The biological mechanisms are increasingly well understood. The hardware exists.</p>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <p>But the market has outpaced the infrastructure of trust. Thousands of devices make overlapping claims. Pricing is opaque. Quality variance is enormous. And the capital cost of even one professional-grade device locks out the vast majority of individuals and practitioners who could benefit most.</p>
                            </Reveal>
                            <Reveal delay={0.3}>
                                <p>Hylono is neither a manufacturer nor a retailer. We are the verification and access infrastructure. We test the hardware. We design the protocols. We deploy the technology through models that require zero capital investment. We are the layer that makes the revolution trustworthy — and reachable.</p>
                            </Reveal>
                        </div>

                        <Reveal delay={0.4}>
                            <div className="mt-12 pl-6 border-l-[3px] border-[#B07156]">
                                <p className="text-[22px] italic text-[#1B4332] leading-[1.5]" style={{ fontFamily: FONTS.display }}>
                                    "We do not sell devices. We architect access to outcomes."
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </Section>


            {/* --- ECOSYSTEM --- */}
            <Section id="ecosystem" className="bg-[#F6F3EC] py-32 md:py-48">
                <div className="max-w-[1280px] mx-auto px-6 md:pl-[140px]">
                    <div className="mb-24 relative">
                        <div className="absolute left-[-100px] top-0 text-[96px] text-[#B07156]/20 font-light hidden xl:block" style={{ fontFamily: FONTS.display }}>02</div>
                        <div className="font-sans text-xs font-bold text-[#1B4332] tracking-[3px] mb-4">THE ECOSYSTEM</div>
                        <h2 className="text-[42px] font-light text-[#1C1C1A] mb-4" style={{ fontFamily: FONTS.display }}>
                            Four biological pathways. One integrated architecture.
                        </h2>
                        <p className="text-[17px] text-[#7A7768]">Each modality in the Hylono ecosystem addresses a distinct regenerative mechanism. Our protocols combine them.</p>
                    </div>

                    {/* Modality 1: Oxygen */}
                    <ModalityBand
                        id="01" name="Oxygen" sub="Mild Hyperbaric Therapy"
                        desc="Mild hyperbaric oxygen therapy (mHBOT) creates a controlled pressurized environment that allows oxygen to dissolve into plasma, cerebrospinal fluid, and tissues at concentrations beyond normal respiratory capacity."
                        specs={[
                            { label: "PRESSURE RANGE", val: "1.3 to 1.5 ATA" },
                            { label: "SESSION PROTOCOL", val: "60-90 min, 3-5x weekly" },
                            { label: "PRIMARY PATHWAY", val: "Tissue oxygenation & repair" }
                        ]}
                        visualColor={COLORS.modalities.oxygen}
                        VisualComponent={OxygenVisual}
                    />

                    <Separator />

                    {/* Modality 2: Hydrogen (Reversed) */}
                    <ModalityBand
                        id="02" name="Hydrogen" sub="Molecular H₂ Therapy"
                        desc="Molecular hydrogen (H₂) is the smallest and most bioavailable antioxidant molecule. Delivered through inhalation or hydrogen-rich water, it selectively neutralizes hydroxyl radicals."
                        specs={[
                            { label: "DELIVERY", val: "Inhalation & dissolved water" },
                            { label: "CONCENTRATION", val: "2-4% H₂ gas blend" },
                            { label: "PRIMARY PATHWAY", val: "Selective antioxidant action" }
                        ]}
                        visualColor={COLORS.modalities.hydrogen}
                        reversed
                        VisualComponent={HydrogenVisual}
                    />

                    <Separator />

                    {/* Modality 3: Light */}
                    <ModalityBand
                        id="03" name="Light" sub="Red & Near-Infrared Therapy"
                        desc="Photobiomodulation delivers specific wavelengths of red (630-670nm) and near-infrared (810-850nm) light to mitochondrial chromophores — primarily cytochrome c oxidase."
                        specs={[
                            { label: "WAVELENGTHS", val: "630nm, 660nm, 810nm, 850nm" },
                            { label: "IRRADIANCE", val: "50-120 mW/cm² at skin" },
                            { label: "PRIMARY PATHWAY", val: "Mitochondrial bioenergetics" }
                        ]}
                        visualColor={COLORS.modalities.light}
                        VisualComponent={LightVisual}
                    />

                    <Separator />

                    {/* Modality 4: Signal (Reversed) */}
                    <ModalityBand
                        id="04" name="Signal" sub="PEMF & Vagal Nerve Stimulation"
                        desc="Pulsed electromagnetic field therapy and transcutaneous vagal nerve stimulation deliver targeted electromagnetic and bioelectric signals that modulate cellular ion channels and influence autonomic nervous system balance."
                        specs={[
                            { label: "FREQUENCIES", val: "0.5-64 Hz (PEMF) | 25 kHz (VNS)" },
                            { label: "FIELD INTENSITY", val: "0.5 to 100 µT" },
                            { label: "PRIMARY PATHWAY", val: "Autonomic & cellular signaling" }
                        ]}
                        visualColor={COLORS.modalities.signal}
                        reversed
                        VisualComponent={SignalVisual}
                    />

                    <div className="mt-24 p-12 bg-[#EBF0E8] text-center">
                        <p className="text-[26px] italic text-[#1B4332] leading-[1.5] max-w-[640px] mx-auto" style={{ fontFamily: FONTS.display }}>
                            "No single modality is a complete protocol. The architecture of regeneration is combinatorial — oxygen for fuel, hydrogen for protection, light for energy, signal for regulation. Hylono integrates all four."
                        </p>
                    </div>
                </div>
            </Section>


            {/* --- ACCESS MODELS --- */}
            <Section id="access" className="bg-[#F6F3EC] py-32">
                <div className="max-w-[1280px] mx-auto px-6 md:pl-[140px]">
                    <div className="mb-16">
                        <div className="text-[96px] text-[#B07156]/20 font-light hidden xl:block absolute left-[60px]" style={{ fontFamily: FONTS.display }}>03</div>
                        <div className="font-sans text-xs font-bold text-[#1B4332] tracking-[3px] mb-4">ACCESS ARCHITECTURE</div>
                        <h2 className="text-[42px] font-light text-[#1C1C1A]" style={{ fontFamily: FONTS.display }}>
                            Zero capital. Full capability. Choose your deployment model.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#D8D3C7]">
                        {/* Model A */}
                        <div className="border-l border-r border-[#D8D3C7] p-8 md:p-12 hover:bg-[#FAF9F5] transition-colors duration-500">
                            <div className="font-mono text-[11px] text-[#B07156] mb-4">MODEL A</div>
                            <h3 className="text-[24px] font-bold text-[#1C1C1A] mb-1" style={{ fontFamily: FONTS.ui }}>Explore</h3>
                            <div className="text-[13px] font-medium tracking-[2px] text-[#40916C] mb-6">SHORT-TERM RENTAL</div>
                            <div className="w-[40px] h-[1px] bg-[#1B4332] mb-6"></div>
                            <p className="text-[15px] text-[#7A7768] leading-[1.7] mb-8">Evaluate any technology in the Hylono ecosystem with zero commitment. Rental periods from 14 days to 90 days.</p>
                            <ul className="space-y-4 mb-8">
                                {['No contract or minimum', 'Professional-grade hardware', 'Guided onboarding', 'Credit toward subscription'].map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-[14px] text-[#7A7768]">
                                        <span className="mt-1.5 w-1 h-1 bg-[#40916C]"></span>{f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigateTo('/rental')} className="font-serif italic text-[15px] text-[#1B4332] hover:text-[#40916C] bg-transparent border-none cursor-pointer">Request Rental Access →</button>
                        </div>

                        {/* Model B */}
                        <div className="border-r border-[#D8D3C7] p-8 md:p-12 bg-[#E8EDE5] relative">
                            <div className="absolute top-0 left-0 w-full bg-[#1B4332] text-[#F6F3EC] text-center text-[10px] font-mono py-1 tracking-widest">RECOMMENDED FOR MOST USERS</div>
                            <div className="mt-6 font-mono text-[11px] text-[#B07156] mb-4">MODEL B</div>
                            <h3 className="text-[24px] font-bold text-[#1C1C1A] mb-1" style={{ fontFamily: FONTS.ui }}>Commit</h3>
                            <div className="text-[13px] font-medium tracking-[2px] text-[#40916C] mb-6">PROTOCOL SUBSCRIPTION</div>
                            <div className="w-[40px] h-[1px] bg-[#1B4332] mb-6"></div>
                            <p className="text-[15px] text-[#7A7768] leading-[1.7] mb-8">Subscribe to a complete regeneration protocol — hardware, guidance, and evolution included. This is not a lease.</p>
                            <ul className="space-y-4 mb-8">
                                {['Verified hardware included', 'Quarterly protocol evolution', 'Priority access to new tech', 'Swap hardware any cycle', 'Cancel w/ 30-day notice'].map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-[14px] text-[#7A7768]">
                                        <span className="mt-1.5 w-1 h-1 bg-[#40916C]"></span>{f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 bg-[#1B4332] text-[#F6F3EC] text-[13px] font-bold uppercase tracking-wider hover:bg-[#40916C] transition-colors">Design Your Protocol →</button>
                        </div>

                        {/* Model C */}
                        <div className="border-r border-[#D8D3C7] p-8 md:p-12 hover:bg-[#FAF9F5] transition-colors duration-500">
                            <div className="font-mono text-[11px] text-[#B07156] mb-4">MODEL C</div>
                            <h3 className="text-[24px] font-bold text-[#1C1C1A] mb-1" style={{ fontFamily: FONTS.ui }}>Deploy</h3>
                            <div className="text-[13px] font-medium tracking-[2px] text-[#40916C] mb-6">PROFESSIONAL INTEGRATION</div>
                            <div className="w-[40px] h-[1px] bg-[#1B4332] mb-6"></div>
                            <p className="text-[15px] text-[#7A7768] leading-[1.7] mb-8">For clinics, wellness practices, and corporate programs. Deploy a verified stack with compliance and training.</p>
                            <ul className="space-y-4 mb-8">
                                {['Multi-device fleet', 'Staff training & certification', 'Full compliance docs', 'Co-branded materials', 'Dedicated account support'].map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-[14px] text-[#7A7768]">
                                        <span className="mt-1.5 w-1 h-1 bg-[#40916C]"></span>{f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigateTo('/contact')} className="font-serif italic text-[15px] text-[#1B4332] hover:text-[#40916C] bg-transparent border-none cursor-pointer">Discuss Deployment →</button>
                        </div>
                    </div>
                </div>
            </Section>


            {/* --- TRUST INFRASTRUCTURE --- */}
            <Section id="standards" className="bg-[#EDE8DC] py-32">
                <div className="max-w-[1280px] mx-auto px-6 text-center">
                    <div className="font-sans text-xs font-bold text-[#1B4332] tracking-[3px] mb-4">TRUST INFRASTRUCTURE</div>
                    <h2 className="text-[38px] font-light text-[#1C1C1A] mb-16" style={{ fontFamily: FONTS.display }}>
                        Verification is not a feature. It is the foundation.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[1020px] mx-auto">
                        {[
                            { num: 'I', title: 'HARDWARE AUDIT', desc: 'Every device undergoes independent performance benchmarking against published clinical parameters.' },
                            { num: 'II', title: 'PROTOCOL DESIGN', desc: 'Protocols constructed from peer-reviewed research and clinical dosimetry guidelines.' },
                            { num: 'III', title: 'SAFETY COMPLIANCE', desc: 'Full regulatory alignment verification including CE marking and electrical safety.' },
                            { num: 'IV', title: 'LIFECYCLE MONITORING', desc: 'Post-deployment tracking, maintenance, and firmware management.' }
                        ].map((card) => (
                            <div key={card.num} className="bg-[#F6F3EC] p-8 border border-[#D8D3C7] text-left h-full">
                                <div className="text-[64px] font-light text-[#B07156] mb-6" style={{ fontFamily: FONTS.display }}>{card.num}</div>
                                <h4 className="text-[16px] font-bold text-[#1C1C1A] tracking-wider mb-3" style={{ fontFamily: FONTS.ui }}>{card.title}</h4>
                                <div className="w-[32px] h-[1px] bg-[#B07156] mb-4"></div>
                                <p className="text-[14px] text-[#7A7768] leading-[1.65]">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center items-center gap-4 text-[11px] font-mono text-[#A8A392] tracking-[2px]">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#40916C]"></div> CE VERIFIED</span> —
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#40916C]"></div> ISO ALIGNED</span> —
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#40916C]"></div> EMC TESTED</span> —
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#40916C]"></div> HYLONO CERTIFIED</span>
                    </div>
                </div>
            </Section>


            {/* --- CONVICTION --- */}
            <Section className="bg-[#F6F3EC] py-48 text-center">
                <div className="max-w-[600px] mx-auto px-6">
                    <div className="flex justify-center items-center gap-1 mb-12">
                        <span style={{ fontFamily: FONTS.display, fontSize: '16px', color: COLORS.botanical }}>
                            hylono<span style={{ color: COLORS.copper }}>●</span>
                        </span>
                    </div>

                    <div className="space-y-8 text-[34px] font-light text-[#1C1C1A] leading-[1.4]" style={{ fontFamily: FONTS.display }}>
                        <p>Regeneration is not a luxury market.</p>
                        <p>It is a biological infrastructure problem.</p>
                        <p>The technologies exist. The trust layer did not. The access layer did not.</p>
                        <p>Now they do.</p>
                    </div>

                    <div className="mt-12 font-mono text-[11px] text-[#B07156] tracking-[3px]">
                        — HYLONO FOUNDING CONVICTION, 2024
                    </div>
                </div>
            </Section>

            {/* --- FINAL CTA --- */}
            <Section className="bg-[#1B4332] py-32">
                <div className="max-w-[1280px] mx-auto px-6 md:pl-[140px] grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-[40px] font-light text-[#F6F3EC] mb-6" style={{ fontFamily: FONTS.display }}>
                            Your access point to verified regeneration begins here.
                        </h2>
                        <p className="text-[16px] text-[#F6F3EC]/60 leading-[1.6]">
                            Whether you are an individual ready to explore your first protocol or a professional preparing to deploy regeneration technology into your practice — the pathway is open.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Individual CTA */}
                        <button onClick={() => navigateTo('/store')} className="group block bg-[#40916C] p-8 hover:bg-[#4DA677] transition-colors duration-300 w-full text-left border-none cursor-pointer">
                            <div className="font-mono text-[11px] text-white/60 mb-2">FOR INDIVIDUALS</div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-[20px] font-bold text-white" style={{ fontFamily: FONTS.ui }}>Explore Personal Protocols</h3>
                                <span className="text-white transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </button>
                        {/* Professional CTA */}
                        <button onClick={() => navigateTo('/partner')} className="group block border-[2px] border-[#F6F3EC]/40 p-8 hover:bg-[#F6F3EC]/5 hover:border-[#F6F3EC] transition-all duration-300 w-full text-left bg-transparent cursor-pointer">
                            <div className="font-mono text-[11px] text-[#F6F3EC]/60 mb-2">FOR PROFESSIONALS</div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-[20px] font-bold text-[#F6F3EC]" style={{ fontFamily: FONTS.ui }}>Discuss Deployment</h3>
                                <span className="text-white transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </button>
                    </div>
                </div>
            </Section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#1C1C1A] text-[#F6F3EC] pt-20 pb-12">
                <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-1">
                        <div className="flex items-center gap-1 mb-4">
                            <span style={{ fontFamily: FONTS.display, fontSize: '18px', color: '#F6F3EC', opacity: 0.8 }}>
                                hylono<span style={{ color: COLORS.copper }}>●</span>
                            </span>
                        </div>
                        <p className="font-serif italic text-[13px] opacity-35 mb-6">Where mind connects with matter.</p>
                        <p className="font-mono text-[11px] opacity-25">AMSTERDAM, NL · EUROPE</p>
                    </div>

                    {/* Columns */}
                    {[
                        {
                            title: 'ECOSYSTEM',
                            links: [
                                { label: 'Oxygen — mHBOT', href: '/product/HBOT' },
                                { label: 'Hydrogen — H₂', href: '/product/HYDROGEN' },
                                { label: 'Light — RLT', href: '/product/RLT' },
                                { label: 'Signal — PEMF/VNS', href: '/product/PEMF' },
                                { label: 'Protocol Integration', href: '/protocols' },
                            ]
                        },
                        {
                            title: 'ACCESS',
                            links: [
                                { label: 'Rental — Explore', href: '/rental' },
                                { label: 'Subscription — Commit', href: '/rental' },
                                { label: 'Professional — Deploy', href: '/contact' },
                                { label: 'Pricing Architecture', href: '/store' },
                            ]
                        },
                        {
                            title: 'COMPANY',
                            links: [
                                { label: 'About Hylono', href: '/about' },
                                { label: 'Trust Infrastructure', href: '/about' },
                                { label: 'Research References', href: '/research' },
                                { label: 'Journal', href: '/blog' },
                                { label: 'Contact', href: '/contact' },
                            ]
                        }
                    ].map((col) => (
                        <div key={col.title}>
                            <h5 className="font-mono text-[11px] tracking-[2px] opacity-35 font-bold mb-6">{col.title}</h5>
                            <ul className="space-y-4">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => navigateTo(link.href)}
                                            className="text-[14px] opacity-55 hover:opacity-90 bg-transparent border-none cursor-pointer text-left"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h5 className="font-mono text-[11px] tracking-[2px] opacity-35 font-bold mb-6">CONNECT</h5>
                        <ul className="space-y-4 mb-8">
                            <li><a href="https://linkedin.com/company/hylono" target="_blank" rel="noopener noreferrer" className="text-[14px] opacity-55 hover:opacity-90">LinkedIn</a></li>
                            <li><a href="https://instagram.com/hylono" target="_blank" rel="noopener noreferrer" className="text-[14px] opacity-55 hover:opacity-90">Instagram</a></li>
                        </ul>
                        <div className="flex">
                            <label htmlFor="meridian-footer-email" className="sr-only">Email address</label>
                            <input
                                id="meridian-footer-email"
                                type="email"
                                placeholder="your@email.com"
                                aria-label="Email address for newsletter"
                                className="bg-[#2A2A28] border-none text-[13px] px-3 w-full font-mono placeholder:opacity-25 text-[#F6F3EC] focus:ring-1 focus:ring-[#40916C]"
                            />
                            <button
                                type="button"
                                aria-label="Subscribe to newsletter"
                                className="bg-[#1B4332] w-12 flex items-center justify-center hover:bg-[#40916C] transition-colors"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1280px] mx-auto px-6 pt-8 border-t border-[#333330] flex justify-between items-center text-[11px] font-mono opacity-20">
                    <div>© 2026 HYLONO SYSTEMS. All rights reserved.</div>
                    <div className="flex gap-6">
                        <button onClick={() => navigateTo('/privacy')} className="hover:opacity-100 bg-transparent border-none cursor-pointer">Privacy</button>
                        <button onClick={() => navigateTo('/terms')} className="hover:opacity-100 bg-transparent border-none cursor-pointer">Terms</button>
                        <button onClick={() => navigateTo('/cookie-policy')} className="hover:opacity-100 bg-transparent border-none cursor-pointer">Cookies</button>
                    </div>
                </div>
            </footer>

        </div>
    );
};


// --- SUBCOMPONENTS FOR SECTIONS ---

interface ModalitySpec {
    label: string;
    val: string;
}

interface ModalityBandProps {
    id: string;
    name: string;
    sub: string;
    desc: string;
    specs: ModalitySpec[];
    visualColor: string;
    reversed?: boolean;
    VisualComponent: React.FC<{ color: string }>;
}

const ModalityBand = ({ id, name, sub, desc, specs, visualColor, reversed = false, VisualComponent }: ModalityBandProps) => {
    const router = useRouter();

    return (
        <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 py-16 items-center`}>
            {/* Visual */}
            <div className="w-full md:w-2/5 aspect-[4/3] relative overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-white/50 to-transparent" style={{ backgroundColor: visualColor }}>
                <VisualComponent color="#1B4332" />
            </div>

            {/* Text */}
            <div className="w-full md:w-3/5">
                <div className="font-mono text-[11px] text-[#B07156] mb-3">MODALITY {id} OF 04</div>
                <h3 className="text-[32px] font-semibold text-[#1C1C1A] mb-4" style={{ fontFamily: FONTS.display }}>{name} — {sub}</h3>
                <div className="w-[60px] h-[1px] bg-[#1B4332] mb-6"></div>
                <p className="text-[16px] text-[#7A7768] leading-[1.7] max-w-[480px] mb-8">{desc}</p>

                <div className="space-y-3 mb-8">
                    {specs.map((s: ModalitySpec) => (
                        <div key={s.label} className="flex gap-3 text-[14px]">
                            <span className="font-mono text-[11px] text-[#A8A392] w-32 shrink-0 pt-0.5">{s.label}</span>
                            <span className="font-bold text-[#1C1C1A]">{s.val}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        router.push('/protocols');
                        window.scrollTo(0, 0);
                    }}
                    className="font-serif italic text-[15px] text-[#1B4332] hover:text-[#40916C] bg-transparent border-none cursor-pointer"
                >
                    View {name} Protocols →
                </button>
            </div>
        </div>
    );
};

const Separator = () => (
    <div className="w-full h-[1px] bg-[#D8D3C7] flex items-center justify-center my-8">
        <div className="bg-[#F6F3EC] px-4 text-[#B07156] text-lg font-light">◇</div>
    </div>
);

// --- VISUALS ---

const OxygenVisual = ({ color }: { color: string }) => (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[2px]" style={{ borderColor: color }}></div>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
        {[1, 2, 3].map(i => (
            <motion.div
                key={`oxygen-orbit-${i}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 30 + i * 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[#1B4332]/20"
                style={{ scale: 0.6 + i * 0.2 }}
            />
        ))}
        <div className="absolute font-serif text-[120px] opacity-10" style={{ color: color }}>O₂</div>
    </div>
);

const HydrogenVisual = ({ color }: { color: string }) => (
    <div className="relative w-full h-[200px] flex items-center justify-center">
        <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-12"
        >
            {[1, 2].map(i => (
                <div key={`hydrogen-atom-${i}`} className="relative w-6 h-6 rounded-full" style={{ backgroundColor: color }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[60px] h-[30px] border border-dashed border-[#1B4332]/20 rounded-full"
                        style={{ left: '-17px', top: '-2px' }}
                    />
                </div>
            ))}
            <div className="absolute h-[2px] w-12 bg-[#1B4332]" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
        </motion.div>
        <div className="absolute font-serif text-[120px] opacity-10" style={{ color: color }}>H₂</div>
    </div>
);

const LightVisual = ({ color }: { color: string }) => (
    <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
        <div className="absolute left-10 w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
        <div className="ml-20 flex flex-col gap-3">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`light-beam-${i}`}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                    className="h-[1.5px] w-[180px]"
                    style={{ backgroundColor: color, transformOrigin: 'left' }}
                />
            ))}
        </div>
        <div className="absolute font-serif text-[120px] opacity-10 right-20" style={{ color: color }}>λ</div>
    </div>
);

const SignalVisual = ({ color }: { color: string }) => (
    <div className="relative w-full h-[200px] flex items-center justify-center">
        <svg width="300" height="100" viewBox="0 0 300 100">
            <motion.path
                d="M 0 50 Q 75 0 150 50 T 300 50"
                fill="none"
                stroke={color}
                strokeWidth="2"
                animate={{ d: ["M 0 50 Q 75 0 150 50 T 300 50", "M 0 50 Q 75 100 150 50 T 300 50"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
        </svg>
        <div className="absolute font-serif text-[120px] opacity-10" style={{ color: color }}>Hz</div>
    </div>
);

interface ParallaxPanelProps {
    color: string;
    speed: number;
    z: number;
    label: string;
    offset?: string;
    align?: 'left' | 'right' | 'center';
    top?: string;
}

const ParallaxPanel = ({ color, speed, z, label, offset = "0", align = "left", top = "0" }: ParallaxPanelProps) => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 800], [0, -100 * speed * 10]);

    return (
        <motion.div
            style={{ y, zIndex: z, backgroundColor: color, left: offset, top }}
            className={`absolute w-[240px] h-[320px] border border-black/5 shadow-sm p-4 flex items-center justify-center ${align === 'right' ? 'right-0' : ''}`}
        >
            <div className="font-serif text-[120px] opacity-10 text-[#1B4332]">{label}</div>
            <div className="absolute -right-6 top-1/2 -rotate-90 text-[10px] font-mono text-[#A8A392] origin-center w-[200px]">PROTOCOL INTEGRATION POINTS</div>
        </motion.div>
    );
};

export default MeridianPage;
