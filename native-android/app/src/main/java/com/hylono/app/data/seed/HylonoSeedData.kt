package com.hylono.app.data.seed

import com.hylono.app.domain.model.AccountSnapshot
import com.hylono.app.domain.model.DeviceCategory
import com.hylono.app.domain.model.DeviceSummary
import com.hylono.app.domain.model.GoalId
import com.hylono.app.domain.model.GoalPath
import com.hylono.app.domain.model.HomeOverview
import com.hylono.app.domain.model.ProtocolPlan
import com.hylono.app.domain.model.RentalCase
import com.hylono.app.domain.model.RentalState
import com.hylono.app.domain.model.SessionCadence
import com.hylono.app.domain.model.StackRecommendation
import com.hylono.app.domain.model.SupportChannel

object HylonoSeedData {
    val goals = listOf(
        GoalPath(
            id = GoalId.RECOVERY,
            title = "Recovery",
            subtitle = "Support post-training reset and tissue comfort",
            description = "A goal path built around repeatable HBOT and hydrogen routines that fit a weekly load-management rhythm.",
            keyModalities = listOf("HBOT", "Hydrogen"),
            recommendation = StackRecommendation(
                title = "Recovery Optimal",
                devices = listOf("HBOT ST1700", "Hydrogen HOP-450"),
                rentalFromEur = 1258,
                purchaseFromEur = 27300
            )
        ),
        GoalPath(
            id = GoalId.SLEEP,
            title = "Sleep",
            subtitle = "Build calmer evening transitions",
            description = "Lower-stimulus hydrogen and schedule-led oxygen blocks that support steadier bedtime routines.",
            keyModalities = listOf("Hydrogen", "HBOT"),
            recommendation = StackRecommendation(
                title = "Sleep Starter",
                devices = listOf("Hydrogen HOP-450"),
                rentalFromEur = 159,
                purchaseFromEur = 2400
            )
        ),
        GoalPath(
            id = GoalId.STRESS,
            title = "Stress",
            subtitle = "Reduce daily overload without breaking the workday",
            description = "A hydrogen-first stack built for knowledge work, travel-heavy schedules, and shorter adherence windows.",
            keyModalities = listOf("Hydrogen", "Hydrogen water"),
            recommendation = StackRecommendation(
                title = "Stress Optimal",
                devices = listOf("Hydrogen HOP-450", "OS-H150"),
                rentalFromEur = 318,
                purchaseFromEur = 4990
            )
        ),
        GoalPath(
            id = GoalId.COMFORT,
            title = "Comfort",
            subtitle = "Support everyday renewal at home",
            description = "Gentle daily-use systems focused on consistency, light setup friction, and household usability.",
            keyModalities = listOf("Hydrogen", "Hydrogen water"),
            recommendation = StackRecommendation(
                title = "Comfort Household",
                devices = listOf("OS-H200 / OS-H300", "WO-B4500"),
                rentalFromEur = 199,
                purchaseFromEur = 8080
            )
        ),
        GoalPath(
            id = GoalId.VITALITY,
            title = "Vitality",
            subtitle = "Combine oxygen pressure and hydrogen in one stack",
            description = "A dual-modality plan for users who want a structured whole-system routine instead of single-device use.",
            keyModalities = listOf("HBOT", "Hydrogen", "Hydrogen + oxygen"),
            recommendation = StackRecommendation(
                title = "Vitality Dual Stack",
                devices = listOf("HBOT ST1700", "PR-HO450-P"),
                rentalFromEur = 1498,
                purchaseFromEur = 32190
            )
        )
    )

