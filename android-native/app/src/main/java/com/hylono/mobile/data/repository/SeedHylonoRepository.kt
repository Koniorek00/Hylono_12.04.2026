package com.hylono.mobile.data.repository

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ClientNote
import com.hylono.mobile.data.model.ClientSession
import com.hylono.mobile.data.model.ClinicClient
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.FleetDevice
import com.hylono.mobile.data.model.FleetStatus
import com.hylono.mobile.data.model.HylonoAppData
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.PartnerLocation
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.Protocol
import com.hylono.mobile.data.model.ProtocolDay
import com.hylono.mobile.data.model.ProtocolSession
import com.hylono.mobile.data.model.ProtocolWeek
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.RiskLevel
import com.hylono.mobile.data.model.ServiceLog
import com.hylono.mobile.data.model.SubmissionResult
import com.hylono.mobile.data.model.SupportInfo

class SeedHylonoRepository(
    private val intakeGateway: HylonoIntakeGateway,
) : HylonoRepository {
    private val seedData = HylonoAppData(
        products = listOf(
            Product(
                id = "hbot-st1700",
                title = "HBOT ST1700",
                modality = "HBOT",
                shortDescription = "Premium mild hyperbaric chamber for recovery, cognitive clarity, and structured home routines.",
                intendedUse = "Home wellness",
                purchasePriceLabel = "24,900",
                financingLabel = "Financing from 499 / month",
                rentalPriceLabel = "Rental from 1,299 / month",
                rentalMonthlyPrice = 1299,
                goalTags = listOf("recovery", "sleep", "vitality"),
                highlights = listOf(
                    "1.3 to 1.5 ATA pressure range",
                    "10 L/min oxygen concentrator compatible",
                    "Quiet home-use profile below 55 dB",
                ),
                safetyNotes = listOf(
                    "Increase pressure exposure gradually and pause if ear discomfort appears.",
                    "Use approved oxygen and pressure accessories only.",
                    "Consult specialist oversight when chronic conditions are present.",
                ),
                protocolIds = listOf("recovery-oxygen-foundation", "vitality-dual-stack"),
                supportNote = "Tele-consult onboarding and concierge install planning included.",
                reviewStatus = "Selected from the website buying guide and protocol stack.",
            ),
            Product(
                id = "h2-hop450",
                title = "Hydrogen HOP-450",
                modality = "Hydrogen",
                shortDescription = "Compact inhalation and hydration system for daily vitality, stress balance, and recovery routines.",
                intendedUse = "Home wellness",
                purchasePriceLabel = "2,400",
                financingLabel = "Financing from 79 / month",
                rentalPriceLabel = "Rental from 179 / month",
                rentalMonthlyPrice = 179,
                goalTags = listOf("stress", "comfort", "vitality"),
                highlights = listOf(
                    "99.99% hydrogen purity",
                    "300 to 900 ml/min flow range",
                    "Hydrogen water output above 1200 ppb",
                ),
                safetyNotes = listOf(
                    "Use distilled or reverse-osmosis water only.",
                    "Operate in a ventilated area with original tubing.",
                    "Best suited for lower-friction daily use and recovery pairing.",
                ),
                protocolIds = listOf("stress-balance-h2-foundation", "vitality-dual-stack"),
                supportNote = "Configured for both inhalation onboarding and protocol adherence coaching.",
                reviewStatus = "Seeded from the website product and protocol content.",
            ),
            Product(
                id = "rlt-aurora-pro",
                title = "Aurora Pro Panel",
                modality = "PBM / Red Light",
                shortDescription = "Medical-grade red and near-infrared panel for skin, inflammation, and recovery routines.",
                intendedUse = "Home and studio",
                purchasePriceLabel = "1,490",
                financingLabel = "Financing from 42 / month",
                rentalPriceLabel = "Rental from 150 / month",
                rentalMonthlyPrice = 150,
                goalTags = listOf("skin", "pain", "recovery", "longevity"),
                highlights = listOf(
                    "660 nm and 850 nm wavelengths",
                    "Irradiance above 100 mW/cm²",
                    "0 Hz flicker continuous-wave delivery",
                ),
                safetyNotes = listOf(
                    "Reduce exposure when using photosensitizing medication.",
                    "Avoid direct treatment over areas requiring specialist cancer review.",
                    "Hydration and distance discipline improve session consistency.",
                ),
                protocolIds = listOf("recovery-oxygen-foundation"),
                supportNote = "Strong fit for retail guidance, recovery clubs, and at-home routines.",
                reviewStatus = "Based on the website technology detail and Nexus fleet examples.",
            ),
            Product(
                id = "pemf-core-mat",
                title = "Core PEMF Mat",
                modality = "PEMF + VNS",
                shortDescription = "Low-friction magnetic recovery system for nervous-system downshift, pain support, and daily reset.",
                intendedUse = "Home, clinic, and sport recovery",
                purchasePriceLabel = "4,200",
                financingLabel = "Financing from 115 / month",
                rentalPriceLabel = "Rental from 350 / month",
                rentalMonthlyPrice = 350,
                goalTags = listOf("sleep", "pain", "recovery", "cognitive"),
                highlights = listOf(
                    "10 to 500 Gauss intensity range",
                    "1 to 50 Hz frequency programs",
                    "Vagus-oriented reset use cases",
                ),
                safetyNotes = listOf(
                    "Do not use around pacemakers.",
                    "Use clinical oversight with epilepsy or active bleeding risk.",
                    "Best deployed as a recurring maintenance modality rather than a one-off fix.",
                ),
                protocolIds = listOf("stress-balance-h2-foundation"),
                supportNote = "Useful as both a consumer entry modality and clinic utilization driver.",
                reviewStatus = "Derived from the website technology library and partner fleet UI.",
            ),
        ),
        protocols = listOf(
            Protocol(
                slug = "recovery-oxygen-foundation",
                title = "Recovery Oxygen Foundation",
                goal = "Sports recovery",
                difficulty = "Beginner",
                durationWeeks = 4,
                timePerDay = "45 to 70 min",
                shortDescription = "HBOT-first routine for recovery rhythm, sleep depth, and post-training reset.",
                targetAudience = "Active adults, runners, strength athletes, and high-load professionals",
                reviewer = "Hylono Research Review",
                safetyNotes = "Increase pressure exposure gradually. Stop and decompress if ear or sinus discomfort appears.",
                contraindications = listOf(
                    "Untreated pneumothorax",
                    "Acute ear pressure injury",
                ),
                weeks = listOf(
                    ProtocolWeek(
                        number = 1,
                        title = "Adaptation",
                        days = listOf(
                            ProtocolDay(1, listOf(ProtocolSession("HBOT", "45 min", "1.3 ATA, calm breathing cadence"))),
                            ProtocolDay(3, listOf(ProtocolSession("HBOT", "50 min", "1.3 ATA, hydration before and after"))),
                            ProtocolDay(5, listOf(ProtocolSession("HBOT", "55 min", "1.35 ATA, evening recovery window"))),
                        ),
                    ),
                    ProtocolWeek(
                        number = 2,
                        title = "Consistency",
                        days = listOf(
                            ProtocolDay(2, listOf(ProtocolSession("HBOT", "60 min", "1.35 ATA, low-stimulus environment"))),
                            ProtocolDay(4, listOf(ProtocolSession("HBOT", "60 min", "1.4 ATA, recovery-focused breathing"))),
                        ),
                    ),
                ),
            ),
            Protocol(
                slug = "stress-balance-h2-foundation",
                title = "Stress Balance H2 Foundation",
                goal = "Stress and clarity balance",
                difficulty = "Beginner",
                durationWeeks = 4,
                timePerDay = "25 to 40 min",
                shortDescription = "Daily hydrogen routine for calmer focus, smoother energy, and lower fatigue load.",
                targetAudience = "Knowledge workers, founders, shift workers, and travel-heavy professionals",
                reviewer = "Hylono Research Review",
                safetyNotes = "Use distilled or reverse-osmosis water only and keep tubing clean between sessions.",
                contraindications = listOf("Specialist oversight is advised in severe respiratory instability"),
                weeks = listOf(
                    ProtocolWeek(
                        number = 1,
                        title = "Calibration",
                        days = listOf(
                            ProtocolDay(
                                1,
                                listOf(
                                    ProtocolSession("Hydrogen inhalation", "20 min", "300 to 450 ml/min, seated breathing"),
                                    ProtocolSession("Hydrogen water", "5 min prep", "One serving post-session above 1200 ppb"),
                                ),
                            ),
                            ProtocolDay(4, listOf(ProtocolSession("Hydrogen inhalation", "25 min", "450 ml/min, low-distraction setting"))),
                        ),
                    ),
                    ProtocolWeek(
                        number = 2,
                        title = "Daily rhythm",
                        days = listOf(
                            ProtocolDay(2, listOf(ProtocolSession("Hydrogen inhalation", "30 min", "450 to 600 ml/min, morning or early afternoon"))),
                            ProtocolDay(
                                5,
                                listOf(
                                    ProtocolSession(
                                        modality = "Hydrogen water",
                                        duration = "5 min prep",
                                        parameters = "One serving pre-evening wind-down",
                                        note = "Pair with lower screen intensity.",
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            Protocol(
                slug = "vitality-dual-stack",
                title = "Vitality Dual Stack",
                goal = "Whole-system vitality",
                difficulty = "Intermediate",
                durationWeeks = 6,
                timePerDay = "60 to 95 min",
                shortDescription = "Dual-modality stack combining oxygen pressure and hydrogen sessions for consistent vitality.",
                targetAudience = "Committed users seeking a protocol-first home wellness routine",
                reviewer = "Hylono Research Review",
                safetyNotes = "Introduce the stack gradually and leave recovery buffer between pressure and follow-up inhalation.",
                contraindications = listOf(
                    "Untreated pneumothorax",
                    "Acute ear pressure injury",
                    "Use specialist review for severe respiratory instability",
                ),
                weeks = listOf(
                    ProtocolWeek(
                        number = 1,
                        title = "Stack onboarding",
                        days = listOf(
                            ProtocolDay(
                                1,
                                listOf(
                                    ProtocolSession("HBOT", "50 min", "1.3 ATA, low-stimulus session"),
                                    ProtocolSession("Hydrogen inhalation", "20 min", "300 to 450 ml/min after decompression"),
                                ),
                            ),
                            ProtocolDay(3, listOf(ProtocolSession("Hydrogen water", "5 min prep", "Morning serving above 1200 ppb"))),
                        ),
                    ),
                    ProtocolWeek(
                        number = 2,
                        title = "Rhythm and load",
                        days = listOf(
                            ProtocolDay(
                                2,
                                listOf(
                                    ProtocolSession("HBOT", "60 min", "1.35 ATA, recovery-focused breathing"),
                                    ProtocolSession("Hydrogen inhalation", "25 min", "450 ml/min, easy seated breathing"),
                                ),
                            ),
                            ProtocolDay(
                                5,
                                listOf(
                                    ProtocolSession("Hydrogen water", "5 min prep", "Wind-down serving"),
                                    ProtocolSession("Hydrogen inhalation", "20 min", "Optional reset session"),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        partners = listOf(
            PartnerLocation("1", "Hylono Showroom Warsaw", "Showroom", "ul. Nowy Swiat 25", "Warsaw", "Poland", "+48 22 123 4567", "warsaw@hylono.com", null, "Mon-Fri 9:00-18:00", 5.0, listOf("HBOT", "PEMF", "RLT", "Hydrogen")),
            PartnerLocation("2", "BioWellness Krakow", "Wellness clinic", "ul. Florianska 12", "Krakow", "Poland", "+48 12 345 6789", "info@biowellness.pl", "https://biowellness.pl", "Mon-Sat 8:00-20:00", 4.8, listOf("HBOT", "PEMF")),
            PartnerLocation("3", "Regeneration Center Berlin", "Wellness clinic", "Friedrichstrasse 100", "Berlin", "Germany", "+49 30 1234567", "info@regen-berlin.de", "https://regen-berlin.de", "Mon-Fri 9:00-19:00", 4.9, listOf("HBOT", "RLT", "Hydrogen")),
            PartnerLocation("4", "Nordic Wellness Solutions", "Distributor", "Storgatan 45", "Stockholm", "Sweden", "+46 8 123 456", "sales@nws.se", null, "Mon-Fri 8:00-17:00", 4.7, listOf("HBOT", "PEMF", "RLT")),
            PartnerLocation("5", "Vitality Hub Prague", "Wellness clinic", "Vaclavske namesti 5", "Prague", "Czech Republic", "+420 123 456 789", "hello@vitalityhub.cz", null, "Mon-Fri 10:00-20:00", 4.6, listOf("HBOT", "PEMF")),
            PartnerLocation("6", "MedTech Austria", "Distributor", "Mariahilfer Strasse 88", "Vienna", "Austria", "+43 1 234 5678", "sales@medtech.at", null, "Mon-Fri 9:00-17:00", 4.8, listOf("HBOT", "PEMF", "RLT", "Hydrogen")),
        ),
        clients = listOf(
            ClinicClient(
                id = "1",
                name = "James Wilson",
                initials = "JW",
                protocol = "Neural Repair",
                adherence = 92,
                riskLevel = RiskLevel.Stable,
                nextSession = "Today, 14:00",
                joinedDate = "Nov 2024",
                totalSessions = 22,
                email = "j.wilson@email.com",
                phone = "+31 6 1234 5678",
                notes = listOf(
                    ClientNote("Dr. S. Chen", "12 Feb 2026", "Excellent progress. HRV improving week-on-week. Continue current protocol."),
                    ClientNote("Dr. S. Chen", "10 Jan 2026", "Initial consultation complete. No contraindications. Starting Neural Repair protocol."),
                ),
                sessions = listOf(
                    ClientSession("12 Feb 2026", "HBOT 1.4 ATA", "60 min", "Client reported improved sleep quality. No adverse effects.", "good"),
                    ClientSession("05 Feb 2026", "HBOT 1.4 ATA", "60 min", "Slight pressure discomfort resolved after 10 min.", "neutral"),
                    ClientSession("28 Jan 2026", "PEMF + RLT", "40 min", "Combination protocol with good recovery response.", "good"),
                ),
            ),
            ClinicClient(
                id = "2",
                name = "Sarah Connor",
                initials = "SC",
                protocol = "Systemic Anti-Inflammatory",
                adherence = 65,
                riskLevel = RiskLevel.Monitor,
                nextSession = "Tomorrow, 09:00",
                joinedDate = "Dec 2024",
                totalSessions = 11,
                email = "s.connor@email.com",
                phone = "+49 30 9876 5432",
                notes = listOf(ClientNote("Dr. S. Chen", "11 Feb 2026", "Adherence declining. Schedule a check-in call and consider protocol simplification.")),
                sessions = listOf(
                    ClientSession("10 Feb 2026", "HBOT 1.3 ATA", "60 min", "Missed two sessions this month due to work schedule.", "neutral"),
                    ClientSession("24 Jan 2026", "HBOT 1.3 ATA", "60 min", "Re-engaged after a two-week gap.", "neutral"),
                ),
            ),
            ClinicClient(
                id = "3",
                name = "Robert Paulson",
                initials = "RP",
                protocol = "Pending Review",
                adherence = 0,
                riskLevel = RiskLevel.High,
                nextSession = "Unscheduled",
                joinedDate = "Jan 2026",
                totalSessions = 1,
                email = "r.paulson@email.com",
                phone = "+44 20 7946 0305",
                notes = listOf(ClientNote("Dr. S. Chen", "20 Jan 2026", "Hypertension noted at intake. GP clearance required before HBOT.")),
                sessions = listOf(ClientSession("20 Jan 2026", "Intake Assessment", "30 min", "Assessment complete, consent still pending.", "neutral")),
            ),
            ClinicClient(
                id = "4",
                name = "Maria Kowalski",
                initials = "MK",
                protocol = "Sports Recovery",
                adherence = 88,
                riskLevel = RiskLevel.Stable,
                nextSession = "Fri, 10:00",
                joinedDate = "Oct 2024",
                totalSessions = 31,
                email = "m.kowalski@email.com",
                phone = "+48 22 555 0199",
                notes = listOf(ClientNote("Dr. S. Chen", "13 Feb 2026", "Great adherence. Increase protocol frequency to 3x/week until March event.")),
                sessions = listOf(
                    ClientSession("13 Feb 2026", "RLT Full Body", "20 min", "Reduced DOMS after hard training block.", "good"),
                    ClientSession("11 Feb 2026", "HBOT 1.35 ATA", "60 min", "Standard weekly recovery session.", "good"),
                ),
            ),
        ),
        fleet = listOf(
            FleetDevice("d1", "Pinnacle 360 Hard Shell", "HBOT", "SN-8821-HB", FleetStatus.Active, 98, "2026-03-01", "2028-11-15", listOf(ServiceLog("2025-11-15", "routine", "Installation and calibration", "Hylono Install Team"), ServiceLog("2026-01-10", "routine", "Filter check passed", "Internal Staff"))),
            FleetDevice("d2", "Aurora Pro Panel", "RLT", "RLT-99X-02", FleetStatus.Active, 100, "2026-06-15", "2027-02-20", listOf(ServiceLog("2025-02-20", "routine", "Initial setup", "Self-install"))),
            FleetDevice("d3", "Core PEMF Mat", "PEMF", "PEMF-PRO-55", FleetStatus.Maintenance, 75, "OVERDUE", "2026-05-10", listOf(ServiceLog("2026-01-14", "issue", "Controller intermittent power", "Reported by Staff"))),
        ),
        supportInfo = SupportInfo(
            companyName = "Hylono",
            description = "European wellness-technology platform focused on guided device access, protocol planning, and conservative evidence-informed education.",
            supportEmail = "support@hylono.com",
            contactEmail = "contact@hylono.com",
            supportHours = "Monday to Friday, 09:00 to 18:00 CET",
            serviceArea = "European Union",
        ),
    )

    override fun loadData(): HylonoAppData = seedData

    override suspend fun submitBooking(request: BookingDraft): SubmissionResult =
        intakeGateway.submitBooking(request)

    override suspend fun submitRental(request: RentalDraft): SubmissionResult {
        val product = seedData.products.firstOrNull { it.id == request.productId }
            ?: return SubmissionResult.Error("Select a rental-ready product first.")

        return intakeGateway.submitRental(request, product)
    }

    override suspend fun submitContact(request: ContactDraft): SubmissionResult =
        intakeGateway.submitContact(request)

    override suspend fun submitNewsletter(request: NewsletterDraft): SubmissionResult =
        intakeGateway.submitNewsletter(request)
}
