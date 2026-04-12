package com.hylono.mobile.ui

import android.app.Application
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.hylono.mobile.BuildConfig
import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.HylonoAppData
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.SubmissionResult
import com.hylono.mobile.data.repository.HylonoDraftStore
import com.hylono.mobile.data.repository.HylonoRepository
import com.hylono.mobile.data.repository.HttpIntakeGateway
import com.hylono.mobile.data.repository.SeedHylonoRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class SubmissionUiState(
    val isSubmitting: Boolean = false,
    val isError: Boolean = false,
    val message: String? = null,
    val reference: String? = null,
    val details: List<String> = emptyList(),
    val retryAfterSeconds: Int? = null,
)

data class HylonoUiState(
    val data: HylonoAppData = HylonoAppData.EMPTY,
    val bookingDraft: BookingDraft = BookingDraft(),
    val rentalDraft: RentalDraft = RentalDraft(),
    val contactDraft: ContactDraft = ContactDraft(),
    val newsletterDraft: NewsletterDraft = NewsletterDraft(),
    val bookingFeedback: SubmissionUiState = SubmissionUiState(),
    val rentalFeedback: SubmissionUiState = SubmissionUiState(),
    val contactFeedback: SubmissionUiState = SubmissionUiState(),
    val newsletterFeedback: SubmissionUiState = SubmissionUiState(),
)

