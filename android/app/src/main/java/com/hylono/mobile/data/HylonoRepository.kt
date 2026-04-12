package com.hylono.mobile.data

import com.hylono.mobile.model.BookingDraft
import com.hylono.mobile.model.ContactDraft
import com.hylono.mobile.model.HylonoSnapshot
import com.hylono.mobile.model.NewsletterDraft
import com.hylono.mobile.model.RentalDraft
import com.hylono.mobile.model.RentalLookupResult
import com.hylono.mobile.model.SubmissionResult

class HylonoRepository(
    apiBaseUrl: String,
) {
    private val api = HylonoApi(apiBaseUrl)
    private val snapshot = HylonoSeedData.snapshot(apiBaseUrl = apiBaseUrl)

    fun snapshot(): HylonoSnapshot = snapshot

    suspend fun submitBooking(draft: BookingDraft): SubmissionResult = api.submitBooking(draft)

    suspend fun submitContact(draft: ContactDraft): SubmissionResult = api.submitContact(draft)

    suspend fun submitNewsletter(draft: NewsletterDraft): SubmissionResult = api.submitNewsletter(draft)

    suspend fun submitRental(draft: RentalDraft): SubmissionResult = api.submitRental(draft)

    suspend fun lookupRentals(email: String): RentalLookupResult = api.lookupRentals(email)
}
