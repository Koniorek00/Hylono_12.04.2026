package com.hylono.mobile.ui

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.RentalDraft

private val emailRegex = Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")

fun validateBooking(draft: BookingDraft): String? = when {
    draft.fullName.trim().length < 2 -> "Enter the contact name."
    !draft.email.isValidEmail() -> "Enter a valid email address."
    else -> null
}

fun validateRental(
    draft: RentalDraft,
    products: List<Product>,
): String? {
    val selectedProduct = products.firstOrNull { it.id == draft.productId }

    return when {
        selectedProduct == null -> "Select a rental-ready device."
        selectedProduct.rentalMonthlyPrice == null -> "This device is not configured for app rental."
        draft.fullName.trim().length < 2 -> "Enter the contact name."
        !draft.email.isValidEmail() -> "Enter a valid email address."
        draft.address.trim().length < 3 -> "Enter a valid address."
        draft.city.trim().length < 2 -> "Enter a city."
        draft.postalCode.trim().length < 2 -> "Enter a postal code."
        draft.country.trim().length < 2 -> "Enter a country."
        draft.quantity < 1 -> "Quantity must be at least one."
        draft.termMonths !in 1..60 -> "Term must stay between 1 and 60 months."
        else -> null
    }
}

fun validateContact(draft: ContactDraft): String? = when {
    draft.fullName.trim().length < 2 -> "Enter the contact name."
    !draft.email.isValidEmail() -> "Enter a valid email address."
    draft.message.trim().length < 10 -> "Enter a message with at least 10 characters."
    else -> null
}

fun validateNewsletter(draft: NewsletterDraft): String? = when {
    !draft.email.isValidEmail() -> "Enter a valid email address."
    else -> null
}

fun validateMobileSignIn(
    email: String,
    password: String,
): String? = when {
    !email.isValidEmail() -> "Enter a valid account email address."
    password.isBlank() -> "Enter the account password."
    else -> null
}

private fun String.isValidEmail(): Boolean = emailRegex.matches(trim())
