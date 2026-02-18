import { TechType, TechData } from './types';
import { traceableClaim, TRACE } from './utils/traceMetadata';

export const TECH_DETAILS: Record<TechType, TechData> = {
    [TechType.HBOT]: {
        id: TechType.HBOT,
        name: 'mHBOT',
        tagline: 'Pressurized Oxygen Therapy System',
        descriptionStandard: traceableClaim('Our mild Hyperbaric Oxygen Therapy chamber delivers the elemental power of pressurized oxygen directly to your cells, bypassing the limitations of hemoglobin-dependent transport. Operating at 1.3-1.5 ATA, this system dissolves oxygen directly into plasma, achieving 10-15x normal saturation levels. This is cellular renewal at the most fundamental level: enhanced cognitive function, accelerated tissue repair, reduced inflammation, and the profound vitality that comes from saturating every cell with therapeutic oxygen. FDA-cleared Class II medical device, professionally supported, with flexible rental or ownership options.', TRACE.HBOT_OXYGEN_SATURATION),
        descriptionExpert: traceableClaim('Mild Hyperbaric Oxygen Therapy (mHBOT) operates on Henry\'s Law, dissolving oxygen directly into plasma at pressures of 1.3-1.5 ATA. This creates a 10-15x increase in dissolved oxygen, independent of hemoglobin transport. The resulting hyperoxic-hypoxic paradox triggers HIF-1a activation, stem cell mobilization, and mitochondrial biogenesis. Clinical applications include traumatic brain injury recovery, post-surgical healing, inflammatory conditions, and cognitive optimization. Our chambers deliver medical-grade pressure differentials with continuous oxygen concentration monitoring.', TRACE.HBOT_COGNITIVE_CLARITY),
        benefits: ['Accelerated Recovery', 'Cognitive Clarity', 'Anti-Aging', 'Sleep Optimization'],
        technicalSpecs: [
            { label: 'Pressure Range', value: '1.3 - 1.5 ATA' },
            { label: 'Oxygen Purity', value: '93% plus minus 3%' },
            { label: 'Flow Rate', value: '10L/min' },
            { label: 'Session Duration', value: '60-90 minutes' }
        ],
        protocolSteps: [
            { title: 'Acclimatize', desc: 'Gentle 5-minute compression to 1.3 ATA. Equalize ears as needed.', duration: 5 },
            { title: 'Immerse', desc: '60-minute oxygen saturation phase. Relax, meditate, or read.', duration: 60 },
            { title: 'Integrate', desc: 'Gradual decompression over 5-10 minutes. Hydrate immediately after.', duration: 5 }
        ],
        themeColor: 'text-cyan-600',
        accentColor: 'bg-cyan-500',
        route: '/hbot',
        synergies: [
            { targetId: TechType.HYDROGEN, label: 'Oxy-Hydrogen Stack', description: 'H2 neutralizes oxidative byproducts from high O2, creating the ultimate recovery protocol.', boost: 35 },
            { targetId: TechType.PEMF, label: 'Circulation Priming', description: 'PEMF pre-treatment opens microcirculation, enhancing oxygen delivery to deep tissues.', boost: 20 }
        ],
        goals: ['Rest', 'Focus', 'Repair', 'Life'],
        price: '$18,900',
        rentalPrice: 950,
        rentalTerms: '3 Month Minimum',
        financing: 'Starting at $525/mo',
        roiModel: {
            avgSessionPrice: 150,
            avgSessionsPerMonth: 60
        },
        faqs: [
            { question: "How does 1.5 ATA compare to 1.3 ATA?", answer: "1.5 ATA delivers approximately 40% more dissolved plasma oxygen than 1.3 ATA, crossing the therapeutic threshold for addressing deeper neurological inflammation and more complex recovery needs." },
            { question: "Is a prescription required?", answer: "For 1.5 ATA chambers in the US, yes. Hylono partners with telemedicine providers for streamlined prescription approval typically within 24-48 hours." },
            { question: "What is the warranty?", answer: "We provide a comprehensive 5-year chassis warranty and 2-year electronics warranty, backed by 24/7 concierge support and local service partners." },
            { question: "How often should I use it?", answer: "For optimal results, 3-5 sessions per week. Many users report noticeable benefits within 10-20 sessions, with cumulative improvements over time." }
        ],
        inventory: {
            available: 3,
            reserved: 1,
            allowBackorder: false
        },
        addons: [
            { id: 'hbot-chiller', name: 'Air Cooling System', description: 'Maintains internal temperature at 18-22 degrees C for optimal comfort during longer sessions.', price: 1299, category: 'Comfort' },
            { id: 'hbot-concentrator', name: '10L Oxygen Concentrator', description: 'Medical-grade O2 generator required for operation. Quiet and energy-efficient.', price: 1499, category: 'Essential' },
            { id: 'hbot-frame', name: 'Premium Frame System', description: 'Elevated frame with wheels for easy room-to-room mobility.', price: 899, category: 'Comfort' }
        ],
        comparisonScores: {
            recovery: 95,
            cognitive: 90,
            cellular: 85,
            pain: 70,
            longevity: 90
        },
        optimalTiming: 'afternoon',
        timingReason: 'Deep Focus and Alertness',
        molecularPathways: ['Stem Cell Mobilization', 'HIF-1a Activation', 'Mitochondrial Biogenesis'],
        mechanismBrief: 'Hyper-oxygenation triggers the Hyperoxic-Hypoxic Paradox, simulating low-oxygen recovery signals while supplying 10x oxygen plasma saturation.',
        contraindications: [
            { condition: "Pregnancy", status: 'caution', reason: "Consult your physician before use. Generally considered safe in later trimesters." },
            { condition: "Severe Congestion", status: 'caution', reason: "May cause ear discomfort due to pressure changes. Use decongestant if needed." },
            { condition: "Claustrophobia", status: 'caution', reason: "Chamber is enclosed with transparent viewing windows; internal release valves provided for comfort." },
            { condition: "Recent Ear Surgery", status: 'unsafe', reason: "Pressure changes may damage healing tissue. Wait until fully healed." },
            { condition: "Pacemaker", status: 'safe', reason: "Generally safe at 1.3-1.5 ATA. Consult your cardiologist for peace of mind." }
        ],
        drugInteractions: [
            { drugName: "Chemotherapy (Doxorubicin/Cisplatin)", status: 'unsafe', reason: "HBOT can enhance toxicity of certain chemotherapeutics. Consult your oncologist." },
            { drugName: "Disulfiram (Antabuse)", status: 'unsafe', reason: "Blocks SOD enzyme, increasing oxygen toxicity risk." },
            { drugName: "Mafenide Acetate", status: 'unsafe', reason: "CO2 retention risk increased under pressure." },
            { drugName: "Insulin", status: 'caution', reason: "HBOT can increase insulin sensitivity. Monitor glucose levels closely before and after sessions." }
        ],
        lastReviewed: '2026-01-15',
        reviewedBy: 'Dr. Elena Vasquez, MD, PhD'
    },
    [TechType.PEMF]: {
        id: TechType.PEMF,
        name: 'PEMF + VNS',
        tagline: 'Electromagnetic Cellular Restoration',
        descriptionStandard: traceableClaim('Our Pulsed Electromagnetic Field system delivers precisely calibrated, Earth-resonant frequencies that restore your cells\' natural electrical potential. Operating at 1-50 Hz with intensities up to 500 Gauss, this technology recharges cellular voltage, enhancing ATP production, oxygen utilization, and nutrient transport. Non-invasive and deeply effective for pain management, stress resilience, and accelerated recovery. Integrated Vagus Nerve Stimulation activates parasympathetic response for systemic regeneration.', TRACE.PEMF_CELLULAR_CHARGE),
        descriptionExpert: traceableClaim('PEMF therapy utilizes square and sawtooth waveforms in the VLF (Very Low Frequency) range to modulate transmembrane potential. The magnetic field pulses stimulate voltage-gated ion channels, enhancing Na+/K+ pump efficiency and cellular metabolism by up to 300%. Concurrent VNS (Vagus Nerve Stimulation) promotes parasympathetic activation, reducing cortisol 23% and supporting systemic recovery. Clinical applications include chronic pain management, athletic recovery, sleep optimization, and inflammatory conditions.', TRACE.PEMF_STRESS_RESILIENCE),
        benefits: ['Cellular Charge', 'Pain Reduction', 'Stress Resilience', 'Circulation Boost'],
        technicalSpecs: [
            { label: 'Intensity', value: '10 - 500 Gauss' },
            { label: 'Waveform', value: 'Square and Sawtooth' },
            { label: 'Frequency', value: '1 - 50 Hz (Schumann Res.)' },
            { label: 'Session Duration', value: '8-20 minutes' }
        ],
        protocolSteps: [
            { title: 'Ground', desc: '2-minute baseline resonance establishment at Schumann frequency (7.83 Hz).', duration: 2 },
            { title: 'Entrain', desc: '5-minute brainwave entrainment to target state (Alpha for focus, Delta for sleep).', duration: 5 },
            { title: 'Renew', desc: '12-minute deep tissue signal integration for cellular recharge.', duration: 12 }
        ],
        themeColor: 'text-purple-600',
        accentColor: 'bg-purple-600',
        route: '/pemf',
        synergies: [
            { targetId: TechType.RLT, label: 'Voltage and Photons', description: 'PEMF primes cell membrane potential, maximizing photon absorption from Red Light therapy.', boost: 25 },
            { targetId: TechType.HBOT, label: 'Transport Optimization', description: 'Enhanced microcirculation delivers oxygen deeper into tissues post-HBOT.', boost: 30 }
        ],
        goals: ['Rest', 'Focus'],
        price: '$4,200',
        rentalPrice: 350,
        rentalTerms: 'Month-to-Month',
        financing: 'Starting at $115/mo',
        roiModel: {
            avgSessionPrice: 45,
            avgSessionsPerMonth: 120
        },
        faqs: [
            { question: "Can I use this with metal implants?", answer: "Yes, our PEMF devices are safe for use with titanium implants. However, avoid use directly over pacemakers." },
            { question: "How often should I use it?", answer: "For acute injury, 2x daily. For maintenance and longevity, 1x daily for 12-20 minutes." }
        ],
        inventory: {
            available: 12,
            reserved: 4,
            allowBackorder: true
        },
        addons: [
            { id: 'pemf-mat-cover', name: 'Far Infrared Insert', description: 'Adds radiant heat therapy to your PEMF sessions.', price: 499, category: 'Performance' },
            { id: 'pemf-travel-bag', name: 'Travel Case', description: 'Protection for your VNS system on the go.', price: 199, category: 'Comfort' }
        ],
        comparisonScores: {
            recovery: 80,
            cognitive: 75,
            cellular: 95,
            pain: 90,
            longevity: 80
        },
        optimalTiming: 'evening',
        timingReason: 'Parasympathetic Reset',
        molecularPathways: ['Na+/K+ Pump Polarization', 'Erythrocyte De-clumping', 'ATP Production Flux'],
        mechanismBrief: 'Pulsed magnetic fields restore transmembrane potential, optimizing cellular nutrient uptake and waste removal at a resonant frequency.',
        contraindications: [
            { condition: "Pacemaker", status: 'unsafe', reason: "Magnetic fields can interfere with pacemaker function." },
            { condition: "Pregnancy", status: 'caution', reason: "Safety has not been established; consult physician." },
            { condition: "Metal Implants", status: 'safe', reason: "Titanium is non-magnetic; generally safe." },
            { condition: "Active Bleeding", status: 'unsafe', reason: "Increased circulation may increase bleeding." },
            { condition: "Epilepsy", status: 'caution', reason: "Consult physician regarding specific frequencies." }
        ],
        drugInteractions: [
            { drugName: "Anticoagulants (Warfarin/Heparin)", status: 'caution', reason: "PEMF improves circulation; monitor INR levels." },
            { drugName: "Insulin", status: 'caution', reason: "May enhance cellular uptake; monitor glucose." }
        ],
        lastReviewed: '2026-01-18',
        reviewedBy: 'Dr. Marcus Chen, DO'
    },
    [TechType.RLT]: {
        id: TechType.RLT,
        name: 'PBM / Red Light',
        tagline: 'Photobiomodulation Therapy System',
        descriptionStandard: traceableClaim('Our medical-grade Photobiomodulation panels deliver precisely calibrated red (660nm) and near-infrared (850nm) wavelengths that penetrate deep into tissue, stimulating mitochondrial energy production at the source. With irradiance exceeding 100mW/cm², these systems trigger ATP synthesis, collagen production, and cellular repair mechanisms. FDA-cleared Class II medical devices for pain relief, skin restoration, and circadian optimization. Third-party tested for output accuracy.', TRACE.RLT_SKIN_VITALITY),
        descriptionExpert: traceableClaim('Dual-wavelength photobiomodulation targets mitochondrial chromophores, specifically Cytochrome C Oxidase in the electron transport chain. Photon absorption at 660nm (superficial, 2-5mm penetration) and 850nm (deep tissue, 5-10mm) dissociates inhibitory nitric oxide, enabling enhanced ATP synthesis via oxidative phosphorylation. Documented outcomes include 200% increase in fibroblast proliferation, 35% reduction in inflammatory markers, and accelerated wound healing. Clinical applications span dermatology, sports medicine, and neurological support.', TRACE.RLT_MUSCLE_RECOVERY),
        benefits: ['Skin Collagen', 'Muscle Recovery', 'Inflammation Control', 'Circadian Reset'],
        technicalSpecs: [
            { label: 'Wavelengths', value: '660nm (Red) / 850nm (NIR)' },
            { label: 'Irradiance', value: '>100mW/cm squared' },
            { label: 'Flicker', value: '0Hz (Continuous Wave)' },
            { label: 'Beam Angle', value: '60 degrees' }
        ],
        protocolSteps: [
            { title: 'Expose', desc: 'Position 6 inches from target area. Remove clothing from treatment zone.', duration: 2 },
            { title: 'Absorb', desc: '10-20 minute saturation of therapeutic wavelengths. Relax and breathe.', duration: 10 },
            { title: 'Glow', desc: 'Post-session hydration supports cellular detox and collagen synthesis.', duration: 2 }
        ],
        themeColor: 'text-red-600',
        accentColor: 'bg-red-600',
        route: '/rlt',
        synergies: [
            { targetId: TechType.HYDROGEN, label: 'Mitochondrial Defense', description: 'PBM increases ATP but also ROS; H2 neutralizes excess oxidative byproducts for cleaner energy.', boost: 40 },
            { targetId: TechType.PEMF, label: 'Tissue Repair Stack', description: 'PEMF primes membrane voltage; concurrent light therapy accelerates wound healing exponentially.', boost: 25 }
        ],
        goals: ['Repair', 'Life'],
        price: '$1,490',
        rentalPrice: 150,
        rentalTerms: 'Month-to-Month',
        financing: 'Starting at $42/mo',
        roiModel: {
            avgSessionPrice: 30,
            avgSessionsPerMonth: 200
        },
        faqs: [
            { question: "Is this class II medical grade?", answer: "Yes, our panels are FDA Cleared Class II medical devices for pain relief and skin restoration. Third-party tested for irradiance accuracy." },
            { question: "What is the irradiance output?", answer: "We deliver >100mW/cm squared at 6 inches, verified by independent laboratory testing. This exceeds the therapeutic threshold for cellular stimulation." },
            { question: "How long until I see results?", answer: "Most users notice improved skin tone within 2-3 weeks of daily use. Pain relief and recovery benefits often manifest within the first few sessions." }
        ],
        inventory: {
            available: 45,
            reserved: 8,
            allowBackorder: true
        },
        addons: [
            { id: 'rlt-floor-stand', name: 'Mobile Floor Stand', description: 'Adjustable vertical or horizontal positioning with smooth-rolling wheels.', price: 299, category: 'Essential' },
            { id: 'rlt-goggles', name: 'Premium Blackout Goggles', description: 'Medical-grade eye protection for facial treatments. Included with every panel.', price: 49, category: 'Safety' },
            { id: 'rlt-door-mount', name: 'Door Mounting Kit', description: 'Easy installation for door-mounted sessions. Great for small spaces.', price: 79, category: 'Comfort' }
        ],
        comparisonScores: {
            recovery: 85,
            cognitive: 60,
            cellular: 90,
            pain: 80,
            longevity: 85
        },
        optimalTiming: 'morning',
        timingReason: 'Circadian Signal (Sun Mimic)',
        molecularPathways: ['Cytochrome C Oxidase Activation', 'Nitric Oxide Release', 'Melatonin Precursors'],
        mechanismBrief: 'Photobiomodulation targets mitochondrial chromophores, triggering a cascade of ATP production and reducing oxidative stress.',
        contraindications: [
            { condition: "Photosensitivity", status: 'caution', reason: "Consult physician if taking photosensitizing medications. Reduce session duration initially." },
            { condition: "Pregnancy", status: 'safe', reason: "Generally considered safe; avoid direct abdomen exposure during first trimester if concerned." },
            { condition: "Active Cancer", status: 'caution', reason: "Consult oncologist before use. PBM may theoretically stimulate cell growth in certain cancers." },
            { condition: "Epilepsy", status: 'caution', reason: "Flickering light may trigger seizures. Our panels use continuous wave (0Hz flicker) for safety." },
            { condition: "Pacemaker", status: 'safe', reason: "Light therapy does not interfere with electrical devices or implants." }
        ],
        drugInteractions: [
            { drugName: "Tetracycline / Doxycycline", status: 'caution', reason: "Photosensitizing antibiotics; may cause skin reaction. Reduce exposure time." },
            { drugName: "Retin-A / Retinol", status: 'caution', reason: "Increases skin sensitivity. Reduce session duration or increase distance from panel." },
            { drugName: "Lithium", status: 'caution', reason: "May cause photoreaction in rare cases. Consult prescribing physician." },
            { drugName: "St. John's Wort", status: 'caution', reason: "Herbal photosensitizer. Monitor skin for any reactions." }
        ],
        lastReviewed: '2026-01-20',
        reviewedBy: 'Dr. Sarah Mitchell, MD, FAAD'
    },
    [TechType.HYDROGEN]: {
        id: TechType.HYDROGEN,
        name: 'Hydrogen',
        tagline: 'Selective Antioxidant Therapy',
        descriptionStandard: traceableClaim('Molecular hydrogen (H2) is nature\'s selective antioxidant, neutralizing cytotoxic free radicals while preserving beneficial signaling molecules. At 0.28 nm, it crosses the blood-brain barrier and penetrates mitochondria where oxidative damage originates. Our PEM electrolysis systems deliver 99.99% pure hydrogen gas at 300-900 ml/min and hydrogen-rich water exceeding 1200 ppb. Experience cognitive clarity, reduced systemic inflammation, and accelerated recovery with the smallest molecule in existence.', TRACE.HYDROGEN_ANTIOXIDANT),
        descriptionExpert: traceableClaim('Molecular hydrogen acts as a selective scavenger for the hydroxyl radical (OH) and peroxynitrite (ONOO-), the most cytotoxic reactive oxygen species. Its ultra-small molecular size (0.28 nm) enables rapid diffusion across the blood-brain barrier and into cellular compartments including mitochondria. H2 modulates Nrf2/Keap1 signaling, upregulating endogenous antioxidant systems by 40% without disrupting physiological ROS signaling. Clinical applications include metabolic syndrome, neurodegenerative conditions, athletic recovery, and inflammatory disorders.', TRACE.HYDROGEN_NEUROPROTECTION),
        benefits: ['Selective Antioxidant', 'Neuroprotection', 'Metabolic Balance', 'Athletic Performance'],
        technicalSpecs: [
            { label: 'Concentration', value: '>1200 ppb (Water)' },
            { label: 'Flow Rate', value: '300-900 ml/min (Gas)' },
            { label: 'Technology', value: 'PEM Electrolysis' },
            { label: 'Purity', value: '99.99% H2' }
        ],
        protocolSteps: [
            { title: 'Inhale', desc: '30-minute nasal cannula session. Relax and breathe normally.', duration: 30 },
            { title: 'Hydrate', desc: 'Drink hydrogen-enriched water immediately after for extended benefits.', duration: 2 },
            { title: 'Clarify', desc: 'Notice improved mental clarity and reduced brain fog within minutes.', duration: 1 }
        ],
        themeColor: 'text-sky-500',
        accentColor: 'bg-sky-500',
        route: '/hydrogen',
        synergies: [
            { targetId: TechType.HBOT, label: 'The Recovery Gold Standard', description: 'Oxygen provides fuel; Hydrogen controls the fire. The ultimate oxidative balance protocol.', boost: 50 },
            { targetId: TechType.RLT, label: 'Skin Health', description: 'H2 reduces UV damage while RLT stimulates collagen repair. Perfect combination for skin optimization.', boost: 15 }
        ],
        goals: ['Focus', 'Life'],
        price: '$2,400',
        rentalPrice: 200,
        rentalTerms: '2 Month Minimum',
        financing: 'Starting at $65/mo',
        roiModel: {
            avgSessionPrice: 40,
            avgSessionsPerMonth: 90
        },
        faqs: [
            { question: "Do I need distilled water?", answer: "Yes, pure distilled or reverse-osmosis water is required to prevent mineral buildup on the PEM electrolysis membrane. Using tap water will damage the device." },
            { question: "Is hydrogen gas safe?", answer: "H2 is non-toxic and our devices maintain concentrations well below the 4% flammability threshold. You are breathing a gas that is safer than the air around you." },
            { question: "How often should I use it?", answer: "Daily sessions of 30-60 minutes provide optimal benefits. Many users report best results with morning sessions for mental clarity." },
            { question: "Can I drink the hydrogen water?", answer: "Absolutely! Our devices produce both inhalation gas and hydrogen-rich water. Drinking the water extends the antioxidant benefits throughout the day." }
        ],
        inventory: {
            available: 8,
            reserved: 2,
            allowBackorder: false
        },
        addons: [
            { id: 'h2-cannula', name: 'Nasal Cannula Pack (5x)', description: 'Medical-grade silicone tubing replacements. Comfortable for extended sessions.', price: 49, category: 'Essential' },
            { id: 'h2-bottle', name: 'H2 Portable Infuser', description: 'Create hydrogen-rich water on the go. Perfect for travel and daily hydration.', price: 199, category: 'Performance' },
            { id: 'h2-extra-tank', name: 'Additional Water Tank', description: 'Extended session capacity. Double your runtime between refills.', price: 89, category: 'Comfort' }
        ],
        comparisonScores: {
            recovery: 85,
            cognitive: 95,
            cellular: 99,
            pain: 75,
            longevity: 95
        },
        optimalTiming: 'any',
        timingReason: 'Hydration and Clarity',
        molecularPathways: ['Selective ROS Scavenging', 'Nrf2 Pathway Activation', 'Blood-Brain Barrier Crossing'],
        mechanismBrief: 'The smallest molecule in the universe selectively neutralizes hydroxyl radicals without disrupting beneficial signaling reactive species.',
        contraindications: [
            { condition: "Pregnancy", status: 'safe', reason: "Hydrogen is endogenous to the body and studies show no adverse effects during pregnancy." },
            { condition: "Pacemaker", status: 'safe', reason: "No electromagnetic interference. Completely safe for all electronic implants." },
            { condition: "Metal Implants", status: 'safe', reason: "No interaction with any metal implants including titanium, steel, or dental work." }
        ],
        drugInteractions: [
            { drugName: "Chemotherapy", status: 'safe', reason: "Often used adjunctively to reduce cytotoxic side effects (consult oncologist)." }
        ],
        lastReviewed: '2026-01-22',
        reviewedBy: 'Dr. James Wright, MD, PhD'
    },
};