package com.hylono.mobile.data.repository

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.BookingType
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.ContactInquiryType
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.RentalDraft
import java.net.URLDecoder
import java.net.URLEncoder

data class PersistedDrafts(
    val booking: BookingDraft,
    val rental: RentalDraft,
    val contact: ContactDraft,
    val newsletter: NewsletterDraft,
)

object HylonoDraftCodec {
    fun encodeBookingDraft(draft: BookingDraft): String = encodeFields(
        mapOf(
            "fullName" to draft.fullName,
            "email" to draft.email,
            "phone" to draft.phone,
            "preferredDate" to draft.preferredDate,
            "preferredTime" to draft.preferredTime,
            "bookingType" to draft.bookingType.apiValue,
            "techInterest" to draft.techInterest.orEmpty(),
            "notes" to draft.notes,
        ),
    )

    fun decodeBookingDraft(payload: String): BookingDraft = runCatching {
        val fields = decodeFields(payload)
        BookingDraft(
            fullName = fields["fullName"].orEmpty(),
            email = fields["email"].orEmpty(),
            phone = fields["phone"].orEmpty(),
            preferredDate = fields["preferredDate"].orEmpty(),
            preferredTime = fields["preferredTime"].orEmpty(),
            bookingType = bookingTypeFromApiValue(fields["bookingType"].orEmpty()),
            techInterest = fields["techInterest"]?.takeIf { it.isNotBlank() },
            notes = fields["notes"].orEmpty(),
        )
    }.getOrElse { BookingDraft() }

    fun encodeRentalDraft(draft: RentalDraft): String = encodeFields(
        mapOf(
            "productId" to draft.productId,
            "quantity" to draft.quantity.toString(),
            "termMonths" to draft.termMonths.toString(),
            "fullName" to draft.fullName,
            "email" to draft.email,
            "phone" to draft.phone,
            "address" to draft.address,
            "city" to draft.city,
            "postalCode" to draft.postalCode,
            "country" to draft.country,
            "company" to draft.company,
        ),
    )

    fun decodeRentalDraft(
        payload: String,
        defaultProductId: String,
    ): RentalDraft = runCatching {
        val fields = decodeFields(payload)
        val savedTermMonths = fields["termMonths"]?.toIntOrNull() ?: 3
        RentalDraft(
            productId = fields["productId"].orEmpty().ifBlank { defaultProductId },
            quantity = (fields["quantity"]?.toIntOrNull() ?: 1).coerceAtLeast(1),
            termMonths = savedTermMonths.coerceIn(1, 60),
            fullName = fields["fullName"].orEmpty(),
            email = fields["email"].orEmpty(),
            phone = fields["phone"].orEmpty(),
            address = fields["address"].orEmpty(),
            city = fields["city"].orEmpty(),
            postalCode = fields["postalCode"].orEmpty(),
            country = fields["country"].orEmpty().ifBlank { "Poland" },
            company = fields["company"].orEmpty(),
        )
    }.getOrElse { RentalDraft(productId = defaultProductId) }

    fun encodeContactDraft(draft: ContactDraft): String = encodeFields(
        mapOf(
            "fullName" to draft.fullName,
            "email" to draft.email,
            "phone" to draft.phone,
            "company" to draft.company,
            "subject" to draft.subject,
            "inquiryType" to draft.inquiryType.apiValue,
            "message" to draft.message,
        ),
    )

    fun decodeContactDraft(payload: String): ContactDraft = runCatching {
        val fields = decodeFields(payload)
        ContactDraft(
            fullName = fields["fullName"].orEmpty(),
            email = fields["email"].orEmpty(),
            phone = fields["phone"].orEmpty(),
            company = fields["company"].orEmpty(),
            subject = fields["subject"].orEmpty(),
            inquiryType = inquiryTypeFromApiValue(fields["inquiryType"].orEmpty()),
            message = fields["message"].orEmpty(),
        )
    }.getOrElse { ContactDraft() }

    fun encodeNewsletterDraft(draft: NewsletterDraft): String = encodeFields(
        mapOf(
            "email" to draft.email,
            "firstName" to draft.firstName,
        ),
    )

    fun decodeNewsletterDraft(payload: String): NewsletterDraft = runCatching {
        val fields = decodeFields(payload)
        NewsletterDraft(
            email = fields["email"].orEmpty(),
            firstName = fields["firstName"].orEmpty(),
        )
    }.getOrElse { NewsletterDraft() }

    private fun bookingTypeFromApiValue(value: String): BookingType =
        BookingType.entries.firstOrNull { it.apiValue == value } ?: BookingType.Consultation

    private fun inquiryTypeFromApiValue(value: String): ContactInquiryType =
        ContactInquiryType.entries.firstOrNull { it.apiValue == value } ?: ContactInquiryType.General

    private fun encodeFields(fields: Map<String, String>): String = fields.entries.joinToString("&") { (key, value) ->
        "${key.urlEncode()}=${value.urlEncode()}"
    }

    private fun decodeFields(payload: String): Map<String, String> = buildMap {
        if (payload.isBlank()) return@buildMap

        payload.split('&')
            .filter { it.isNotBlank() }
            .forEach { segment ->
                val separatorIndex = segment.indexOf('=')
                if (separatorIndex <= 0) {
                    return@forEach
                }

                val key = segment.substring(0, separatorIndex).urlDecode()
                val value = segment.substring(separatorIndex + 1).urlDecode()
                put(key, value)
            }
    }

    private fun String.urlEncode(): String = URLEncoder.encode(this, "UTF-8")

    private fun String.urlDecode(): String = URLDecoder.decode(this, "UTF-8")
}
