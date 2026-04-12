package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.BookingType
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.hasContent
import com.hylono.mobile.ui.SubmissionUiState
import com.hylono.mobile.ui.components.BackHeader
import com.hylono.mobile.ui.components.SectionHeader
import com.hylono.mobile.ui.components.SubmissionBanner

@Composable
fun BookingScreen(
    products: List<Product>,
    draft: BookingDraft,
    feedback: SubmissionUiState,
    contentPadding: PaddingValues,
    onBack: () -> Unit,
    onDraftChange: (BookingDraft) -> Unit,
    onClearDraft: () -> Unit,
    onDismissFeedback: () -> Unit,
    onSubmit: (BookingDraft) -> Unit,
) {
    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        BackHeader(
            title = "Consultation intake",
            subtitle = "Use the same backend intake path as the website, but in a native mobile form.",
            onBack = onBack,
        )
        SubmissionBanner(feedback = feedback, onDismiss = onDismissFeedback)
        SectionHeader(
            title = "Booking type",
            subtitle = "Keep the intake explicit so the follow-up motion is correct from the start. Drafts are stored on this device until you send or clear them.",
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            BookingType.entries.forEach { type ->
                FilterChip(
                    selected = draft.bookingType == type,
                    onClick = { onDraftChange(draft.copy(bookingType = type)) },
                    label = { Text(type.label) },
                )
            }
        }

        SectionHeader(
            title = "Technology interest",
            subtitle = "Optional, but useful for routing consult prep and internal follow-up.",
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            products.map { it.modality }.distinct().forEach { modality ->
                FilterChip(
                    selected = draft.techInterest == modality,
                    onClick = { onDraftChange(draft.copy(techInterest = modality)) },
                    label = { Text(modality) },
                )
            }
        }

        SectionHeader(
            title = "Contact details",
            subtitle = "The form stays intentionally short because the backend already validates and persists the request.",
        )

        BookingField("Full name", draft.fullName, { onDraftChange(draft.copy(fullName = it)) })
        BookingField("Email", draft.email, { onDraftChange(draft.copy(email = it)) }, KeyboardType.Email)
        BookingField("Phone", draft.phone, { onDraftChange(draft.copy(phone = it)) }, KeyboardType.Phone)
        BookingField("Preferred date", draft.preferredDate, { onDraftChange(draft.copy(preferredDate = it)) })
        BookingField("Preferred time", draft.preferredTime, { onDraftChange(draft.copy(preferredTime = it)) })

        OutlinedTextField(
            value = draft.notes,
            onValueChange = { onDraftChange(draft.copy(notes = it)) },
            label = { Text("Notes") },
            minLines = 4,
            modifier = Modifier.fillMaxWidth(),
        )

        if (draft.hasContent()) {
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
            Text(if (feedback.isSubmitting) "Sending..." else "Send booking request")
        }
    }
}

@Composable
private fun BookingField(
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
