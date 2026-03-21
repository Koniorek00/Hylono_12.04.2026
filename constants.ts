import { TechType, TechData } from './types';
import { traceableClaim, TRACE } from './utils/traceMetadata';

export const TECH_DETAILS: Record<TechType, TechData> = {
    [TechType.HBOT]: {
        id: TechType.HBOT,
        name: 'HBOT',
        friendlyName: 'Oxygen Chamber',
        plainDescription: 'Breathe pure oxygen in a pressurised chamber — speeds up recovery, sharpens focus, and helps your body heal faster.',
        goalTags: ['recovery', 'performance', 'cognitive'],
        icon: '🫁',
        tagline: 'Pressurized Oxygen Therapy System',
        descriptionStandard: traceableClaim('Our mild Hyperbaric Oxygen Therapy chamber delivers the elemental power of pressurized oxygen directly to your cells, bypassing the limitations of hemoglobin-dependent transport. Operating at 1.3-1.5 ATA, this system dissolves oxygen directly into plasma, achieving 10-15x normal saturation levels. This is cellular renewal at the most fundamental level: enhanced cognitive function, accelerated tissue repair, reduced inflammation, and the profound vitality that comes from saturating every cell with therapeutic oxygen. FDA-cleared Class II medical device, professionally supported, with flexible rental or ownership options.', TRACE.HBOT_OXYGEN_SATURATION),
        descriptionExpert: traceableClaim('Mild Hyperbaric Oxygen Therapy (HBOT) operates on Henry\'s Law, dissolving oxygen directly into plasma at pressures of 1.3-1.5 ATA. This creates a 10-15x increase in dissolved oxygen, independent of hemoglobin transport. The resulting hyperoxic-hypoxic paradox triggers HIF-1a activation, stem cell mobilization, and mitochondrial biogenesis. Clinical applications include traumatic brain injury recovery, post-surgical healing, inflammatory conditions, and cognitive optimization. Our chambers deliver medical-grade pressure differentials with continuous oxygen concentration monitoring.', TRACE.HBOT_COGNITIVE_CLARITY),
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
        friendlyName: 'Magnetic Therapy Mat',
        plainDescription: 'Lie on a mat that sends gentle pulses through your body — eases pain, recharges your cells, and helps your nervous system unwind from stress.',
        goalTags: ['sleep', 'pain', 'recovery', 'cognitive'],
        icon: '🔋',
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
        friendlyName: 'Red Light Panel',
        plainDescription: 'Stand in front of a panel of red and near-infrared light — boosts collagen, reduces inflammation, and speeds up muscle and skin recovery.',
        goalTags: ['skin', 'longevity', 'pain', 'recovery'],
        icon: '💡',
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
        friendlyName: 'Hydrogen Therapy Device',
        plainDescription: 'Inhale or drink hydrogen-enriched water to neutralise harmful free radicals — reduces brain fog, fights inflammation, and supports healthy ageing.',
        goalTags: ['cognitive', 'longevity', 'skin', 'recovery'],
        icon: '💧',
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
            { id: 'h2-cannula', name: 'Nasal Cannula Pack (5x)', description: 'Medical-grade silicone nasal cannula replacements for the inhalation unit. Soft, hypoallergenic, and comfortable for sessions up to 60 minutes.', price: 49, category: 'Essential' },
            { id: 'h2-goggles', name: 'H₂ Therapy Goggles', description: 'Precision-sealed hydrogen delivery goggles for targeted periorbital therapy. Delivers molecular H₂ directly to the delicate eye area — supporting skin hydration, UV repair, and eye fatigue relief. Connects directly to the inhalation unit output.', price: 129, category: 'Performance' },
            { id: 'h2-earmuffs', name: 'H₂ Therapy Earmuffs', description: 'Hydrogen-delivery earmuffs for targeted auricular therapy. Designed to support inner ear health, tinnitus relief, and local anti-inflammatory benefits. Soft silicone seal, adjustable fit, connects to inhalation unit output.', price: 119, category: 'Performance' },
            { id: 'h2-rod', name: 'Hydrogen Water Rod', description: 'Premium titanium PEM electrolysis rod that infuses any glass or bottle of water with molecular hydrogen exceeding 1200 ppb in under 10 minutes. Perfect for creating hydrogen-rich water throughout the day without the main unit.', price: 89, category: 'Essential' },
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

    [TechType.EWOT]: {
        id: TechType.EWOT,
        name: 'EWOT',
        friendlyName: 'Oxygen Exercise System',
        plainDescription: 'Exercise while breathing enriched oxygen through a mask — dramatically increases energy, aerobic fitness, and tissue recovery in just 15 minutes.',
        goalTags: ['performance', 'recovery', 'cognitive'],
        icon: '🏃',
        tagline: 'Exercise With Oxygen Therapy',
        descriptionStandard: 'EWOT combines the cardiovascular demands of physical exercise with the power of enriched oxygen breathing. When your heart rate rises during exertion, your circulatory system opens up — blood vessels dilate, cardiac output surges, and peripheral microcirculation expands. By delivering high-concentration oxygen precisely at this moment of peak demand, EWOT drives oxygen deep into tissues that conventional breathing cannot reach. The result is a profound restoration of cellular oxygen utilization, improved aerobic capacity, and an energy surge that outlasts the session itself.',
        descriptionExpert: 'During aerobic exertion, increased cardiac output and peripheral vasodilation create elevated plasma partial pressure of oxygen. EWOT exploits this hemodynamic window by supplying oxygen-enriched air, maximizing dissolved plasma O2 independent of hemoglobin saturation limits. This triggers upregulation of hypoxia-inducible factor pathways post-session (the hyperoxic-hypoxic paradox), stimulating mitochondrial biogenesis and endothelial NO synthesis. Documented benefits include significant VO2 Max improvement, enhanced lactate clearance, and restoration of microcirculatory function in compromised tissue beds.',
        benefits: ['Aerobic Capacity', 'Tissue Oxygenation', 'Rapid Recovery', 'Cognitive Clarity'],
        technicalSpecs: [
            { label: 'O2 Concentration', value: '90-95%' },
            { label: 'Reservoir Volume', value: '10L bag system' },
            { label: 'Session Duration', value: '15-20 minutes' },
            { label: 'Compatible Activity', value: 'Cycling, rowing, walking' }
        ],
        protocolSteps: [
            { title: 'Prepare', desc: 'Set up your exercise equipment and connect the oxygen mask to the reservoir. Begin breathing enriched oxygen 2 minutes before starting.', duration: 2 },
            { title: 'Exercise', desc: 'Perform moderate-intensity aerobic activity — cycling, walking on a treadmill, or rowing — while breathing continuously from the mask.', duration: 15 },
            { title: 'Recover', desc: 'Slow your pace and continue breathing enriched oxygen for 2-3 minutes post-exercise to integrate the oxygen loading effect.', duration: 3 }
        ],
        themeColor: 'text-orange-600',
        accentColor: 'bg-orange-500',
        route: '/ewot',
        synergies: [
            { targetId: TechType.HBOT, label: 'Oxygen Amplifier Stack', description: 'EWOT primes circulatory pathways; HBOT then saturates plasma at rest for deep tissue recovery.', boost: 40 },
            { targetId: TechType.HYDROGEN, label: 'Oxidative Balance', description: 'H2 neutralizes exercise-induced free radicals while EWOT maximizes oxygen delivery.', boost: 30 }
        ],
        goals: ['Repair', 'Focus'],
        price: '$3,200',
        rentalPrice: 280,
        rentalTerms: 'Month-to-Month',
        financing: 'Starting at $88/mo',
        roiModel: {
            avgSessionPrice: 55,
            avgSessionsPerMonth: 90
        },
        faqs: [
            { question: 'What type of exercise works best?', answer: 'Low-to-moderate intensity aerobic activity is ideal — stationary cycling, walking, or light rowing. The goal is sustained elevated heart rate, not maximum exertion.' },
            { question: 'How does this differ from regular HBOT?', answer: 'HBOT delivers oxygen at rest under pressure. EWOT uses exercise-induced hemodynamics to drive oxygen delivery without a pressurized chamber — it is more active and dynamic.' },
            { question: 'How quickly will I notice results?', answer: 'Many users report improved energy levels and mental clarity within the first 2-3 sessions. Aerobic fitness improvements typically become measurable after 4-6 weeks of consistent use.' }
        ],
        inventory: {
            available: 20,
            reserved: 3,
            allowBackorder: true
        },
        addons: [
            { id: 'ewot-mask', name: 'Non-Rebreather Mask', description: 'Medical-grade silicone mask with one-way valve for clean oxygen delivery during exercise.', price: 89, category: 'Essential' },
            { id: 'ewot-bag', name: 'Extended Reservoir Bag', description: 'Larger volume reservoir for extended sessions and higher flow rates.', price: 199, category: 'Performance' }
        ],
        comparisonScores: {
            recovery: 88,
            cognitive: 80,
            cellular: 75,
            pain: 55,
            longevity: 82
        },
        optimalTiming: 'morning',
        timingReason: 'Peak Cortisol & Metabolic Window',
        molecularPathways: ['HIF-1a Post-Exercise Activation', 'Endothelial NO Synthesis', 'Mitochondrial Biogenesis'],
        mechanismBrief: 'Exercise-induced vasodilation creates a delivery highway; enriched oxygen floods tissues normally oxygen-limited.',
        contraindications: [
            { condition: 'Cardiovascular Disease', status: 'caution', reason: 'Consult cardiologist before beginning any exercise-based protocol.' },
            { condition: 'Severe COPD', status: 'caution', reason: 'High-flow oxygen may suppress respiratory drive in hypercapnic patients. Physician supervision required.' },
            { condition: 'Pregnancy', status: 'caution', reason: 'Avoid high-intensity exertion during pregnancy. Light-intensity EWOT may be considered with physician approval.' },
            { condition: 'Pacemaker', status: 'safe', reason: 'Oxygen delivery system has no electromagnetic components. Exercise intensity should be guided by cardiologist.' }
        ],
        drugInteractions: [
            { drugName: 'Beta-Blockers', status: 'caution', reason: 'May limit heart rate response and mask exertion signals. Monitor perceived effort carefully.' },
            { drugName: 'Bronchodilators', status: 'safe', reason: 'Generally compatible; may enhance oxygen uptake synergistically.' }
        ],
        lastReviewed: '2026-02-01',
        reviewedBy: 'Dr. Elena Vasquez, MD, PhD'
    },

    [TechType.SAUNA_BLANKET]: {
        id: TechType.SAUNA_BLANKET,
        name: 'Sauna Blanket',
        friendlyName: 'Infrared Sauna Blanket',
        plainDescription: 'Wrap yourself in deep-heating infrared warmth — relaxes muscles, flushes toxins, and prepares your body for deep, restorative sleep.',
        goalTags: ['sleep', 'recovery', 'longevity', 'skin'],
        icon: '🌡️',
        tagline: 'Far-Infrared Heat Therapy System',
        descriptionStandard: 'The Sauna Blanket delivers the restorative power of far-infrared heat therapy in a portable, full-body format. Unlike conventional saunas that heat the air around you, far-infrared wavelengths penetrate 4–7 cm into soft tissue, heating the body from within. This deep tissue heating elevates core body temperature, triggering the same cascade of physiological responses as vigorous exercise — increased heart rate, profuse sweating, endorphin release, and systemic vasodilation. The result is deep muscular relaxation, improved circulation, accelerated metabolic clearance, and a profound sense of recovery.',
        descriptionExpert: 'Far-infrared radiation (wavelengths 5–20 µm) is absorbed directly by water molecules and organic macromolecules in subcutaneous tissue, generating thermal energy at depths unreachable by convective or conductive heat. This stimulates thermoreceptors and triggers heat shock protein (HSP70/HSP90) upregulation, which supports proteostasis and cellular stress resilience. Cardiovascular response mirrors moderate aerobic exercise: cardiac output increases, peripheral resistance drops, and nitric oxide-mediated vasodilation enhances microcirculatory flow. Repeated FIR exposure is associated with improved arterial compliance, reduced inflammatory cytokine load, and enhanced parasympathetic tone post-session.',
        benefits: ['Deep Relaxation', 'Circulatory Support', 'Metabolic Clearance', 'Skin Vitality'],
        technicalSpecs: [
            { label: 'Heat Penetration', value: '4–7 cm deep tissue' },
            { label: 'Wavelength', value: '5–20 µm far-infrared' },
            { label: 'Session Duration', value: '30–45 minutes' },
            { label: 'Warm-Up Time', value: '5–10 minutes' }
        ],
        protocolSteps: [
            { title: 'Preheat', desc: 'Set the blanket to your target temperature. Allow 5-10 minutes to reach optimal warmth before entering.', duration: 10 },
            { title: 'Immerse', desc: 'Wear light cotton clothing for comfort and hygiene. Relax fully inside for 30-45 minutes. Hydrate before and during.', duration: 40 },
            { title: 'Cool Down', desc: 'Exit slowly and allow body temperature to normalize over 10-15 minutes. Replenish electrolytes and hydrate fully.', duration: 15 }
        ],
        themeColor: 'text-amber-600',
        accentColor: 'bg-amber-500',
        route: '/sauna-blanket',
        synergies: [
            { targetId: TechType.RLT, label: 'Collagen & Heat Stack', description: 'Heat dilates vessels and opens pores; red light then drives deeper photobiomodulation into primed tissue.', boost: 30 },
            { targetId: TechType.EMS, label: 'Recovery Accelerator', description: 'EMS activates muscle fibers; sauna heat flushes metabolic waste and reduces soreness post-stimulation.', boost: 25 }
        ],
        goals: ['Rest', 'Life'],
        price: '$890',
        rentalPrice: 120,
        rentalTerms: 'Month-to-Month',
        financing: 'Starting at $25/mo',
        roiModel: {
            avgSessionPrice: 35,
            avgSessionsPerMonth: 150
        },
        faqs: [
            { question: 'Is it safe to use daily?', answer: 'Yes, daily use at moderate temperatures is considered safe for most healthy adults. Begin with shorter sessions and lower temperatures to allow your body to adapt.' },
            { question: 'What should I wear inside?', answer: 'Light, breathable cotton is recommended. A towel or cotton sheet inside helps with hygiene. Avoid synthetic fabrics that trap heat unevenly.' },
            { question: 'How much water should I drink?', answer: 'Drink at least 500ml of water before your session and replenish fully afterward. Adding electrolytes is highly recommended after sessions exceeding 30 minutes.' }
        ],
        inventory: {
            available: 35,
            reserved: 5,
            allowBackorder: true
        },
        addons: [
            { id: 'sauna-towel', name: 'Organic Cotton Session Liner', description: 'Absorbent organic cotton liner for hygiene and comfort during sessions.', price: 49, category: 'Comfort' },
            { id: 'sauna-electrolytes', name: 'Electrolyte Recovery Pack', description: 'Premium mineral blend formulated for post-sauna rehydration. 30-session supply.', price: 39, category: 'Essential' }
        ],
        comparisonScores: {
            recovery: 82,
            cognitive: 55,
            cellular: 70,
            pain: 85,
            longevity: 78
        },
        optimalTiming: 'evening',
        timingReason: 'Parasympathetic Wind-Down',
        molecularPathways: ['Heat Shock Protein Upregulation (HSP70/90)', 'Nitric Oxide Vasodilation', 'Endorphin Release'],
        mechanismBrief: 'Far-infrared wavelengths penetrate tissue to generate deep thermal energy, triggering cardiovascular and detoxification responses without external air heating.',
        contraindications: [
            { condition: 'Cardiovascular Conditions', status: 'caution', reason: 'Consult your cardiologist. Heat increases cardiac output and may be contraindicated in some conditions.' },
            { condition: 'Pregnancy', status: 'caution', reason: 'Avoid hyperthermia during pregnancy, particularly in the first trimester. Consult physician.' },
            { condition: 'Multiple Sclerosis', status: 'caution', reason: 'Heat sensitivity may temporarily worsen MS symptoms. Short, lower-temperature sessions only with physician guidance.' },
            { condition: 'Dehydration', status: 'unsafe', reason: 'Never use when dehydrated. Profuse sweating without adequate hydration risks heat stress.' }
        ],
        drugInteractions: [
            { drugName: 'Antihypertensives', status: 'caution', reason: 'Heat causes vasodilation which may potentiate blood pressure reduction. Monitor closely.' },
            { drugName: 'Diuretics', status: 'caution', reason: 'Combined fluid loss may cause dehydration. Increase hydration and monitor electrolytes.' }
        ],
        lastReviewed: '2026-02-01',
        reviewedBy: 'Dr. Sarah Mitchell, MD, FAAD'
    },

    [TechType.EMS]: {
        id: TechType.EMS,
        name: 'EMS Suit',
        friendlyName: 'Full-Body EMS Suit',
        plainDescription: 'A wearable suit that stimulates all your muscles at once — 20 minutes equals a full gym session, without the joint stress.',
        goalTags: ['strength', 'recovery'],
        icon: '⚡',
        tagline: 'Whole-Body Electrical Muscle Stimulation',
        descriptionStandard: 'Electrical Muscle Stimulation technology delivers precisely calibrated low-level electrical impulses through a full-body suit, triggering simultaneous deep muscle contractions across all major muscle groups. In a single 20-minute EMS session, the system engages up to 90% of your muscle fibers — including the deep stabilizing muscles that traditional exercise rarely reaches. This extraordinary activation density accelerates strength development, enhances metabolic rate, and dramatically reduces recovery time. Whether you are an elite athlete seeking a competitive edge or someone optimizing health with limited time, EMS delivers comprehensive full-body conditioning in minutes.',
        descriptionExpert: 'Whole-body EMS employs biphasic rectangular current pulses to directly depolarize motor neurons, bypassing voluntary neuromuscular recruitment. This enables supramaximal activation — recruiting fast-twitch (Type II) and deep stabilizer fibers simultaneously. EMS-induced contractions create metabolic demand equivalent to extended resistance training in a fraction of the time. Physiological adaptations include increased muscle fiber cross-sectional area, enhanced protein synthesis via mTOR pathway activation, improved neuromuscular recruitment efficiency, and elevated basal metabolic rate. Research in rehabilitation medicine demonstrates EMS efficacy for muscle atrophy prevention, post-surgical recovery, and functional strength restoration.',
        benefits: ['Full-Body Activation', 'Strength Development', 'Recovery Acceleration', 'Metabolic Boost'],
        technicalSpecs: [
            { label: 'Coverage', value: 'All major muscle groups' },
            { label: 'Pulse Type', value: 'Biphasic rectangular' },
            { label: 'Session Duration', value: '20 minutes' },
            { label: 'Activation Depth', value: 'Superficial & deep fibers' }
        ],
        protocolSteps: [
            { title: 'Suit Up', desc: 'Wet the electrode pads with water to optimize conductivity. Put on the EMS vest and attach all electrode cuffs correctly.', duration: 5 },
            { title: 'Stimulate', desc: 'Perform slow, controlled bodyweight movements while the suit delivers stimulation. 20 minutes of guided exercise protocol.', duration: 20 },
            { title: 'Recover', desc: 'Complete a brief cool-down movement sequence. Muscle flush with light activity or massage. Hydrate generously.', duration: 10 }
        ],
        themeColor: 'text-violet-600',
        accentColor: 'bg-violet-600',
        route: '/ems',
        synergies: [
            { targetId: TechType.SAUNA_BLANKET, label: 'Activation & Recovery', description: 'EMS creates deep muscle fatigue; infrared heat then accelerates metabolic waste clearance.', boost: 25 },
            { targetId: TechType.PEMF, label: 'Cellular Repair Stack', description: 'PEMF restores cellular charge and reduces inflammation following EMS-induced muscle stress.', boost: 35 }
        ],
        goals: ['Repair', 'Life'],
        price: '$4,800',
        rentalPrice: 380,
        rentalTerms: 'Month-to-Month',
        financing: 'Starting at $132/mo',
        roiModel: {
            avgSessionPrice: 65,
            avgSessionsPerMonth: 100
        },
        faqs: [
            { question: 'Is EMS safe for everyone?', answer: 'EMS is safe for most healthy adults. It is contraindicated for individuals with pacemakers, during pregnancy, or with active inflammatory conditions. Always begin at low intensity and increase gradually.' },
            { question: 'Can I use EMS if I have metal implants?', answer: 'EMS should not be used over areas with metal implants. Titanium joint replacements at distance from electrode placement are generally acceptable — consult your physician.' },
            { question: 'How does 20 minutes of EMS compare to conventional training?', answer: 'Research suggests a 20-minute EMS session can produce metabolic and neuromuscular stimulus comparable to 60-90 minutes of conventional resistance training, due to supramaximal muscle activation.' }
        ],
        inventory: {
            available: 8,
            reserved: 2,
            allowBackorder: false
        },
        addons: [
            { id: 'ems-underwear', name: 'EMS Base Layer Set', description: 'Moisture-wicking base layer designed for optimal electrode contact and comfort.', price: 89, category: 'Essential' },
            { id: 'ems-cleaner', name: 'Electrode Pad Care Kit', description: 'Specialized cleaning solution to extend electrode lifespan and maintain hygiene.', price: 39, category: 'Essential' }
        ],
        comparisonScores: {
            recovery: 85,
            cognitive: 45,
            cellular: 65,
            pain: 78,
            longevity: 80
        },
        optimalTiming: 'morning',
        timingReason: 'Peak Anabolic Window',
        molecularPathways: ['mTOR Pathway Activation', 'Motor Neuron Direct Depolarization', 'Type II Fiber Recruitment'],
        mechanismBrief: 'Biphasic electrical pulses bypass voluntary neural recruitment, achieving supramaximal activation of deep and superficial muscle fibers simultaneously.',
        contraindications: [
            { condition: 'Pacemaker / Implanted Defibrillator', status: 'unsafe', reason: 'Electrical currents may interfere with device function.' },
            { condition: 'Pregnancy', status: 'unsafe', reason: 'Electrical stimulation of abdominal muscles is contraindicated during pregnancy.' },
            { condition: 'Acute Inflammation / Fever', status: 'unsafe', reason: 'EMS increases metabolic demand and circulation; contraindicated during acute illness.' },
            { condition: 'Epilepsy', status: 'caution', reason: 'Electrical stimulation may trigger seizures in susceptible individuals. Physician consultation required.' },
            { condition: 'Metal Implants (at electrode site)', status: 'unsafe', reason: 'Do not place electrodes directly over metal implants. Remote placement may be acceptable with physician guidance.' }
        ],
        drugInteractions: [
            { drugName: 'Anticoagulants', status: 'caution', reason: 'Increased circulation from EMS may affect bleeding risk. Monitor closely.' },
            { drugName: 'Corticosteroids', status: 'caution', reason: 'Long-term steroid use may affect muscle response. Consult physician for appropriate intensity levels.' }
        ],
        lastReviewed: '2026-02-01',
        reviewedBy: 'Dr. Marcus Chen, DO'
    },

    [TechType.VNS]: {
        id: TechType.VNS,
        name: 'VNS Device',
        friendlyName: 'Vagus Nerve Stimulator',
        plainDescription: 'A small ear device that activates your body\'s natural calming system — reduces stress hormones, improves sleep quality, and builds resilience.',
        goalTags: ['sleep', 'cognitive', 'pain'],
        icon: '🧘',
        tagline: 'Transcutaneous Vagus Nerve Stimulation',
        descriptionStandard: 'The vagus nerve is the master conductor of your body\'s parasympathetic nervous system — the biological off-switch for chronic stress. Transcutaneous Vagus Nerve Stimulation (tVNS) delivers gentle, non-invasive electrical pulses to the auricular branch of the vagus nerve at the ear, triggering a cascade of calming, regulatory responses throughout the body. Within a single session, heart rate variability improves, cortisol levels drop, and the body shifts decisively from sympathetic fight-or-flight mode into deep parasympathetic restoration. Regular use builds long-term stress resilience and nervous system flexibility.',
        descriptionExpert: 'Transcutaneous auricular VNS (taVNS) targets the auricular branch of the vagus nerve (Arnold\'s nerve) via the cymba conchae of the ear, accessing the same afferent vagal pathways as implanted VNS devices without surgical intervention. Vagal afferent activation modulates the nucleus tractus solitarius (NTS), locus coeruleus (LC), and dorsal raphe nucleus, producing downstream effects on norepinephrine, serotonin, and GABA release. Documented physiological outcomes include HRV normalization, reduced pro-inflammatory cytokine signaling (TNF-α, IL-1β, IL-6), and cholinergic anti-inflammatory pathway activation. Applications include stress resilience, treatment-resistant depression support, chronic pain modulation, and autonomic regulation.',
        benefits: ['Stress Resilience', 'HRV Improvement', 'Anti-Inflammatory', 'Sleep Architecture'],
        technicalSpecs: [
            { label: 'Stimulation Site', value: 'Auricular (ear) branch' },
            { label: 'Waveform', value: 'Biphasic charge-balanced' },
            { label: 'Session Duration', value: '15–30 minutes' },
            { label: 'Mode', value: 'Non-invasive, transcutaneous' }
        ],
        protocolSteps: [
            { title: 'Position', desc: 'Attach the auricular electrode to the cymba conchae of the left ear. Adjust for comfortable contact without pressure.', duration: 2 },
            { title: 'Calibrate', desc: 'Start at the lowest intensity and increase gradually until you feel a gentle tingling sensation — not painful, just perceptible.', duration: 3 },
            { title: 'Integrate', desc: 'Relax for 20-30 minutes. Combine with breathwork, meditation, or gentle movement for amplified parasympathetic activation.', duration: 25 }
        ],
        themeColor: 'text-teal-600',
        accentColor: 'bg-teal-600',
        route: '/vns',
        synergies: [
            { targetId: TechType.PEMF, label: 'Nervous System Reset', description: 'PEMF and VNS together create a comprehensive autonomic recalibration — electrical and magnetic signals harmonizing the nervous system.', boost: 45 },
            { targetId: TechType.HYDROGEN, label: 'Neurological Protection', description: 'VNS reduces neuroinflammation; H2 simultaneously neutralizes central nervous system oxidative load.', boost: 30 }
        ],
        goals: ['Rest', 'Focus'],
        price: '$1,890',
        rentalPrice: 180,
        rentalTerms: 'Month-to-Month',
        financing: 'Starting at $52/mo',
        roiModel: {
            avgSessionPrice: 40,
            avgSessionsPerMonth: 120
        },
        faqs: [
            { question: 'What does VNS stimulation feel like?', answer: 'A gentle, mild tingling sensation at the ear is normal and expected. The intensity should never be uncomfortable or painful. Many users find the sensation deeply relaxing.' },
            { question: 'How does non-invasive VNS compare to implanted VNS?', answer: 'Transcutaneous VNS accesses the same afferent nerve pathways as implanted devices without surgery. Research shows comparable autonomic and anti-inflammatory effects for wellness applications at appropriate stimulation parameters.' },
            { question: 'When is the best time to use it?', answer: 'Evening use is optimal for most users — the parasympathetic shift promotes excellent sleep quality. Morning use is also effective for setting a calm, focused baseline for the day.' }
        ],
        inventory: {
            available: 15,
            reserved: 3,
            allowBackorder: true
        },
        addons: [
            { id: 'vns-electrode-pack', name: 'Electrode Replacement Pack', description: 'Auricular electrode replacements for extended use. 3-month supply.', price: 59, category: 'Essential' },
            { id: 'vns-case', name: 'Travel Carry Case', description: 'Compact protective case for the VNS device and accessories.', price: 49, category: 'Comfort' }
        ],
        comparisonScores: {
            recovery: 75,
            cognitive: 88,
            cellular: 60,
            pain: 80,
            longevity: 85
        },
        optimalTiming: 'evening',
        timingReason: 'Parasympathetic Activation for Sleep',
        molecularPathways: ['Cholinergic Anti-Inflammatory Pathway', 'NTS / Locus Coeruleus Modulation', 'TNF-α & IL-6 Suppression'],
        mechanismBrief: 'Auricular afferent vagal stimulation propagates calming signals throughout the autonomic nervous system, shifting the body from sympathetic overdrive to parasympathetic restoration.',
        contraindications: [
            { condition: 'Pacemaker / Implanted VNS', status: 'unsafe', reason: 'Electrical stimulation may interfere with implanted devices. Absolute contraindication.' },
            { condition: 'Carotid Artery Disease', status: 'unsafe', reason: 'Stimulation near the carotid sinus may cause bradycardia or vasovagal response.' },
            { condition: 'Pregnancy', status: 'caution', reason: 'Insufficient data on use during pregnancy. Consult physician before use.' },
            { condition: 'Active Skin Conditions (ear)', status: 'caution', reason: 'Avoid electrode placement on broken, irritated, or infected skin.' }
        ],
        drugInteractions: [
            { drugName: 'Antiarrhythmics', status: 'caution', reason: 'VNS modulates cardiac rhythm via vagal tone. Combined use may potentiate bradycardia.' },
            { drugName: 'Antidepressants (SSRIs/SNRIs)', status: 'safe', reason: 'Non-pharmacological VNS is generally considered compatible and may have complementary effects.' }
        ],
        lastReviewed: '2026-02-01',
        reviewedBy: 'Dr. Elena Vasquez, MD, PhD'
    },

    [TechType.HYPOXIC]: {
        id: TechType.HYPOXIC,
        name: 'Hypoxic Generator',
        friendlyName: 'Altitude Trainer',
        plainDescription: 'Simulates high-altitude conditions to boost red blood cell production and endurance — like training at 4,000m without leaving home.',
        goalTags: ['performance', 'recovery', 'longevity'],
        icon: '⛰️',
        tagline: 'Altitude Simulation Training System',
        descriptionStandard: 'The Hypoxic Generator replicates the physiological conditions of high-altitude environments by precisely reducing the fraction of oxygen in inspired air. By intermittently breathing hypoxic air, your body initiates the same powerful adaptive responses used by elite mountain athletes — elevated red blood cell production, increased mitochondrial density, and a more efficient cardiovascular system. Intermittent hypoxic training is one of the most evidence-supported modalities for enhancing aerobic endurance, accelerating recovery, and building systemic metabolic resilience — all from the comfort of your home.',
        descriptionExpert: 'Hypoxic generators reduce FiO2 (fraction of inspired oxygen) through membrane-based nitrogen separation, delivering controlled hypoxic air simulating altitudes of 2,000–6,000m equivalent. Intermittent hypoxic exposure (IHE) protocols activate HIF-1α stabilization — the master hypoxia transcription factor — which drives EPO synthesis in renal interstitial cells, upregulates VEGF for angiogenesis, and stimulates mitochondrial biogenesis via PGC-1α. Alternating hypoxic and normoxic breathing in structured cycles (intermittent hypoxic-hyperoxic training, IHHT) produces superior adaptation responses vs. continuous hypoxia, with documented improvements in VO2 Max, hemoglobin mass, and cardiovascular efficiency.',
        benefits: ['EPO Upregulation', 'VO2 Max Increase', 'Mitochondrial Density', 'Cardiovascular Efficiency'],
        technicalSpecs: [
            { label: 'Altitude Simulation', value: '2,000–6,000m equivalent' },
            { label: 'O2 Reduction Range', value: '9–18% FiO2' },
            { label: 'Session Duration', value: '30–60 minutes' },
            { label: 'Protocol Type', value: 'IHE or IHHT cycles' }
        ],
        protocolSteps: [
            { title: 'Baseline', desc: 'Measure resting SpO2 and heart rate. Begin at low-altitude simulation (15-17% FiO2). Never use when unwell or fatigued.', duration: 5 },
            { title: 'Cycle', desc: 'Alternate 5-7 minutes of hypoxic breathing with 3-5 minutes of normal air recovery. Perform 4-6 cycles per session.', duration: 45 },
            { title: 'Recover', desc: 'Return to normal breathing. Monitor SpO2 until back to baseline. Gentle movement and hydration to integrate adaptation signals.', duration: 10 }
        ],
        themeColor: 'text-indigo-600',
        accentColor: 'bg-indigo-600',
        route: '/hypoxic',
        synergies: [
            { targetId: TechType.HBOT, label: 'Altitude-Oxygen Paradox', description: 'Alternate hypoxic training sessions with HBOT recovery — this contrast maximizes HIF-1α signaling and oxygen delivery adaptations.', boost: 55 },
            { targetId: TechType.EWOT, label: 'Hyperoxic Rebound', description: 'Follow hypoxic sessions with EWOT hyperoxic exercise to create the ultimate oxygen contrast training protocol.', boost: 45 }
        ],
        goals: ['Repair', 'Life'],
        price: '$5,400',
        rentalPrice: 420,
        rentalTerms: '2 Month Minimum',
        financing: 'Starting at $148/mo',
        roiModel: {
            avgSessionPrice: 75,
            avgSessionsPerMonth: 80
        },
        faqs: [
            { question: 'Is altitude simulation safe at home?', answer: 'Yes, when used according to protocol and with built-in SpO2 monitoring. Never use if unwell, and always begin at the lowest simulation level. Stop immediately if you feel dizzy or unwell.' },
            { question: 'How long before I see performance improvements?', answer: 'Initial EPO response begins within 48–72 hours of first exposure. Measurable aerobic performance improvements typically require 3–6 weeks of consistent protocol adherence.' },
            { question: 'What is the difference between IHE and IHHT?', answer: 'IHE (Intermittent Hypoxic Exposure) uses hypoxic air only. IHHT adds hyperoxic breathing phases, creating a powerful physiological contrast that amplifies adaptation while reducing session discomfort.' }
        ],
        inventory: {
            available: 5,
            reserved: 1,
            allowBackorder: false
        },
        addons: [
            { id: 'hypoxic-spo2', name: 'Continuous SpO2 Monitor', description: 'Medical-grade pulse oximeter with alert system for safe session monitoring.', price: 199, category: 'Safety' },
            { id: 'hypoxic-mask', name: 'Training Mask & Reservoir', description: 'High-flow training mask with integrated reservoir for comfortable hypoxic delivery during exercise.', price: 149, category: 'Essential' }
        ],
        comparisonScores: {
            recovery: 90,
            cognitive: 72,
            cellular: 88,
            pain: 50,
            longevity: 92
        },
        optimalTiming: 'morning',
        timingReason: 'Peak HIF-1α Response Window',
        molecularPathways: ['HIF-1α Stabilization', 'EPO Synthesis (Renal)', 'VEGF Angiogenesis', 'PGC-1α Mitochondrial Biogenesis'],
        mechanismBrief: 'Controlled oxygen reduction activates hypoxia-inducible transcription factors, driving red blood cell production, angiogenesis, and mitochondrial expansion.',
        contraindications: [
            { condition: 'Severe COPD / Respiratory Disease', status: 'unsafe', reason: 'Further reducing FiO2 in patients with compromised lung function is dangerous.' },
            { condition: 'Cardiovascular Disease', status: 'caution', reason: 'Hypoxic stress increases cardiac demand. Cardiology clearance required before use.' },
            { condition: 'Pregnancy', status: 'unsafe', reason: 'Fetal hypoxia is dangerous. Absolutely contraindicated during pregnancy.' },
            { condition: 'Anemia', status: 'caution', reason: 'Compromised oxygen-carrying capacity makes hypoxic stress potentially dangerous. Physician supervision required.' },
            { condition: 'Hypertension (uncontrolled)', status: 'caution', reason: 'Hypoxic conditions may elevate blood pressure acutely. Control BP before beginning protocols.' }
        ],
        drugInteractions: [
            { drugName: 'Beta-Blockers', status: 'caution', reason: 'Blunted heart rate response may mask physiological warning signals during hypoxic exposure.' },
            { drugName: 'Vasoconstrictors', status: 'caution', reason: 'May reduce adaptive vasodilation response and increase cardiovascular risk during hypoxia.' }
        ],
        lastReviewed: '2026-02-01',
        reviewedBy: 'Dr. James Wright, MD, PhD'
    },

    [TechType.CRYO]: {
        id: TechType.CRYO,
        name: 'Cryo Chamber',
        friendlyName: 'Cryo Chamber',
        plainDescription: '2–3 minutes in extreme cold rapidly suppresses inflammation, relieves pain, and triggers a powerful mood-elevating and recovery response.',
        goalTags: ['pain', 'recovery', 'performance'],
        icon: '🧊',
        tagline: 'Whole-Body Cryotherapy System',
        descriptionStandard: 'Whole-body cryotherapy exposes your body to extreme cold for a brief, precisely controlled period — typically 2-3 minutes. In this short window, the cold triggers a powerful systemic response: blood floods the core to protect vital organs, norepinephrine surges to produce analgesic and mood-elevating effects, and inflammatory cytokines are rapidly suppressed. When you step out, warm blood rushes back through the body, delivering a fresh surge of oxygen and nutrients. Elite athletes, biohackers, and longevity-focused individuals rely on cryo for faster recovery, mood optimization, and sustained inflammation control. The session is brief, the effect is profound.',
        descriptionExpert: 'Whole-body cryotherapy (WBC) applies sustained cold exposure through cryogenic gas, triggering peripheral vasoconstriction that shunts blood centrally to protect core temperature. This acute thermal stress activates the sympathetic-adrenomedullary axis, producing a norepinephrine surge that mediates analgesic, anti-inflammatory, and mood-stabilizing effects. Cold-induced reactive hyperemia upon rewarming delivers oxygenated blood to peripheral tissues with enhanced velocity. Molecular mechanisms include suppression of NF-κB-mediated inflammatory transcription, downregulation of TNF-α and IL-1β, and activation of cold-shock proteins (RBM3, CIRBP) that support cellular repair. Evidence supports WBC applications in inflammatory pain conditions, athletic recovery optimization, and mood disorder adjunctive support.',
        benefits: ['Rapid Recovery', 'Inflammation Control', 'Mood Elevation', 'Pain Relief'],
        technicalSpecs: [
            { label: 'Temperature Range', value: '-100°C to -140°C' },
            { label: 'Session Duration', value: '2–3 minutes' },
            { label: 'Cooling Agent', value: 'Cryogenic nitrogen vapor' },
            { label: 'Cool-down Time', value: 'Pre-chilled < 10 min' }
        ],
        protocolSteps: [
            { title: 'Prepare', desc: 'Remove all jewelry and moisture from skin. Wear protective extremity coverings (gloves, socks, ear protection). Enter wearing dry, minimal clothing.', duration: 5 },
            { title: 'Expose', desc: '2-3 minutes of full-body cold exposure. Keep moving subtly to maintain circulation. Breathe normally. Alert staff if discomfort becomes distressing.', duration: 3 },
            { title: 'Reactivate', desc: 'Exit and immediately perform light movement — walking, arm swings — to accelerate peripheral rewarming and maximize the recovery surge.', duration: 10 }
        ],
        themeColor: 'text-sky-500',
        accentColor: 'bg-sky-400',
        route: '/cryo',
        synergies: [
            { targetId: TechType.SAUNA_BLANKET, label: 'Hot-Cold Contrast Protocol', description: 'Alternating cryo cold exposure with infrared heat creates powerful cardiovascular conditioning and accelerated inflammation resolution.', boost: 50 },
            { targetId: TechType.PEMF, label: 'Recovery Stack', description: 'PEMF restores cellular charge following cryo-induced vasoconstriction, optimizing the post-cryo tissue repair window.', boost: 35 }
        ],
        goals: ['Repair', 'Life'],
        price: '$28,000',
        rentalPrice: 1200,
        rentalTerms: '3 Month Minimum',
        financing: 'Starting at $775/mo',
        roiModel: {
            avgSessionPrice: 65,
            avgSessionsPerMonth: 150
        },
        faqs: [
            { question: 'Is 2-3 minutes in extreme cold dangerous?', answer: 'No — the skin surface temperature drops but core body temperature is maintained throughout. Sessions are strictly timed and monitored. The brief duration is what makes WBC safe and effective.' },
            { question: 'How does whole-body cryo differ from an ice bath?', answer: 'WBC uses dry cold air, not water — this is more tolerable, avoids thermal mass transfer issues, and allows precise temperature control. The session is dramatically shorter (2-3 min vs 10-20 min) with comparable or superior physiological response.' },
            { question: 'How often should I use the cryo chamber?', answer: 'For recovery, 2-3 sessions per week is typical. For acute injury or high-intensity training periods, daily use is practiced by many elite athletes. Begin with every other day to assess individual response.' }
        ],
        inventory: {
            available: 2,
            reserved: 1,
            allowBackorder: false
        },
        addons: [
            { id: 'cryo-gloves', name: 'Protective Extremity Kit', description: 'Medical-grade cryo gloves, socks, and ear covers. Essential for safe use. Included with chamber.', price: 79, category: 'Safety' },
            { id: 'cryo-thermometer', name: 'Skin Surface Thermometer', description: 'Instant-read surface temperature monitor for pre and post-session skin temperature tracking.', price: 129, category: 'Performance' }
        ],
        comparisonScores: {
            recovery: 95,
            cognitive: 65,
            cellular: 72,
            pain: 92,
            longevity: 85
        },
        optimalTiming: 'afternoon',
        timingReason: 'Post-Training Recovery Window',
        molecularPathways: ['NF-κB Inflammatory Suppression', 'Norepinephrine Surge (Analgesic)', 'Cold-Shock Protein Activation (RBM3)', 'Reactive Hyperemia Flush'],
        mechanismBrief: 'Brief extreme cold triggers vasoconstriction and sympathetic activation; rewarming delivers a powerful inflammatory-clearing blood flush throughout the entire body.',
        contraindications: [
            { condition: 'Raynaud\'s Disease', status: 'unsafe', reason: 'Extreme cold will trigger severe vasospastic attacks. Absolute contraindication.' },
            { condition: 'Cryoglobulinemia / Cold Urticaria', status: 'unsafe', reason: 'Cold-triggered immune reactions are dangerous. Do not use.' },
            { condition: 'Cardiovascular Disease', status: 'caution', reason: 'Acute cold shock increases cardiac demand. Clearance from cardiologist required.' },
            { condition: 'Pregnancy', status: 'unsafe', reason: 'Extreme cold exposure is contraindicated during pregnancy.' },
            { condition: 'Hypertension (uncontrolled)', status: 'caution', reason: 'Cold-induced vasoconstriction may cause acute blood pressure spikes.' },
            { condition: 'Open Wounds / Skin Conditions', status: 'unsafe', reason: 'Do not use with any open wounds, active infections, or compromised skin integrity.' }
        ],
        drugInteractions: [
            { drugName: 'Vasoconstrictors / Decongestants', status: 'caution', reason: 'Combined vasoconstriction may reduce peripheral circulation excessively.' },
            { drugName: 'Anticoagulants', status: 'caution', reason: 'Cold-induced changes in circulation may interact with anticoagulant therapy. Monitor closely.' }
        ],
        lastReviewed: '2026-02-01',
        reviewedBy: 'Dr. Marcus Chen, DO'
    },
};
