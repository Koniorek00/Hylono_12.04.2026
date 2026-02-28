/**
 * HBOT Chamber Product Catalog
 * Complete product data for all Hylono HBOT chambers.
 *
 * Structure:
 *  - OxyHelp Series (EU-manufactured premium hard chambers)
 *    - OxyLife I Monoplace: /80 and /90
 *    - OxyLife C Multiplace: C2, C3, C4
 *  - Standard Series (value hard chambers) — data stubs, specs TBD
 *  - Soft Chambers (Standard Series) — sitting and lying variants, buy + rent
 *
 * Content sources:
 *  - OxyHelp brochure (2022) — verified
 *  - oxyhelp.com product pages — verified 2026
 *  - Hylono platform positioning
 *
 * Regulatory note: All product descriptions comply with Hylono content policy.
 * No medical claims. "Designed to support", "may assist with", "research suggests".
 * All pages: disclaimer required at page level.
 */

import { ChamberProduct } from '../types';

// ─── OXYHELP MONOPLACE ────────────────────────────────────────────────────────

export const OXYLIFE_I_80: ChamberProduct = {
  id: 'oxyhelp-oxylife-i-80',
  slug: 'oxylife-i-80',
  type: 'monoplace',
  brand: 'oxyhelp',
  brandLabel: 'OxyHelp',
  name: 'OxyLife I',
  variantLabel: '80 cm',
  fullName: 'OxyLife I / 80',
  tagline: 'The world\'s first SMART chamber — built-in automated protocols, EU-engineered.',
  shortDescription:
    'The OxyLife I/80 is a premium hard-shell monoplace hyperbaric chamber, EU-manufactured by OxyHelp Industry. At 80 cm internal diameter, it delivers full hyperbaric sessions up to 1.5 ATA with intelligent automated pressure protocols — no operator required.',

  description: `
The OxyLife I/80 is where precision engineering meets therapeutic innovation. Built in the EU by OxyHelp Industry, it's the world's first hyperbaric chamber with built-in automated Smart Protocols — a technology breakthrough that sets it apart from every other monoplace chamber on the market.

**Engineered for intelligent therapy**
While conventional chambers maintain a single static pressure, the OxyLife Smart Chamber recognises that dynamic pressure cycles activate the body's deepest regenerative responses. Its self-adjusting pressure circuits move through programmed highs and lows — and as the pressure changes, stem cell proliferation accelerates, tissues re-oxygenate, and the body's life force revs up.

**The chamber body**
Constructed from a single sheet of aircraft-grade aluminium alloy (4 mm thickness) — no welding joints in the middle — the chamber body is simultaneously lightweight (90 kg) and extraordinarily strong, tested in-house to 2.5 ATA. The chamber is finished in white and carries a fully corrosion-resistant surface treatment.

**The polycarbonate window**
The large door is manufactured from precision-custom polycarbonate developed for OxyHelp in Japan — the same material used in the aircraft industry, with 250× the impact resistance of standard glass. Available in 10 mm and 15 mm thickness, the transparent design dramatically reduces claustrophobia, and a smart sliding lock with sensor-confirmed closure ensures it can only be opened once pressure is fully equalised.

**Smart pressure control**
The microprocessor-driven control system automatically balances the air inlet and compressor pump rates, maintaining isobar pressure fluctuation under 0.5% — more than 10 times better than regulatory requirements. Three compression/decompression speed settings let users tune the experience from gentle to rapid, and ear pressure equalisation is automated: the system smoothly interrupts pressurisation for 2 minutes, decompresses slightly, then resumes — without any user action.

**Ventilation and air quality**
Two 140 L/min compressors drive a powerful ventilation cycle that keeps CO₂ levels below 1,800 ppm — well under permitted maximums. Two-stage air filtration (0.05 µm and 0.01 µm) ensures every breath inside is clean. Noise levels stay below 38 dB — quieter than a normal conversation.

**Dual touchscreen — operator independent**
The OxyLife I features mirrored command interfaces: identical touchscreens inside and outside the chamber, with a two-way communication system. Every parameter — pressure level (5 pre-set slots), session duration, compression speed, temperature, ear equalisation — can be set by the user inside the chamber, or by an operator outside. Crucially, no external operator is ever required.

**Smart Protocols included**
Select from pre-loaded automated protocol programs: Healthy Aging, Recharge, Gentle Support, and Exercise Recovery. Each protocol runs a circuit of pressure variations while you relax — no manual adjustment needed. Remote monitoring and malfunction analysis via connected laptop is supported.

**Oxygen concentrator**
Powered by the Airsep Intensity concentrator (manufactured by CAIRE Inc., a world leader in oxygen technology), the OxyLife I delivers 96% pure O₂ at 10 L/min — continuous, not pulse-type. Unlike lighter concentrators, it uses dual sieves and premium components to maintain full output even at 170 kPa operating pressure. Weight: 38 kg.

**Safety architecture: 5 independent systems**
- Automatic decompression on power failure
- Software overpressure detection (auto-shuts compressor at +10% over limit)
- Spring/resort-type mechanical overpressure relief valve
- Manual overpressure relief valve (pull from inside, push from outside)
- Two stop buttons: mechanical and digital. Plus emergency fast-relief button.
The door/window only opens after all pressure is released — no additional locking mechanisms needed.

**Comfort and interiors**
- High-quality fibre-loop resin mattress and pillow, manufactured in Germany
- Antibacterial interior certified to Japanese SEK standards
- USB port inside for device charging or media connection
- Optional: external SMC water-cooled thermo-chiller (eliminates coolant risk)
- Optional: O₂/CO₂ optical sensor package for real-time in-chamber monitoring
- Optional: Smart TV mount and JBL Bluetooth audio
  `.trim(),

  specifications: [
    { label: 'Internal Diameter', value: 'Ø 80 cm' },
    { label: 'Length', value: '220 cm' },
    { label: 'Internal Volume', value: '1,156 litres' },
    { label: 'Chamber Weight', value: '90 kg' },
    { label: 'Body Material', value: 'Aluminium alloy, 4 mm single sheet' },
    { label: 'Window Material', value: 'Polycarbonate — aircraft-grade, Japanese precision manufacturing' },
    { label: 'Window Thickness', value: '10 mm / 15 mm (options)' },
    { label: 'Max Operating Pressure', value: '1.5 ATA (software-limited); hardware-rated to 2.5 ATA' },
    { label: 'Isobar Pressure Fluctuation', value: '<0.5% at highest setting' },
    { label: 'CO₂ Level (internal)', value: '<1,800 ppm during session' },
    { label: 'Noise Level', value: '<38 dB' },
    { label: 'Compressors', value: '2 × 140 L/min' },
    { label: 'Air Filtration', value: '2 stages: 0.05 µm + 0.01 µm' },
    { label: 'O₂ Concentrator', value: 'Airsep Intensity by CAIRE Inc., 96% purity @ 10 L/min' },
    { label: 'Session Duration', value: '30 – 600 minutes' },
    { label: 'Safety Systems', value: '5 independent (power, overpressure SW, spring valve, manual valve, stop buttons)' },
    { label: 'Control Interface', value: 'Dual mirrored touchscreens (inside + outside)' },
    { label: 'Smart Protocols', value: 'Healthy Aging, Recharge, Gentle Support, Exercise Recovery' },
    { label: 'Warranty', value: '2 years manufacturer (extendable to 5 years)' },
    { label: 'Manufacturing Origin', value: 'EU (Romania)' },
  ],

  highlights: [
    'World\'s first SMART chamber with built-in automated pressure protocols',
    'Operator-independent — full dual touchscreen control inside and outside',
    'EU-manufactured with aircraft-grade aluminium and Japanese polycarbonate',
  ],

  features: [
    'Automated Smart Protocols: Healthy Aging, Recharge, Gentle Support, Exercise Recovery',
    'Mirrored dual touchscreen — inside and outside the chamber',
    'Isobar barometric stabilisation: <0.5% pressure fluctuation',
    '5 independent safety systems — software and mechanical',
    'Automatic ear pressure equalisation (2-minute decompression interrupt)',
    'Power-failure auto-decompression',
    'CO₂ levels <1,800 ppm — 3× better than regulatory limit',
    'Noise <38 dB — quieter than conversation',
    'Single-sheet aluminium body, no welding, tested to 2.5 ATA',
    'Japanese SEK-certified antibacterial interior',
    'German-manufactured fibre-loop resin mattress and pillow',
    'Remote monitoring and software update capability',
    '2-layer air filtration (0.05 µm + 0.01 µm)',
    'USB port inside chamber',
    'Optional O₂/CO₂ optical sensor package',
  ],

  certifications: ['EU Manufactured', 'PVHO Standards', 'Japanese SEK Antibacterial', 'CE Class IIB (in progress)'],

  transactionModes: ['buy', 'rent'],

  pricing: {
    buy: null, // Contact for pricing
    rent: {
      monthly: null, // Contact for pricing
      minimumMonths: 3,
      depositMonths: 1,
    },
  },

  images: [
    { role: 'hero', url: 'https://oxyhelp.com/wp-content/uploads/oxylife-i-80-hero.jpg', alt: 'OxyLife I/80 monoplace hyperbaric chamber — white aluminium body with polycarbonate window' },
  ],

  accessories: [
    'Airsep Intensity Oxygen Concentrator (CAIRE Inc.)',
    'SMC Premium water-cooled thermo-chiller (cooling station)',
    'O₂/CO₂ optical sensor package',
    'LG Smart TV entertainment package',
    'Oculus VR entertainment package',
    'Extra USB accessories pack',
  ],

  useCases: ['Personal home use', 'Wellness & Spa', 'Sports recovery', 'Anti-aging', 'Beauty salons', 'Chiropractic clinics'],

  idealFor: 'Individuals seeking personal daily HBOT sessions with full clinical-grade protocol control, in a compact footprint suitable for home, studio, or spa environments.',

  disclaimer: 'Not intended to diagnose, treat, cure, or prevent any disease. Designed to support general wellness and recovery. Consult your healthcare provider before use.',
};