class HylonoViewModel(
    private val repository: HylonoRepository,
    private val draftStore: HylonoDraftStore,
) : ViewModel() {
    private val initialData = repository.loadData()
    private val defaultRentalProductId = initialData.products
        .firstOrNull { it.rentalMonthlyPrice != null }
        ?.id
        .orEmpty()

    private var bookingPersistJob: Job? = null
    private var rentalPersistJob: Job? = null
    private var contactPersistJob: Job? = null
    private var newsletterPersistJob: Job? = null

    var uiState by mutableStateOf(
        HylonoUiState(
            data = initialData,
            rentalDraft = RentalDraft(productId = defaultRentalProductId),
        ),
    )
        private set

    init {
        loadPersistedDrafts()
    }

    fun clearBookingFeedback() {
        uiState = uiState.copy(bookingFeedback = SubmissionUiState())
    }

    fun clearRentalFeedback() {
        uiState = uiState.copy(rentalFeedback = SubmissionUiState())
    }

    fun clearContactFeedback() {
        uiState = uiState.copy(contactFeedback = SubmissionUiState())
    }

    fun clearNewsletterFeedback() {
        uiState = uiState.copy(newsletterFeedback = SubmissionUiState())
    }

    fun updateBookingDraft(draft: BookingDraft) {
        if (draft == uiState.bookingDraft) return

        uiState = uiState.copy(
            bookingDraft = draft,
            bookingFeedback = SubmissionUiState(),
        )
        persistBookingDraft(draft)
    }

    fun clearBookingDraft() {
        bookingPersistJob?.cancel()
        val clearedDraft = BookingDraft()
        uiState = uiState.copy(
            bookingDraft = clearedDraft,
            bookingFeedback = SubmissionUiState(),
        )
        persistNow { draftStore.saveBookingDraft(clearedDraft) }
    }

    fun submitBooking(draft: BookingDraft) {
        validateBooking(draft)?.let { error ->
            uiState = uiState.copy(
                bookingFeedback = SubmissionUiState(
                    isError = true,
                    message = error,
                ),
            )
            return
        }

        uiState = uiState.copy(
            bookingFeedback = SubmissionUiState(isSubmitting = true),
        )

        viewModelScope.launch {
            val result = repository.submitBooking(draft)
            applyBookingResult(result)
        }
    }

    fun updateRentalDraft(draft: RentalDraft) {
        val sanitizedDraft = sanitizeRentalDraft(draft)
        if (sanitizedDraft == uiState.rentalDraft) return

        uiState = uiState.copy(
            rentalDraft = sanitizedDraft,
            rentalFeedback = SubmissionUiState(),
        )
        persistRentalDraft(sanitizedDraft)
    }

    fun clearRentalDraft() {
        rentalPersistJob?.cancel()
        val clearedDraft = RentalDraft(productId = defaultRentalProductId)
        uiState = uiState.copy(
            rentalDraft = clearedDraft,
            rentalFeedback = SubmissionUiState(),
        )
        persistNow { draftStore.saveRentalDraft(clearedDraft, defaultRentalProductId) }
    }

    fun submitRental(draft: RentalDraft) {
        val sanitizedDraft = sanitizeRentalDraft(draft)
        validateRental(
            draft = sanitizedDraft,
            products = uiState.data.products,
        )?.let { error ->
            uiState = uiState.copy(
                rentalFeedback = SubmissionUiState(
                    isError = true,
                    message = error,
                ),
            )
            return
        }

        uiState = uiState.copy(
            rentalDraft = sanitizedDraft,
            rentalFeedback = SubmissionUiState(isSubmitting = true),
        )

        viewModelScope.launch {
            val result = repository.submitRental(sanitizedDraft)
            applyRentalResult(result)
        }
    }

    fun updateContactDraft(draft: ContactDraft) {
        if (draft == uiState.contactDraft) return

        uiState = uiState.copy(
            contactDraft = draft,
            contactFeedback = SubmissionUiState(),
        )
        persistContactDraft(draft)
    }

    fun clearContactDraft() {
        contactPersistJob?.cancel()
        val clearedDraft = ContactDraft()
        uiState = uiState.copy(
            contactDraft = clearedDraft,
            contactFeedback = SubmissionUiState(),
        )
        persistNow { draftStore.saveContactDraft(clearedDraft) }
    }

    fun submitContact(draft: ContactDraft) {
        validateContact(draft)?.let { error ->
            uiState = uiState.copy(
                contactFeedback = SubmissionUiState(
                    isError = true,
                    message = error,
                ),
            )
            return
        }

        uiState = uiState.copy(
            contactFeedback = SubmissionUiState(isSubmitting = true),
        )

        viewModelScope.launch {
            val result = repository.submitContact(draft)
            applyContactResult(result)
        }
    }

    fun updateNewsletterDraft(draft: NewsletterDraft) {
        if (draft == uiState.newsletterDraft) return

        uiState = uiState.copy(
            newsletterDraft = draft,
            newsletterFeedback = SubmissionUiState(),
        )
        persistNewsletterDraft(draft)
    }

    fun clearNewsletterDraft() {
        newsletterPersistJob?.cancel()
        val clearedDraft = NewsletterDraft()
        uiState = uiState.copy(
            newsletterDraft = clearedDraft,
            newsletterFeedback = SubmissionUiState(),
        )
        persistNow { draftStore.saveNewsletterDraft(clearedDraft) }
    }

    fun submitNewsletter(draft: NewsletterDraft) {
        validateNewsletter(draft)?.let { error ->
            uiState = uiState.copy(
                newsletterFeedback = SubmissionUiState(
                    isError = true,
                    message = error,
                ),
            )
            return
        }

        uiState = uiState.copy(
            newsletterFeedback = SubmissionUiState(isSubmitting = true),
        )

        viewModelScope.launch {
            val result = repository.submitNewsletter(draft)
            applyNewsletterResult(result)
        }
    }

    private fun loadPersistedDrafts() {
        viewModelScope.launch {
            runCatching { draftStore.loadDrafts(defaultRentalProductId) }
                .onSuccess { drafts ->
                    uiState = uiState.copy(
                        bookingDraft = drafts.booking,
                        rentalDraft = sanitizeRentalDraft(drafts.rental),
                        contactDraft = drafts.contact,
                        newsletterDraft = drafts.newsletter,
                    )
                }
                .onFailure { error ->
                    Log.w(TAG, "Could not restore saved drafts.", error)
                }
        }
    }

    private fun applyBookingResult(result: SubmissionResult) {
        val feedback = result.toUiState()
        if (result is SubmissionResult.Success) {
            bookingPersistJob?.cancel()
            val clearedDraft = BookingDraft()
            uiState = uiState.copy(
                bookingDraft = clearedDraft,
                bookingFeedback = feedback,
            )
            persistNow { draftStore.saveBookingDraft(clearedDraft) }
        } else {
            uiState = uiState.copy(bookingFeedback = feedback)
        }
    }

    private fun applyRentalResult(result: SubmissionResult) {
        val feedback = result.toUiState()
        if (result is SubmissionResult.Success) {
            rentalPersistJob?.cancel()
            val clearedDraft = RentalDraft(productId = defaultRentalProductId)
            uiState = uiState.copy(
                rentalDraft = clearedDraft,
                rentalFeedback = feedback,
            )
            persistNow { draftStore.saveRentalDraft(clearedDraft, defaultRentalProductId) }
        } else {
            uiState = uiState.copy(rentalFeedback = feedback)
        }
    }

    private fun applyContactResult(result: SubmissionResult) {
        val feedback = result.toUiState()
        if (result is SubmissionResult.Success) {
            contactPersistJob?.cancel()
            val clearedDraft = ContactDraft()
            uiState = uiState.copy(
                contactDraft = clearedDraft,
                contactFeedback = feedback,
            )
            persistNow { draftStore.saveContactDraft(clearedDraft) }
        } else {
            uiState = uiState.copy(contactFeedback = feedback)
        }
    }

    private fun applyNewsletterResult(result: SubmissionResult) {
        val feedback = result.toUiState()
        if (result is SubmissionResult.Success) {
            newsletterPersistJob?.cancel()
            val clearedDraft = NewsletterDraft()
            uiState = uiState.copy(
                newsletterDraft = clearedDraft,
                newsletterFeedback = feedback,
            )
            persistNow { draftStore.saveNewsletterDraft(clearedDraft) }
        } else {
            uiState = uiState.copy(newsletterFeedback = feedback)
        }
    }

    private fun sanitizeRentalDraft(draft: RentalDraft): RentalDraft {
        val selectedProduct = uiState.data.products.firstOrNull { product ->
            product.id == draft.productId && product.rentalMonthlyPrice != null
        }
        return draft.copy(
            productId = selectedProduct?.id ?: defaultRentalProductId,
            quantity = draft.quantity.coerceAtLeast(1),
            termMonths = draft.termMonths.coerceIn(1, 60),
            country = draft.country.ifBlank { "Poland" },
        )
    }

    private fun persistBookingDraft(draft: BookingDraft) {
        bookingPersistJob?.cancel()
        bookingPersistJob = persistDelayed {
            draftStore.saveBookingDraft(draft)
        }
    }

    private fun persistRentalDraft(draft: RentalDraft) {
        rentalPersistJob?.cancel()
        rentalPersistJob = persistDelayed {
            draftStore.saveRentalDraft(draft, defaultRentalProductId)
        }
    }

    private fun persistContactDraft(draft: ContactDraft) {
        contactPersistJob?.cancel()
        contactPersistJob = persistDelayed {
            draftStore.saveContactDraft(draft)
        }
    }

    private fun persistNewsletterDraft(draft: NewsletterDraft) {
        newsletterPersistJob?.cancel()
        newsletterPersistJob = persistDelayed {
            draftStore.saveNewsletterDraft(draft)
        }
    }

    private fun persistDelayed(block: suspend () -> Unit): Job = viewModelScope.launch {
        delay(DRAFT_PERSIST_DELAY_MS)
        runCatching { block() }
            .onFailure { error ->
                Log.w(TAG, "Could not persist draft state.", error)
            }
    }

    private fun persistNow(block: suspend () -> Unit) {
        viewModelScope.launch {
            runCatching { block() }
                .onFailure { error ->
                    Log.w(TAG, "Could not persist draft state.", error)
                }
        }
    }

    private fun SubmissionResult.toUiState(): SubmissionUiState = when (this) {
        is SubmissionResult.Error -> SubmissionUiState(
            isError = true,
            message = message,
            details = details,
            retryAfterSeconds = retryAfterSeconds,
        )

        is SubmissionResult.Success -> SubmissionUiState(
            isSubmitting = false,
            isError = false,
            message = message,
            reference = reference,
        )
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val application = checkNotNull(this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY])
                HylonoViewModel(
                    repository = SeedHylonoRepository(
                        intakeGateway = HttpIntakeGateway(BuildConfig.API_BASE_URL),
                    ),
                    draftStore = HylonoDraftStore(application as Application),
                )
            }
        }

        private const val TAG = "HylonoViewModel"
        private const val DRAFT_PERSIST_DELAY_MS = 250L
    }
}
