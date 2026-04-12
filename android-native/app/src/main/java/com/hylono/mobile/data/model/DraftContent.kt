package com.hylono.mobile.data.model

fun BookingDraft.hasContent(): Boolean =
    fullName.isNotBlank() ||
        email.isNotBlank() ||
        phone.isNotBlank() ||
        preferredDate.isNotBlank() ||
        preferredTime.isNotBlank() ||
        notes.isNotBlank() ||
        !techInterest.isNullOrBlank() ||
        bookingType != BookingType.Consultation

fun RentalDraft.hasContent(defaultProductId: String): Boolean =
    productId.isNotBlank() && productId != defaultProductId ||
        quantity != 1 ||
        termMonths != 3 ||
        fullName.isNotBlank() ||
        email.isNotBlank() ||
        phone.isNotBlank() ||
        address.isNotBlank() ||
        city.isNotBlank() ||
        postalCode.isNotBlank() ||
        country != "Poland" ||
        company.isNotBlank()

fun ContactDraft.hasContent(): Boolean =
    fullName.isNotBlank() ||
        email.isNotBlank() ||
        phone.isNotBlank() ||
        company.isNotBlank() ||
        subject.isNotBlank() ||
        message.isNotBlank() ||
        inquiryType != ContactInquiryType.General

fun NewsletterDraft.hasContent(): Boolean =
    email.isNotBlank() || firstName.isNotBlank()