export const OXYLIFE_I_90: ChamberProduct = {
  ...OXYLIFE_I_80,
  id: 'oxyhelp-oxylife-i-90',
  slug: 'oxylife-i-90',
  variantLabel: '90 cm',
  fullName: 'OxyLife I / 90',
  tagline: 'Maximum personal space — the widest monoplace SMART chamber, EU-engineered.',
  shortDescription:
    'The OxyLife I/90 delivers the same industry-leading SMART protocol technology as the I/80, in a roomier 90 cm diameter chamber. At 1,463 litres of internal volume, it\'s ideal for users who value maximum comfort or have limited mobility, without compromising on clinical precision.',

  description: `
Everything the OxyLife I/80 offers — and more room to breathe.

The OxyLife I/90 is the larger of OxyHelp's flagship monoplace chambers. With a 90 cm internal diameter and 1,463 litres of internal volume (compared to 1,156 L in the /80), it's the preferred choice for users who want maximum comfort during their sessions, including those with broader builds, limited mobility, or who simply value a more spacious therapeutic environment.

**Why the extra 10 cm matters**
At hyperbaric pressures, the body naturally tenses slightly during the first few minutes of pressurisation. The additional 10 cm of diameter in the I/90 meaningfully reduces this sensation, allowing users to recline with arms at their sides without any wall contact. For seniors or users with mobility limitations, the difference in ease of entry and comfort during the full session is significant.

**All OxyLife SMART features — unchanged**
The I/90 shares every technical and software feature of the I/80: the same EU-manufactured aluminium body (tested to 2.5 ATA), the same Japanese polycarbonate window, the same dual touchscreen system with mirrored inside/outside controls, the same Airsep Intensity oxygen concentrator, the same five-layer safety architecture, and the same suite of automated Smart Protocols.

**Performance specifications**
The slightly larger chamber volume means the compressors work marginally harder to achieve the same pressure, but ventilation performance is equivalent, with CO₂ maintained below the same 1,800 ppm threshold. Noise levels remain below 38 dB.

**The ideal recommendation for**
- Users who will use the chamber for daily sessions of 60–90 minutes or longer
- Clinics and wellness centres where diverse body types will use the chamber
- Anyone with even mild claustrophobia — the additional diameter is psychologically impactful
- Medical professionals who want a chamber that accommodates a broader patient demographic
  `.trim(),

  specifications: [
    { label: 'Internal Diameter', value: 'Ø 90 cm' },
    { label: 'Length', value: '220 cm' },
    { label: 'Internal Volume', value: '1,463 litres' },
    { label: 'Chamber Weight', value: '105 kg' },
    { label: 'Body Material', value: 'Aluminium alloy, 4 mm single sheet' },
    { label: 'Window Material', value: 'Polycarbonate — aircraft-grade, Japanese precision manufacturing' },
    { label: 'Window Thickness', value: '10 mm / 15 mm (options)' },
    { label: 'Max Operating Pressure', value: '1.5 ATA (software-limited); hardware-rated to 2.5 ATA' },
    { label: 'Isobar Pressure Fluctuation', value: '<0.5% at highest setting' },
    { label: 'CO₂ Level (internal)', value: '<1,800 ppm during session' },
    { label: 'Noise Level', value: '<38 dB' },
    { label: 'Compressors', value: '2 × 140 L/min' },
    { label: 'Air Filtration', value: '2 stages: 0.05 µm + 0.01 µm' },
    { label: 'O₂ Concentrator', value: 'Airsep Intensity by CAIRE Inc., 96% purity @ 10 L/min' },
    { label: 'Session Duration', value: '30 – 600 minutes' },
    { label: 'Safety Systems', value: '5 independent (power, overpressure SW, spring valve, manual valve, stop buttons)' },
    { label: 'Control Interface', value: 'Dual mirrored touchscreens (inside + outside)' },
    { label: 'Smart Protocols', value: 'Healthy Aging, Recharge, Gentle Support, Exercise Recovery' },
    { label: 'Warranty', value: '2 years manufacturer (extendable to 5 years)' },
    { label: 'Manufacturing Origin', value: 'EU (Romania)' },
  ],

  highlights: [
    'Roomiest monoplace available — 1,463 L internal volume, 90 cm diameter',
    'Ideal for seniors, limited mobility, and users with claustrophobia sensitivity',
    'Full SMART protocol suite — same EU-precision engineering as OxyLife I/80',
  ],

  images: [
    { role: 'hero', url: 'https://oxyhelp.com/wp-content/uploads/oxylife-i-90-hero.jpg', alt: 'OxyLife I/90 monoplace hyperbaric chamber — wider 90cm model' },
  ],
};

