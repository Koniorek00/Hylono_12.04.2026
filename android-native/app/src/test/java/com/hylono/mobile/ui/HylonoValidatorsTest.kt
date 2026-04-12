package com.hylono.mobile.ui

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.RentalDraft
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class HylonoValidatorsTest {
    private val rentableProduct = Product(
        id = "hbot-st1700",
        title = "HBOT ST1700",
        modality = "HBOT",
        shortDescription = "Test product",
        intendedUse = "Home",
        purchasePriceLabel = "24,900",
        financingLabel = null,
        rentalPriceLabel = "Rental from 1,299 / month",
        rentalMonthlyPrice = 1299,
        goalTags = emptyList(),
        highlights = emptyList(),
        safetyNotes = emptyList(),
        protocolIds = emptyList(),
        supportNote = "",
        reviewStatus = "",
    )

    @Test
    fun `validateBooking rejects invalid email`() {
        val result = validateBooking(
            BookingDraft(
                fullName = "Jane Doe",
                email = "invalid",
            ),
        )

        assertEquals("Enter a valid email address.", result)
    }

    @Test
    fun `validateBooking accepts valid draft`() {
        val result = validateBooking(
            BookingDraft(
                fullName = "Jane Doe",
                email = "jane@hylono.com",
            ),
        )

        assertNull(result)
    }

    @Test
    fun `validateRental rejects missing rental product`() {
        val result = validateRental(
            draft = RentalDraft(
                productId = "missing",
                fullName = "Jane Doe",
                email = "jane@hylono.com",
                address = "Main Street 1",
                city = "Warsaw",
                postalCode = "00-001",
                country = "Poland",
            ),
            products = listOf(rentableProduct),
        )

        assertEquals("Select a rental-ready device.", result)
    }

    @Test
    fun `validateRental accepts valid draft`() {
        val result = validateRental(
            draft = RentalDraft(
                productId = rentableProduct.id,
                fullName = "Jane Doe",
                email = "jane@hylono.com",
                address = "Main Street 1",
                city = "Warsaw",
                postalCode = "00-001",
                country = "Poland",
            ),
            products = listOf(rentableProduct),
        )

        assertNull(result)
    }

    @Test
    fun `validateContact rejects short message`() {
        val result = validateContact(
            ContactDraft(
                fullName = "Jane Doe",
                email = "jane@hylono.com",
                message = "short",
            ),
        )

        assertEquals("Enter a message with at least 10 characters.", result)
    }

    @Test
    fun `validateNewsletter accepts valid email`() {
        val result = validateNewsletter(
            NewsletterDraft(
                email = "jane@hylono.com",
            ),
        )

        assertNull(result)
    }
}
