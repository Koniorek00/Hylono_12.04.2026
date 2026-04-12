package com.hylono.mobile.data.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.hasContent
import kotlinx.coroutines.flow.first

private const val DRAFT_STORE_NAME = "hylono_form_drafts"

private val Context.hylonoDraftDataStore by preferencesDataStore(name = DRAFT_STORE_NAME)

class HylonoDraftStore(
    private val context: Context,
) {
    suspend fun loadDrafts(defaultRentalProductId: String): PersistedDrafts {
        val preferences = context.hylonoDraftDataStore.data.first()

        return PersistedDrafts(
            booking = preferences[bookingDraftKey]
                ?.let(HylonoDraftCodec::decodeBookingDraft)
                ?: BookingDraft(),
            rental = preferences[rentalDraftKey]
                ?.let { HylonoDraftCodec.decodeRentalDraft(it, defaultRentalProductId) }
                ?: RentalDraft(productId = defaultRentalProductId),
            contact = preferences[contactDraftKey]
                ?.let(HylonoDraftCodec::decodeContactDraft)
                ?: ContactDraft(),
            newsletter = preferences[newsletterDraftKey]
                ?.let(HylonoDraftCodec::decodeNewsletterDraft)
                ?: NewsletterDraft(),
        )
    }

    suspend fun saveBookingDraft(draft: BookingDraft) {
        context.hylonoDraftDataStore.edit { preferences ->
            if (draft.hasContent()) {
                preferences[bookingDraftKey] = HylonoDraftCodec.encodeBookingDraft(draft)
            } else {
                preferences.remove(bookingDraftKey)
            }
        }
    }

    suspend fun saveRentalDraft(
        draft: RentalDraft,
        defaultProductId: String,
    ) {
        context.hylonoDraftDataStore.edit { preferences ->
            if (draft.hasContent(defaultProductId)) {
                preferences[rentalDraftKey] = HylonoDraftCodec.encodeRentalDraft(draft)
            } else {
                preferences.remove(rentalDraftKey)
            }
        }
    }

    suspend fun saveContactDraft(draft: ContactDraft) {
        context.hylonoDraftDataStore.edit { preferences ->
            if (draft.hasContent()) {
                preferences[contactDraftKey] = HylonoDraftCodec.encodeContactDraft(draft)
            } else {
                preferences.remove(contactDraftKey)
            }
        }
    }

    suspend fun saveNewsletterDraft(draft: NewsletterDraft) {
        context.hylonoDraftDataStore.edit { preferences ->
            if (draft.hasContent()) {
                preferences[newsletterDraftKey] = HylonoDraftCodec.encodeNewsletterDraft(draft)
            } else {
                preferences.remove(newsletterDraftKey)
            }
        }
    }

    private companion object {
        val bookingDraftKey = stringPreferencesKey("booking_draft")
        val rentalDraftKey = stringPreferencesKey("rental_draft")
        val contactDraftKey = stringPreferencesKey("contact_draft")
        val newsletterDraftKey = stringPreferencesKey("newsletter_draft")
    }
}