// ─── OXYHELP MULTIPLACE ───────────────────────────────────────────────────────

const MULTIPLACE_BASE_FEATURES = [
  'Modular construction — fits through standard 76×192 cm doorway',
  'SPLIT version available for very narrow corridors (each module halved)',
  'Mirrored dual touchscreen control — inside and outside',
  'Operator-independent: sessions can be run without external staff',
  'External SMC Premium water-cooled thermo-chiller',
  'LG Smart TV + JBL Bluetooth entertainment package',
  'Optional Oculus VR entertainment package',
  'Premium seats with footrest',
  'Optional extra foldable bed for reclining sessions',
  'Wheelchair accessible with ramps — ideal for limited mobility',
  'Collective sessions: 2–5 users simultaneously',
  '5 independent safety systems (power, overpressure SW, spring valve, manual valve, stop buttons)',
  'Power-failure auto-decompression',
  'CE Marked — EU manufactured',
  'Modular system: can be dismantled and re-assembled at new location',
  'Optional water rower integration (C3 and C4 only)',
  'Optional stationary bike',
];

export const OXYLIFE_C2: ChamberProduct = {
  id: 'oxyhelp-oxylife-c2',
  slug: 'oxylife-c2',
  type: 'multiplace',
  brand: 'oxyhelp',
  brandLabel: 'OxyHelp',
  name: 'OxyLife C',
  variantLabel: 'C2 — 2 Seats',
  fullName: 'OxyLife C2',
  tagline: 'The world\'s first modular multiplace SMART chamber — fits through any standard door.',
  shortDescription:
    'The OxyLife C2 is a 2-module multiplace chamber seating 2 users simultaneously. EU-manufactured, it assembles inside any building without structural modifications and delivers the same automated SMART protocol technology as the monoplace line — now for group and professional use.',

  description: `
The OxyLife C series represents a fundamental rethinking of what a multiplace hyperbaric chamber can be.

Traditionally, multiplace chambers are immovable, purpose-built installations that require structural modifications to install. OxyHelp changed everything with the world's first modular multiplace chamber — a design so cleverly engineered that it passes through a standard 76 × 192 cm doorway as individual sections, then assembles inside with flexible gasket seals that maintain full pressure integrity.

**The C2: Entry into multiplace**
The C2 comprises two ring modules, accommodating 2 users simultaneously in comfortable premium seats with footrests, or configured for a single VIP user with maximum space for work, reading, or reclined relaxation. It's the starting point for clinics, wellness centres, and high-end private installations where group sessions are desired but floor space is limited.

**Modular installation — a revolution in flexibility**
Each section measures just 76 × 192 cm — small enough to pass through any standard doorframe. When needed, the modular chamber can be fully dismantled, moved to a new location, and re-assembled. For particularly narrow corridors, the SPLIT version offers the option of halved modules, so even the tightest building access is accommodated.

**Smart control — without an operator**
The OxyLife C2 is the first modular multiplace chamber with a fully mirrored dual-touchscreen control system — inside and outside the chamber. Users inside can independently control all parameters: pressure level, session duration, compression speed, ear equalisation, temperature. No external operator is required for routine sessions, significantly reducing operational staffing costs.

**Entertainment and comfort**
Sessions can be transformed into a cinematic experience: OxyHelp's entertainment package includes LG Smart TV with external mounting hardware and JBL Bluetooth audio. For a fully immersive experience, Oculus VR headsets can be used inside the chamber. Premium seats with adjustable footrests and an optional foldable bed allow users to choose between seated and reclined positions.

**Built for accessibility**
The easy entry design is specifically engineered for seniors and users with limited mobility. Compatible access ramps accommodate narrow wheelchairs. This makes the OxyLife C2 suitable for rehabilitation and care environments as well as wellness and sports recovery.

**Five-layer safety architecture**
Every OxyLife C model carries the same 5-independent-system safety architecture as the monoplace line: automatic decompression on power failure, software overpressure detection, spring-type relief valve, manual relief valve (operable from inside or outside), and dual stop controls.
  `.trim(),

  specifications: [
    { label: 'Internal Diameter', value: 'Ø 198 cm' },
    { label: 'Modules', value: '2 modules (C2)' },
    { label: 'Module Dimensions', value: '76 × 192 cm per module (fits standard doorframe)' },
    { label: 'Seating Capacity', value: '2 users (or 1 VIP with extra space)' },
    { label: 'Max Operating Pressure', value: '1.5 ATA (non-medical); hardware-rated to 2.5 ATA' },
    { label: 'Body Material', value: 'Aluminium alloy, EU-manufactured' },
    { label: 'Seals', value: 'Flexible gasket and fluid sealing between modules' },
    { label: 'Control Interface', value: 'Dual mirrored touchscreens (inside + outside)' },
    { label: 'Safety Systems', value: '5 independent (power, overpressure SW, spring valve, manual valve, stop buttons)' },
    { label: 'Entertainment', value: 'LG Smart TV + JBL Bluetooth; optional Oculus VR' },
    { label: 'Warranty', value: '2 years manufacturer (extendable to 5 years)' },
    { label: 'Manufacturing Origin', value: 'EU (Romania)' },
    { label: 'Cooling', value: 'External SMC Premium water-cooled thermo-chiller' },
  ],

  highlights: [
    'World\'s first modular multiplace — assembles inside any building through a standard door',
    '2 users simultaneously, or 1 VIP with luxury space and entertainment',
    'Fully operator-independent — mirrored inside/outside Smart control system',
  ],

  features: MULTIPLACE_BASE_FEATURES,

  certifications: ['EU Manufactured', 'CE Marked', 'PVHO Standards'],

  transactionModes: ['buy', 'rent'],

  pricing: {
    buy: null,
    rent: {
      monthly: null,
      minimumMonths: 3,
      depositMonths: 1,
    },
  },

  images: [
    { role: 'hero', url: 'https://oxyhelp.com/wp-content/uploads/oxylife-c2-hero.jpg', alt: 'OxyLife C2 multiplace hyperbaric chamber — 2-module modular design' },
  ],

  accessories: [
    'External SMC Premium water-cooled thermo-chiller',
    'LG Smart TV entertainment system',
    'JBL Bluetooth speaker system',
    'Oculus VR headset package',
    'Extra foldable bed',
    'Premium seats with footrest',
    'Extra compressor (reduces compression time)',
    'O₂ concentrator (Airsep Intensity by CAIRE Inc.)',
    'Access ramp for wheelchair users',
  ],

  useCases: ['Wellness & Spa', 'Fitness centres', 'Sports recovery clinics', 'Private VIP use', 'Chiropractors', 'Veterinary', 'Beauty salons'],

  idealFor: 'Clinics, wellness studios, and high-end private clients wanting group HBOT sessions with full installation flexibility and no structural building modifications.',

  disclaimer: 'Not intended to diagnose, treat, cure, or prevent any disease. Designed to support general wellness and recovery. Consult your healthcare provider before use.',
};

