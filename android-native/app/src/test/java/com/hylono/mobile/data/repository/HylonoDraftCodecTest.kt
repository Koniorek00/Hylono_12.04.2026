package com.hylono.mobile.data.repository

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.BookingType
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.ContactInquiryType
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.RentalDraft
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class HylonoDraftCodecTest {
    @Test
    fun `booking draft round-trips through codec`() {
        val draft = BookingDraft(
            fullName = "Jane Doe",
            email = "jane@hylono.com",
            phone = "+48 22 123 4567",
            preferredDate = "2026-04-14",
            preferredTime = "10:00",
            bookingType = BookingType.Demo,
            techInterest = "HBOT",
            notes = "Needs morning slot.",
        )

        val decoded = HylonoDraftCodec.decodeBookingDraft(
            HylonoDraftCodec.encodeBookingDraft(draft),
        )

        assertEquals(draft, decoded)
    }

    @Test
    fun `rental draft falls back to default product id when payload is malformed`() {
        val decoded = HylonoDraftCodec.decodeRentalDraft(
            payload = "{not-json",
            defaultProductId = "fallback-product",
        )

        assertEquals("fallback-product", decoded.productId)
        assertEquals(1, decoded.quantity)
        assertEquals(3, decoded.termMonths)
    }

    @Test
    fun `contact draft round-trips through codec`() {
        val draft = ContactDraft(
            fullName = "Jane Doe",
            email = "jane@hylono.com",
            phone = "+48 22 123 4567",
            company = "Hylono",
            subject = "Support request",
            inquiryType = ContactInquiryType.Support,
            message = "Need help with the intake flow.",
        )

        val decoded = HylonoDraftCodec.decodeContactDraft(
            HylonoDraftCodec.encodeContactDraft(draft),
        )

        assertEquals(draft, decoded)
    }

    @Test
    fun `newsletter draft round-trips through codec`() {
        val draft = NewsletterDraft(
            email = "jane@hylono.com",
            firstName = "Jane",
        )

        val decoded = HylonoDraftCodec.decodeNewsletterDraft(
            HylonoDraftCodec.encodeNewsletterDraft(draft),
        )

        assertEquals(draft, decoded)
    }

    @Test
    fun `booking codec drops blank tech interest`() {
        val decoded = HylonoDraftCodec.decodeBookingDraft(
            """{"fullName":"Jane","email":"jane@hylono.com","techInterest":""}""",
        )

        assertNull(decoded.techInterest)
    }
}
