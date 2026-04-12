package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.hasContent
import com.hylono.mobile.ui.SubmissionUiState
import com.hylono.mobile.ui.components.BackHeader
import com.hylono.mobile.ui.components.SectionHeader
import com.hylono.mobile.ui.components.SubmissionBanner

@Composable
fun RentalScreen(
    products: List<Product>,
    draft: RentalDraft,
    feedback: SubmissionUiState,
    contentPadding: PaddingValues,
    onBack: () -> Unit,
    onDraftChange: (RentalDraft) -> Unit,
    onClearDraft: () -> Unit,
    onDismissFeedback: () -> Unit,
    onSubmit: (RentalDraft) -> Unit,
) {
    val rentableProducts = products.filter { it.rentalMonthlyPrice != null }
    val defaultProductId = rentableProducts.firstOrNull()?.id.orEmpty()
    val selectedProduct = rentableProducts.firstOrNull { it.id == draft.productId }
    val monthlyEstimate = selectedProduct?.rentalMonthlyPrice?.times(draft.quantity)

    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        BackHeader(
            title = "Rental application",
            subtitle = "Submit the same rental intake the website expects, but framed for an operator-friendly mobile workflow.",
            onBack = onBack,
        )
        SubmissionBanner(feedback = feedback, onDismiss = onDismissFeedback)

        SectionHeader(
            title = "Select device",
            subtitle = "Only rental-ready devices are shown in the app workflow. Drafts stay on this device until you send or clear them.",
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            rentableProducts.forEach { product ->
                FilterChip(
                    selected = draft.productId == product.id,
                    onClick = { onDraftChange(draft.copy(productId = product.id)) },
                    label = { Text(product.title) },
                )
            }
        }

        SectionHeader(
            title = "Term and quantity",
            subtitle = "This keeps the mobile request close to how the backend prices and routes rentals.",
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            listOf(1, 3, 6, 12).forEach { months ->
                FilterChip(
                    selected = draft.termMonths == months,
                    onClick = { onDraftChange(draft.copy(termMonths = months)) },
                    label = { Text("$months mo") },
                )
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(text = "Quantity")
            Row {
                IconButton(onClick = { onDraftChange(draft.copy(quantity = (draft.quantity - 1).coerceAtLeast(1))) }) {
                    Text("-")
                }
                Text(text = draft.quantity.toString(), modifier = Modifier.padding(vertical = 12.dp))
                IconButton(onClick = { onDraftChange(draft.copy(quantity = draft.quantity + 1)) }) {
                    Text("+")
                }
            }
        }

        selectedProduct?.let { product ->
            Text(text = "Estimated monthly: ${monthlyEstimate ?: 0} • ${product.rentalPriceLabel.orEmpty()}")
        }

        SectionHeader(
            title = "Delivery details",
            subtitle = "The rental endpoint expects real contact and delivery fields, so the app collects them directly.",
        )
        RentalField("Full name", draft.fullName, { onDraftChange(draft.copy(fullName = it)) })
        RentalField("Email", draft.email, { onDraftChange(draft.copy(email = it)) }, KeyboardType.Email)
        RentalField("Phone", draft.phone, { onDraftChange(draft.copy(phone = it)) }, KeyboardType.Phone)
        RentalField("Address", draft.address, { onDraftChange(draft.copy(address = it)) })
        RentalField("City", draft.city, { onDraftChange(draft.copy(city = it)) })
        RentalField("Postal code", draft.postalCode, { onDraftChange(draft.copy(postalCode = it)) })
        RentalField("Country", draft.country, { onDraftChange(draft.copy(country = it)) })
        RentalField("Company (optional)", draft.company, { onDraftChange(draft.copy(company = it)) })

        Text(
            text = "Existing rental history still requires a website-authenticated session. // VERIFY: mobile auth contract before exposing native lookup.",
        )

        if (draft.hasContent(defaultProductId)) {
            TextButton(
                onClick = onClearDraft,
                modifier = Modifier.fillMaxWidth(),
                enabled = !feedback.isSubmitting,
            ) {
                Text("Clear saved draft")
            }
        }

        Button(
            onClick = { onSubmit(draft) },
            modifier = Modifier.fillMaxWidth(),
            enabled = !feedback.isSubmitting,
        ) {
            Text(if (feedback.isSubmitting) "Sending..." else "Send rental application")
        }
    }
}

@Composable
private fun RentalField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
    )
}