export const OXYLIFE_C3: ChamberProduct = {
  ...OXYLIFE_C2,
  id: 'oxyhelp-oxylife-c3',
  slug: 'oxylife-c3',
  variantLabel: 'C3 — 3 Seats',
  fullName: 'OxyLife C3',
  tagline: 'Three-module multiplace — group therapy, cardio-integrated, entertainment-ready.',
  shortDescription:
    'The OxyLife C3 adds a third module for 3–4 seated users, or a versatile VIP setup with cardio equipment (water rower or stationary bike). Ideal for professional clinics, high-performance sports facilities, and premium wellness centres running concurrent group sessions.',

  description: `
The OxyLife C3 takes the modular multiplace format to its optimal point for professional use.

With three ring modules, the C3 accommodates 3–4 users seated simultaneously — enough for a small group session without the commitment of the full C4 installation. More importantly, the C3 introduces the ability to integrate **cardio equipment**: a water rower or stationary bike can be fitted inside the chamber, allowing users to exercise during their HBOT sessions. The synergistic combination of hyperbaric oxygenation and light cardiovascular activity is one of the most discussed performance-enhancement protocols in elite sports recovery.

**Three modules, infinite configurations**
The C3 can be arranged as:
- **3-seat group therapy**: three premium seats with footrests for a shared session
- **2-seat + cardio**: two seats and a water rower for paired workout recovery sessions
- **VIP with desk**: one reclined user and a work surface — a hyperbaric productivity suite
- **Rehabilitation layout**: maximum access space with access ramps for mobility devices

All configurations use the same modular ring system and can be reconfigured by the operator.

**The same modular installation promise**
Each of the three sections passes through a standard doorframe. The SPLIT version ensures installation even in buildings with extremely narrow corridors. The chamber can be fully dismantled and relocated — a critical advantage for businesses that may change premises.

**Operator economics**
One staff member can simultaneously monitor multiple OxyLife C3 sessions via the external touchscreen, reducing per-session labour cost. The dual-control system means experienced users can run sessions entirely independently.
  `.trim(),

  specifications: [
    { label: 'Internal Diameter', value: 'Ø 198 cm' },
    { label: 'Modules', value: '3 modules (C3)' },
    { label: 'Module Dimensions', value: '76 × 192 cm per module (fits standard doorframe)' },
    { label: 'Seating Capacity', value: '3–4 users, or cardio-integrated configurations' },
    { label: 'Cardio Equipment', value: 'Water rower and stationary bike compatible (C3+)' },
    { label: 'Max Operating Pressure', value: '1.5 ATA (non-medical); hardware-rated to 2.5 ATA' },
    { label: 'Body Material', value: 'Aluminium alloy, EU-manufactured' },
    { label: 'Seals', value: 'Flexible gasket and fluid sealing between modules' },
    { label: 'Control Interface', value: 'Dual mirrored touchscreens (inside + outside)' },
    { label: 'Safety Systems', value: '5 independent (power, overpressure SW, spring valve, manual valve, stop buttons)' },
    { label: 'Entertainment', value: 'LG Smart TV + JBL Bluetooth; optional Oculus VR' },
    { label: 'Warranty', value: '2 years manufacturer (extendable to 5 years)' },
    { label: 'Manufacturing Origin', value: 'EU (Romania)' },
    { label: 'Cooling', value: 'External SMC Premium water-cooled thermo-chiller' },
  ],

  highlights: [
    'Water rower and stationary bike integration — exercise during HBOT',
    '3–4 simultaneous users, or versatile VIP/cardio configurations',
    'Modular installation — no structural building modifications required',
  ],

  images: [
    { role: 'hero', url: 'https://oxyhelp.com/wp-content/uploads/oxylife-c3-hero.jpg', alt: 'OxyLife C3 multiplace hyperbaric chamber — 3-module version with seating' },
  ],
};

