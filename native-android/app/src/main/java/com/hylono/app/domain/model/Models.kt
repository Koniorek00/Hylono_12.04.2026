package com.hylono.app.domain.model

enum class GoalId {
    RECOVERY,
    SLEEP,
    STRESS,
    COMFORT,
    VITALITY
}

enum class DeviceCategory {
    HBOT,
    HYDROGEN,
    HYDROGEN_PLUS_OXYGEN,
    HYDROGEN_WATER
}

enum class RentalState {
    PENDING_REVIEW,
    AWAITING_CONTRACT,
    ACTIVE,
    RETURN_WINDOW
}

data class StackRecommendation(
    val title: String,
    val devices: List<String>,
    val rentalFromEur: Int,
    val purchaseFromEur: Int
)

data class GoalPath(
    val id: GoalId,
    val title: String,
    val subtitle: String,
    val description: String,
    val keyModalities: List<String>,
    val recommendation: StackRecommendation
)

data class DeviceSummary(
    val id: String,
    val title: String,
    val category: DeviceCategory,
    val family: String,
    val summary: String,
    val purchasePriceEur: Int,
    val rentalFromEur: Int?,
    val protocolTitles: List<String>,
    val highlights: List<String>,
    val goalTitles: List<String>
)

data class SessionCadence(
    val label: String,
    val duration: String,
    val parameters: String
)

data class ProtocolPlan(
    val id: String,
    val title: String,
    val goalTitle: String,
    val difficulty: String,
    val durationWeeks: Int,
    val timePerDay: String,
    val summary: String,
    val audience: String,
    val requiredDevices: List<String>,
    val cadence: List<SessionCadence>,
    val safetyNote: String
)

data class RentalCase(
    val id: String,
    val deviceTitle: String,
    val termLabel: String,
    val monthlyPriceEur: Int,
    val depositEur: Int,
    val state: RentalState,
    val nextAction: String
)

data class SupportChannel(
    val title: String,
    val responseWindow: String,
    val summary: String,
    val routeHint: String
)

data class AccountSnapshot(
    val label: String,
    val serviceArea: String,
    val activeStackTitle: String,
    val adherencePercent: Int,
    val nextMilestone: String,
    val openItems: List<String>
)

data class HomeOverview(
    val welcomeTitle: String,
    val welcomeSummary: String,
    val nextSessionTitle: String,
    val nextSessionWindow: String,
    val activeRental: RentalCase,
    val supportWindow: String,
    val completionRate: Int
)