    val devices = listOf(
        DeviceSummary(
            id = "hbot-st1700",
            title = "HBOT ST1700",
            category = DeviceCategory.HBOT,
            family = "Home mild hyperbaric chamber",
            summary = "A premium home chamber designed for guided oxygen routines, recovery support, and structured weekly use.",
            purchasePriceEur = 24900,
            rentalFromEur = 1099,
            protocolTitles = listOf("Recovery Oxygen Foundation", "Vitality Dual Stack"),
            highlights = listOf("1.3-1.5 ATA", "10 L/min compatible", "Low-noise home format"),
            goalTitles = listOf("Recovery", "Sleep", "Vitality")
        ),
        DeviceSummary(
            id = "h2-hop450",
            title = "Hydrogen HOP-450",
            category = DeviceCategory.HYDROGEN,
            family = "Daily inhalation and hydration system",
            summary = "A compact hydrogen system for short focus sessions, hydration rituals, and daily stress-balance routines.",
            purchasePriceEur = 2400,
            rentalFromEur = 159,
            protocolTitles = listOf("Stress Balance H2 Foundation", "Vitality Dual Stack"),
            highlights = listOf("99.99% purity", "300-900 ml/min", "Water mode included"),
            goalTitles = listOf("Stress", "Comfort", "Vitality")
        ),
        DeviceSummary(
            id = "os-h150",
            title = "OS-H150",
            category = DeviceCategory.HYDROGEN,
            family = "Personal compact inhaler",
            summary = "A private-use hydrogen entry point for disciplined daily sessions in a low-footprint home setup.",
            purchasePriceEur = 2590,
            rentalFromEur = null,
            protocolTitles = listOf("Stress Balance H2 Foundation"),
            highlights = listOf("150 ml/min", "Compact form", "Personal line"),
            goalTitles = listOf("Stress", "Sleep", "Vitality")
        ),
        DeviceSummary(
            id = "os-h200-h300",
            title = "OS-H200 / OS-H300",
            category = DeviceCategory.HYDROGEN,
            family = "Expanded personal platform",
            summary = "Two private-use variants that keep the domestic format while adding output headroom for more regular use.",
            purchasePriceEur = 3390,
            rentalFromEur = null,
            protocolTitles = listOf("Stress Balance H2 Foundation", "Vitality Dual Stack"),
            highlights = listOf("200 or 300 ml/min", "Expanded home platform", "Low-friction setup"),
            goalTitles = listOf("Stress", "Comfort", "Vitality")
        ),
        DeviceSummary(
            id = "pr-ho450-p",
            title = "PR-HO450-P",
            category = DeviceCategory.HYDROGEN_PLUS_OXYGEN,
            family = "Pulse-ready home and studio unit",
            summary = "A more deliberate H2 + O2 delivery profile for users moving from casual use into coached routines.",
            purchasePriceEur = 7290,
            rentalFromEur = null,
            protocolTitles = listOf("Vitality Dual Stack"),
            highlights = listOf("Pulse mode", "H2 300 ml/min", "O2 150 ml/min"),
            goalTitles = listOf("Vitality", "Stress")
        ),
        DeviceSummary(
            id = "wo-b4500",
            title = "WO-B4500",
            category = DeviceCategory.HYDROGEN_WATER,
            family = "Portable hydrogen water bottle",
            summary = "A portable hydrogen-water format for users whose adherence depends on mobility, travel, and quick daily access.",
            purchasePriceEur = 4690,
            rentalFromEur = null,
            protocolTitles = listOf("Stress Balance H2 Foundation"),
            highlights = listOf("Portable route", "Travel-friendly", "Water ritual support"),
            goalTitles = listOf("Stress", "Comfort")
        )
    )