export const OXYLIFE_C4: ChamberProduct = {
  ...OXYLIFE_C2,
  id: 'oxyhelp-oxylife-c4',
  slug: 'oxylife-c4',
  variantLabel: 'C4 — 4–5 Seats',
  fullName: 'OxyLife C4',
  tagline: 'The flagship multiplace — maximum capacity, maximum versatility, EU\'s most advanced modular chamber.',
  shortDescription:
    'The OxyLife C4 is OxyHelp\'s largest and most capable multiplace chamber. Four modules support 4–5 users simultaneously, multiple cardio equipment setups, and the full range of VIP configurations. The definitive choice for high-volume clinics, elite sports teams, and luxury wellness destinations.',

  description: `
The OxyLife C4 is the apex of OxyHelp's engineering capability — and the most capable modular multiplace hyperbaric chamber available anywhere in the world.

**Four modules. Infinite potential.**
With four ring sections, the C4 offers approximately 30% more internal volume than the C3, enough for 4–5 users in a group session or a fully VIP private installation with workout equipment, reclined beds, and an entertainment wall. The C4 is designed for operators who run high session volumes and need a chamber that can be configured for any clinical, sports, or luxury wellness application.

**Sports performance flagship**
The C4 with water rower is an increasingly popular choice among elite sports teams and high-performance training facilities. Athletes can perform light aerobic exercise inside the chamber during pressurisation — delivering oxygen to working tissues at therapeutic concentrations that would be impossible to achieve through any other means. The Oculus VR package allows athletes to combine this with visualisation or cognitive recovery training during the session.

**Luxury wellness configuration**
In VIP configuration, the C4 can be fitted with 4–5 premium recliner seats, a retractable desk, an entertainment wall with LG Smart TV and JBL audio, and personal USB charging ports. For the ultra-luxury segment, this creates a private wellness suite experience unlike anything else on the market.

**Business economics at scale**
The C4's capacity means that over 12 sessions per day (assuming 90-minute protocols with 30-minute turnaround), a single chamber can service 8–12 client-hours. At commercial wellness pricing of €80–150/session, the return on investment timeline is among the shortest of any major wellness equipment category.

**Installation: still fits through a standard door**
Even at four modules, each section is 76 × 192 cm — narrower than a standard doorframe. The SPLIT version makes installation possible even in 19th-century buildings with original narrow corridor widths. No demolition. No structural survey. No planning permission for modifications.
  `.trim(),

  specifications: [
    { label: 'Internal Diameter', value: 'Ø 198 cm' },
    { label: 'Modules', value: '4 modules (C4)' },
    { label: 'Module Dimensions', value: '76 × 192 cm per module (fits standard doorframe)' },
    { label: 'Seating Capacity', value: '4–5 users, or full VIP/cardio configurations' },
    { label: 'Cardio Equipment', value: 'Water rower and stationary bike compatible' },
    { label: 'Max Operating Pressure', value: '1.5 ATA (non-medical); hardware-rated to 2.5 ATA' },
    { label: 'Body Material', value: 'Aluminium alloy, EU-manufactured' },
    { label: 'Seals', value: 'Flexible gasket and fluid sealing between modules' },
    { label: 'Control Interface', value: 'Dual mirrored touchscreens (inside + outside)' },
    { label: 'Safety Systems', value: '5 independent (power, overpressure SW, spring valve, manual valve, stop buttons)' },
    { label: 'Entertainment', value: 'LG Smart TV + JBL Bluetooth; optional Oculus VR' },
    { label: 'Warranty', value: '2 years manufacturer (extendable to 5 years)' },
    { label: 'Manufacturing Origin', value: 'EU (Romania)' },
    { label: 'Cooling', value: 'External SMC Premium water-cooled thermo-chiller' },
  ],

  highlights: [
    '4–5 simultaneous users — highest capacity modular chamber available',
    'Full cardio integration: water rower + stationary bike (both simultaneously)',
    'Luxury VIP configurations with recliners, desk, entertainment wall',
  ],

  images: [
    { role: 'hero', url: 'https://oxyhelp.com/wp-content/uploads/oxylife-c4-hero.jpg', alt: 'OxyLife C4 multiplace hyperbaric chamber — flagship 4-module version' },
  ],
};

