package com.hylono.mobile.data.repository

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.HylonoAppData
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.SubmissionResult

interface HylonoRepository {
    fun loadData(): HylonoAppData
    suspend fun submitBooking(request: BookingDraft): SubmissionResult
    suspend fun submitRental(request: RentalDraft): SubmissionResult
    suspend fun submitContact(request: ContactDraft): SubmissionResult
    suspend fun submitNewsletter(request: NewsletterDraft): SubmissionResult
}

interface HylonoIntakeGateway {
    suspend fun submitBooking(request: BookingDraft): SubmissionResult
    suspend fun submitRental(request: RentalDraft, product: Product): SubmissionResult
    suspend fun submitContact(request: ContactDraft): SubmissionResult
    suspend fun submitNewsletter(request: NewsletterDraft): SubmissionResult
}