    val protocols = listOf(
        ProtocolPlan(
            id = "recovery-oxygen-foundation",
            title = "Recovery Oxygen Foundation",
            goalTitle = "Recovery",
            difficulty = "Beginner",
            durationWeeks = 4,
            timePerDay = "45-70 min",
            summary = "An HBOT-first routine designed to support recovery rhythm, sleep depth, and post-training reset.",
            audience = "Active adults, runners, strength athletes, and high-load professionals",
            requiredDevices = listOf("HBOT ST1700"),
            cadence = listOf(
                SessionCadence("Week 1 / Day 1", "45 min", "1.3 ATA, calm breathing cadence"),
                SessionCadence("Week 1 / Day 5", "55 min", "1.35 ATA, evening recovery window"),
                SessionCadence("Week 2 / Day 4", "60 min", "1.4 ATA, recovery-focused breathing")
            ),
            safetyNote = "Increase pressure exposure gradually and stop if ear or sinus discomfort appears."
        ),
        ProtocolPlan(
            id = "stress-balance-h2-foundation",
            title = "Stress Balance H2 Foundation",
            goalTitle = "Stress",
            difficulty = "Beginner",
            durationWeeks = 4,
            timePerDay = "25-40 min",
            summary = "A daily hydrogen routine focused on calmer attention, smoother energy, and lower workday fatigue load.",
            audience = "Knowledge workers, founders, shift workers, and travel-heavy professionals",
            requiredDevices = listOf("Hydrogen HOP-450"),
            cadence = listOf(
                SessionCadence("Week 1 / Day 1", "20 min", "300-450 ml/min inhalation"),
                SessionCadence("Week 1 / Day 1", "5 min", "Hydrogen water serving after session"),
                SessionCadence("Week 2 / Day 2", "30 min", "450-600 ml/min, morning or early afternoon")
            ),
            safetyNote = "Use distilled or reverse-osmosis water only and keep tubing clean and dry."
        ),
        ProtocolPlan(
            id = "vitality-dual-stack",
            title = "Vitality Dual Stack",
            goalTitle = "Vitality",
            difficulty = "Intermediate",
            durationWeeks = 6,
            timePerDay = "60-95 min",
            summary = "A dual-modality stack combining oxygen pressure and hydrogen sessions in one guided household routine.",
            audience = "Committed users seeking a protocol-first home wellness stack",
            requiredDevices = listOf("HBOT ST1700", "PR-HO450-P"),
            cadence = listOf(
                SessionCadence("Week 1 / Day 1", "50 min", "HBOT at 1.3 ATA"),
                SessionCadence("Week 1 / Day 1", "20 min", "Hydrogen inhalation after decompression"),
                SessionCadence("Week 1 / Day 3", "5 min", "Hydrogen water morning serving")
            ),
            safetyNote = "Keep decompression calm and preserve enough buffer between pressure and inhalation blocks."
        )
    )

    val rentals = listOf(
        RentalCase(
            id = "rent-2417",
            deviceTitle = "HBOT ST1700",
            termLabel = "6 month plan",
            monthlyPriceEur = 1099,
            depositEur = 2500,
            state = RentalState.AWAITING_CONTRACT,
            nextAction = "Review household setup checklist and countersign the delivery contract."
        ),
        RentalCase(
            id = "rent-1732",
            deviceTitle = "Hydrogen HOP-450",
            termLabel = "3 month plan",
            monthlyPriceEur = 179,
            depositEur = 350,
            state = RentalState.ACTIVE,
            nextAction = "Weekly adherence review is due in 3 days."
        )
    )

    val supportChannels = listOf(
        SupportChannel(
            title = "Advisor desk",
            responseWindow = "Within 24 hours",
            summary = "Goal matching, stack planning, and upgrade readiness for EU households.",
            routeHint = "Maps to POST /api/booking"
        ),
        SupportChannel(
            title = "Technical support",
            responseWindow = "Mon-Fri 09:00-18:00 CET",
            summary = "Consumables, startup checklist review, and post-delivery troubleshooting.",
            routeHint = "Maps to POST /api/contact"
        ),
        SupportChannel(
            title = "Rental operations",
            responseWindow = "Operator review queue",
            summary = "Contract status, return logistics, and extension or buy-out options.",
            routeHint = "Maps to POST or GET /api/rental"
        ),
        SupportChannel(
            title = "Policy library",
            responseWindow = "Instant",
            summary = "Returns, shipping, warranty, and privacy rules surfaced as in-app reference.",
            routeHint = "Maps to existing trust pages"
        )
    )

    val account = AccountSnapshot(
        label = "Primary household",
        serviceArea = "European Union",
        activeStackTitle = "Vitality Dual Stack",
        adherencePercent = 82,
        nextMilestone = "Week 3 pressure review due tomorrow",
        openItems = listOf(
            "Upload room dimensions before chamber delivery.",
            "Confirm advisor callback slot for rental review.",
            "Refresh hydrogen consumables in 12 days."
        )
    )

    val homeOverview = HomeOverview(
        welcomeTitle = "Structured home wellness, not a mobile website",
        welcomeSummary = "Hylono on Android is designed as the daily operating surface for device ownership, guided protocols, and rental follow-up.",
        nextSessionTitle = "HBOT reset block",
        nextSessionWindow = "Tomorrow, 07:30-08:20",
        activeRental = rentals.first(),
        supportWindow = "Support coverage: Monday to Friday, 09:00 to 18:00 CET",
        completionRate = 76
    )
}