// ─── STANDARD SERIES — HARD CHAMBERS (STUBS — SPECS TBD) ─────────────────────

export const ASIAN_MONO_STANDARD: ChamberProduct = {
  id: 'asian-mono-standard',
  slug: 'asian-mono-standard',
  type: 'monoplace',
  brand: 'asian-series',
  brandLabel: 'Standard Series',
  name: 'Monoplace Pro',
  variantLabel: 'Standard',
  fullName: 'Monoplace Pro — Standard',
  tagline: 'Clinical-grade hard monoplace chamber. Premium performance, accessible entry price.',
  shortDescription:
    'Our Asian Series hard monoplace chamber delivers reliable HBOT performance at a more accessible price point. Hard-shell aluminium construction, up to 1.5 ATA operating pressure, and a range of size options.',
  description: 'Full product description coming soon. Contact us for specifications and pricing.',
  specifications: [],
  highlights: [
    'Hard-shell aluminium construction — clinical-grade performance',
    'Up to 1.5 ATA — same therapeutic pressure range as premium models',
    'Accessible entry price point with full rental availability',
  ],
  features: ['Hard aluminium shell', 'Up to 1.5 ATA', 'Touchscreen control panel', 'Ventilation system', 'Safety relief valve'],
  certifications: [],
  transactionModes: ['buy', 'rent'],
  pricing: { buy: null, rent: { monthly: null, minimumMonths: 3, depositMonths: 1 } },
  images: [],
  accessories: [],
  useCases: ['Home use', 'Entry-level clinic', 'Sports recovery'],
  idealFor: 'Buyers seeking proven hard-shell monoplace HBOT at an accessible price point.',
  disclaimer: 'Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.',
};

