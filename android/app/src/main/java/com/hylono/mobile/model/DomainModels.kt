package com.hylono.mobile.model

enum class Workspace {
    MEMBER,
    PARTNER,
}

enum class MemberDestination {
    HOME,
    EXPLORE,
    REQUESTS,
    SUPPORT,
}

enum class PartnerDestination {
    OVERVIEW,
    CLIENTS,
    ACADEMY,
    SUPPLIES,
}

enum class ExploreSection {
    PRODUCTS,
    PROTOCOLS,
    RESEARCH,
}

enum class RiskLevel {
    STABLE,
    MONITOR,
    HIGH,
}

enum class SupplyStatus {
    HEALTHY,
    REORDER,
    REVIEW,
}

data class BrandProfile(
    val name: String,
    val tagline: String,
    val supportEmail: String,
    val contactEmail: String,
    val supportHours: String,
    val serviceArea: String,
    val apiBaseUrl: String,
)

data class Product(
    val id: String,
    val title: String,
    val modality: String,
    val summary: String,
    val purchasePriceEur: Int,
    val rentalFromEur: Int,
    val financingFromEur: Int?,
    val highlights: List<String>,
    val safetyNotes: List<String>,
    val protocolIds: List<String>,
)

data class Protocol(
    val id: String,
    val title: String,
    val goal: String,
    val difficulty: String,
    val durationWeeks: Int,
    val timePerDay: String,
    val summary: String,
    val requiredDevices: List<String>,
    val contraindications: List<String>,
)

data class ResearchStudy(
    val id: String,
    val title: String,
    val modality: String,
    val studyType: String,
    val year: Int,
    val summary: String,
    val url: String,
)

data class PartnerLocation(
    val id: String,
    val name: String,
    val type: String,
    val city: String,
    val country: String,
    val address: String,
    val phone: String,
    val email: String,
    val website: String?,
    val hours: String,
    val features: List<String>,
)

data class PartnerMetric(
    val label: String,
    val value: String,
    val detail: String,
)

data class ClinicClient(
    val id: String,
    val name: String,
    val protocol: String,
    val adherencePercent: Int,
    val riskLevel: RiskLevel,
    val nextSession: String,
    val note: String,
)

data class TrainingTrack(
    val id: String,
    val title: String,
    val focus: String,
    val duration: String,
    val milestone: String,
    val modules: List<String>,
)

data class Assignment(
    val id: String,
    val title: String,
    val status: String,
    val detail: String,
)

data class SupplyItem(
    val id: String,
    val name: String,
    val sku: String,
    val category: String,
    val status: SupplyStatus,
    val onHand: Int,
    val parLevel: Int,
    val recommendedQty: Int,
    val note: String,
)

data class Requisition(
    val id: String,
    val label: String,
    val submittedAt: String,
    val status: String,
)

data class RentalStatus(
    val id: String,
    val status: String,
    val totalMonthly: Double,
    val termMonths: Int,
    val createdAt: String,
    val itemsSummary: String,
)

data class HylonoSnapshot(
    val brand: BrandProfile,
    val products: List<Product>,
    val protocols: List<Protocol>,
    val researchStudies: List<ResearchStudy>,
    val partners: List<PartnerLocation>,
    val partnerMetrics: List<PartnerMetric>,
    val clients: List<ClinicClient>,
    val academyTracks: List<TrainingTrack>,
    val academyAssignments: List<Assignment>,
    val supplies: List<SupplyItem>,
    val requisitions: List<Requisition>,
)

data class SubmissionResult(
    val success: Boolean,
    val message: String,
    val reference: String? = null,
)

data class RentalLookupResult(
    val success: Boolean,
    val message: String,
    val rentals: List<RentalStatus> = emptyList(),
)

data class BookingDraft(
    val name: String,
    val email: String,
    val phone: String,
    val preferredDate: String,
    val techInterest: String,
    val notes: String,
)

data class ContactDraft(
    val name: String,
    val email: String,
    val phone: String,
    val company: String,
    val subject: String,
    val message: String,
    val inquiryType: String,
)

data class NewsletterDraft(
    val email: String,
    val firstName: String,
)

data class RentalDraft(
    val fullName: String,
    val email: String,
    val phone: String,
    val address: String,
    val city: String,
    val postalCode: String,
    val country: String,
    val company: String,
    val termMonths: Int,
    val items: List<RentalLineItem>,
)

data class RentalLineItem(
    val techId: String,
    val quantity: Int,
    val monthlyPrice: Double,
)

