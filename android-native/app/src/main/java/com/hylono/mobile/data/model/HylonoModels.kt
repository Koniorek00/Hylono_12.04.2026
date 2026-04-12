package com.hylono.mobile.data.model

enum class RiskLevel {
    Stable,
    Monitor,
    High,
}

enum class FleetStatus {
    Active,
    Maintenance,
    Offline,
}

enum class BookingType(val apiValue: String, val label: String) {
    Consultation("consultation", "Consultation"),
    Demo("demo", "Device demo"),
    RentalInquiry("rental-inquiry", "Rental inquiry"),
    B2B("b2b", "Clinic / B2B"),
}

enum class ContactInquiryType(val apiValue: String, val label: String) {
    General("general", "General"),
    Rental("rental", "Rental"),
    B2B("b2b", "Clinic / B2B"),
    Support("support", "Support"),
    Press("press", "Press"),
}

data class Product(
    val id: String,
    val title: String,
    val modality: String,
    val shortDescription: String,
    val intendedUse: String,
    val purchasePriceLabel: String,
    val financingLabel: String?,
    val rentalPriceLabel: String?,
    val rentalMonthlyPrice: Int?,
    val goalTags: List<String>,
    val highlights: List<String>,
    val safetyNotes: List<String>,
    val protocolIds: List<String>,
    val supportNote: String,
    val reviewStatus: String,
)

data class ProtocolWeek(
    val number: Int,
    val title: String,
    val days: List<ProtocolDay>,
)

data class ProtocolDay(
    val number: Int,
    val sessions: List<ProtocolSession>,
)

data class ProtocolSession(
    val modality: String,
    val duration: String,
    val parameters: String,
    val note: String? = null,
)

data class Protocol(
    val slug: String,
    val title: String,
    val goal: String,
    val difficulty: String,
    val durationWeeks: Int,
    val timePerDay: String,
    val shortDescription: String,
    val targetAudience: String,
    val reviewer: String,
    val safetyNotes: String,
    val contraindications: List<String>,
    val weeks: List<ProtocolWeek>,
)

data class PartnerLocation(
    val id: String,
    val name: String,
    val type: String,
    val address: String,
    val city: String,
    val country: String,
    val phone: String,
    val email: String,
    val website: String? = null,
    val hours: String,
    val rating: Double,
    val features: List<String>,
)

data class ClientSession(
    val date: String,
    val modality: String,
    val duration: String,
    val notes: String,
    val outcome: String,
)

data class ClientNote(
    val author: String,
    val date: String,
    val text: String,
)

data class ClinicClient(
    val id: String,
    val name: String,
    val initials: String,
    val protocol: String,
    val adherence: Int,
    val riskLevel: RiskLevel,
    val nextSession: String,
    val joinedDate: String,
    val totalSessions: Int,
    val email: String,
    val phone: String,
    val notes: List<ClientNote>,
    val sessions: List<ClientSession>,
)

data class ServiceLog(
    val date: String,
    val type: String,
    val description: String,
    val technician: String,
)

data class FleetDevice(
    val id: String,
    val model: String,
    val type: String,
    val serial: String,
    val status: FleetStatus,
    val health: Int,
    val nextService: String,
    val warrantyDate: String,
    val logs: List<ServiceLog>,
)

data class SupportInfo(
    val companyName: String,
    val description: String,
    val supportEmail: String,
    val contactEmail: String,
    val supportHours: String,
    val serviceArea: String,
) {
    companion object {
        val EMPTY = SupportInfo(
            companyName = "Hylono",
            description = "",
            supportEmail = "",
            contactEmail = "",
            supportHours = "",
            serviceArea = "",
        )
    }
}

data class HylonoAppData(
    val products: List<Product>,
    val protocols: List<Protocol>,
    val partners: List<PartnerLocation>,
    val clients: List<ClinicClient>,
    val fleet: List<FleetDevice>,
    val supportInfo: SupportInfo,
) {
    companion object {
        val EMPTY = HylonoAppData(
            products = emptyList(),
            protocols = emptyList(),
            partners = emptyList(),
            clients = emptyList(),
            fleet = emptyList(),
            supportInfo = SupportInfo.EMPTY,
        )
    }
}

data class BookingDraft(
    val fullName: String = "",
    val email: String = "",
    val phone: String = "",
    val preferredDate: String = "",
    val preferredTime: String = "",
    val bookingType: BookingType = BookingType.Consultation,
    val techInterest: String? = null,
    val notes: String = "",
)

data class RentalDraft(
    val productId: String = "",
    val quantity: Int = 1,
    val termMonths: Int = 3,
    val fullName: String = "",
    val email: String = "",
    val phone: String = "",
    val address: String = "",
    val city: String = "",
    val postalCode: String = "",
    val country: String = "Poland",
    val company: String = "",
)

data class ContactDraft(
    val fullName: String = "",
    val email: String = "",
    val phone: String = "",
    val company: String = "",
    val subject: String = "",
    val inquiryType: ContactInquiryType = ContactInquiryType.General,
    val message: String = "",
)

data class NewsletterDraft(
    val email: String = "",
    val firstName: String = "",
)

sealed interface SubmissionResult {
    data class Success(
        val message: String,
        val reference: String? = null,
    ) : SubmissionResult

    data class Error(
        val message: String,
        val details: List<String> = emptyList(),
        val retryAfterSeconds: Int? = null,
    ) : SubmissionResult
}