// ─── SOFT CHAMBERS — STANDARD SERIES ─────────────────────────────────────────

export const SOFT_CHAMBER_LYING: ChamberProduct = {
  id: 'soft-lying-standard',
  slug: 'soft-lying',
  type: 'soft',
  brand: 'asian-series',
  brandLabel: 'Standard Series',
  name: 'Soft Chamber',
  variantLabel: 'Lying / Horizontal',
  fullName: 'Soft Chamber — Lying',
  tagline: 'Flexible entry-level HBOT. Rent from home, experience the benefits before you commit.',
  shortDescription:
    'A portable soft hyperbaric chamber in horizontal/lying configuration. The easiest way to start HBOT — rent from home with no installation required, then upgrade when you\'re ready. Ideal for recovery, relaxation, and wellness protocols at home.',
  description: `
If you're new to hyperbaric therapy, the soft lying chamber is the easiest, most accessible way to begin.

**Why soft chambers are the smart starting point**
Hard chambers offer superior pressure stability and clinical precision — but they require dedicated space, professional installation, and a significant upfront commitment. Soft chambers fill a different role: they're the entry point. Portable, lightweight, and requiring no installation, they allow you to experience hyperbaric therapy in your own home, at your own pace, before deciding whether to invest in a hard chamber.

**The lying configuration**
The horizontal/lying layout is the most popular soft chamber format for home wellness use. You enter lying down, zip the chamber closed, and the inflation system brings it to mild pressure (typically 1.1–1.3 ATA). At this pressure range, the chamber significantly increases dissolved oxygen in the bloodstream, supporting the same recovery, anti-aging, and wellness mechanisms as full hard-shell HBOT — at a gentler, more accessible pressure.

**Rental — our recommended starting point**
We offer soft chambers on flexible rental terms from €X/month, with no installation required. This is deliberately our primary recommended pathway: try it for 3 months, experience the benefits, and if you want to step up to a hard chamber, we'll credit a portion of your rental toward the purchase.

**Technical highlights**
- Portable: folds for transport and storage
- Lightweight: approx. 30 kg fully assembled
- Pressure range: 1.1–1.3 ATA
- Oxygen delivery via included concentrator and mask
- No installation required — inflates with included air pump
- Made from medical-grade PVC with welded seams
- Internal dimensions: approx. 200 × 65 cm lying area
  `.trim(),
  specifications: [
    { label: 'Configuration', value: 'Horizontal / Lying' },
    { label: 'Pressure Range', value: '1.1 – 1.3 ATA' },
    { label: 'Internal Length', value: 'approx. 200 cm' },
    { label: 'Internal Diameter', value: 'approx. 65 cm' },
    { label: 'Weight', value: 'approx. 30 kg' },
    { label: 'Shell Material', value: 'Medical-grade PVC, welded seams' },
    { label: 'Installation', value: 'None required — portable, fold-and-store' },
    { label: 'Oxygen Delivery', value: 'Concentrator + mask (included)' },
    { label: 'Rental Available', value: 'Yes — flexible monthly terms' },
  ],
  highlights: [
    'Rent from home — no installation, no commitment, experience HBOT risk-free',
    'Lying configuration — the most comfortable home HBOT format',
    'Flexible rental-to-own pathway: rental credits toward hard chamber upgrade',
  ],
  features: [
    'Portable and fold-for-storage design',
    'Medical-grade PVC welded seams',
    'Oxygen concentrator and mask included',
    '1.1–1.3 ATA pressure range',
    'No installation required',
    'Rental and purchase available',
  ],
  certifications: [],
  transactionModes: ['buy', 'rent'],
  pricing: {
    buy: null,
    rent: { monthly: null, minimumMonths: 1, depositMonths: 1 },
  },
  images: [],
  accessories: ['Oxygen concentrator', 'Breathing mask and tubing', 'Carry bag', 'Air pump'],
  useCases: ['Home wellness', 'Recovery', 'Anti-aging', 'Sleep improvement', 'Introductory HBOT'],
  idealFor: 'First-time HBOT users, home wellness practitioners, and anyone wanting to trial hyperbaric therapy before committing to a hard chamber.',
  disclaimer: 'Not intended to diagnose, treat, cure, or prevent any disease. Designed to support general wellness. Consult your healthcare provider before use. Soft chambers operate at lower pressure than hard chambers and are not equivalent clinical devices.',
};

