package com.hylono.app.domain.operations

data class ContactInquiryDraft(
    val name: String,
    val email: String,
    val inquiryType: String,
    val message: String
)

data class BookingRequestDraft(
    val name: String,
    val email: String,
    val bookingType: String,
    val preferredDate: String
)

data class RentalApplicationDraft(
    val userId: String,
    val deviceId: String,
    val termMonths: Int
)

data class OperationReceipt(
    val reference: String,
    val message: String
)

interface HylonoOperationsGateway {
    suspend fun submitContact(draft: ContactInquiryDraft): OperationReceipt
    suspend fun submitBooking(draft: BookingRequestDraft): OperationReceipt
    suspend fun submitRental(draft: RentalApplicationDraft): OperationReceipt
}