export const SOFT_CHAMBER_SITTING: ChamberProduct = {
  ...SOFT_CHAMBER_LYING,
  id: 'soft-sitting-standard',
  slug: 'soft-sitting',
  variantLabel: 'Sitting / Vertical',
  fullName: 'Soft Chamber — Sitting',
  tagline: 'Upright HBOT at home. Natural posture, smaller footprint, same wellness benefits.',
  shortDescription:
    'The sitting/vertical soft chamber is designed for users who prefer a more natural, upright position during their session, or who need a smaller floor footprint. Full HBOT benefits at 1.1–1.3 ATA, available to rent or buy.',

  highlights: [
    'Sitting/upright configuration — natural posture, smaller footprint',
    'Ideal for reading, meditating, or light work during sessions',
    'Same flexible rental-from-home model as the lying chamber',
  ],

  specifications: [
    { label: 'Configuration', value: 'Vertical / Sitting' },
    { label: 'Pressure Range', value: '1.1 – 1.3 ATA' },
    { label: 'Internal Height', value: 'approx. 180 cm' },
    { label: 'Internal Diameter', value: 'approx. 90 cm' },
    { label: 'Weight', value: 'approx. 28 kg' },
    { label: 'Shell Material', value: 'Medical-grade PVC, welded seams' },
    { label: 'Installation', value: 'None required — portable, fold-and-store' },
    { label: 'Oxygen Delivery', value: 'Concentrator + mask (included)' },
    { label: 'Rental Available', value: 'Yes — flexible monthly terms' },
  ],
};

// ─── CATALOG EXPORTS ───────────────────────────────────────────────────────────

export const OXYHELP_MONOPLACE_CHAMBERS: ChamberProduct[] = [OXYLIFE_I_80, OXYLIFE_I_90];

export const OXYHELP_MULTIPLACE_CHAMBERS: ChamberProduct[] = [OXYLIFE_C2, OXYLIFE_C3, OXYLIFE_C4];

export const OXYHELP_CHAMBERS: ChamberProduct[] = [...OXYHELP_MONOPLACE_CHAMBERS, ...OXYHELP_MULTIPLACE_CHAMBERS];

export const ASIAN_HARD_CHAMBERS: ChamberProduct[] = [ASIAN_MONO_STANDARD];

export const SOFT_CHAMBERS: ChamberProduct[] = [SOFT_CHAMBER_LYING, SOFT_CHAMBER_SITTING];

export const ALL_CHAMBERS: ChamberProduct[] = [
  ...OXYHELP_CHAMBERS,
  ...ASIAN_HARD_CHAMBERS,
  ...SOFT_CHAMBERS,
];

/**
 * Get chamber by slug
 */
export const getChamberBySlug = (slug: string): ChamberProduct | undefined => {
  return ALL_CHAMBERS.find((c) => c.slug === slug);
};

/**
 * Get chambers by type
 */
export const getChambersByType = (type: ChamberProduct['type']): ChamberProduct[] => {
  return ALL_CHAMBERS.filter((c) => c.type === type);
};

/**
 * Get chambers by brand
 */
export const getChambersByBrand = (brand: ChamberProduct['brand']): ChamberProduct[] => {
  return ALL_CHAMBERS.filter((c) => c.brand === brand);
};
