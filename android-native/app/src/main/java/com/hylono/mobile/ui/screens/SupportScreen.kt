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
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.ContactInquiryType
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.SupportInfo
import com.hylono.mobile.data.model.hasContent
import com.hylono.mobile.ui.SubmissionUiState
import com.hylono.mobile.ui.components.BackHeader
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.SectionHeader
import com.hylono.mobile.ui.components.SubmissionBanner

private enum class SupportTab(val label: String) {
    Contact("Contact"),
    Updates("Updates"),
}

@Composable
fun SupportScreen(
    supportInfo: SupportInfo,
    contactDraft: ContactDraft,
    newsletterDraft: NewsletterDraft,
    feedback: SubmissionUiState,
    newsletterFeedback: SubmissionUiState,
    contentPadding: PaddingValues,
    onBack: () -> Unit,
    onContactDraftChange: (ContactDraft) -> Unit,
    onNewsletterDraftChange: (NewsletterDraft) -> Unit,
    onClearContactDraft: () -> Unit,
    onClearNewsletterDraft: () -> Unit,
    onDismissFeedback: () -> Unit,
    onDismissNewsletterFeedback: () -> Unit,
    onSubmitContact: (ContactDraft) -> Unit,
    onSubmitNewsletter: (NewsletterDraft) -> Unit,
) {
    var selectedTab by rememberSaveable { mutableStateOf(SupportTab.Contact) }
    val uriHandler = LocalUriHandler.current

    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        BackHeader(
            title = "Support and updates",
            subtitle = "Native request center for the same trust, support, and lifecycle routes already exposed by the website backend.",
            onBack = onBack,
        )

        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(
                    text = supportInfo.companyName,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    text = supportInfo.description,
                    style = MaterialTheme.typography.bodyLarge,
                )
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    InfoChip(text = supportInfo.serviceArea)
                    InfoChip(text = supportInfo.supportHours)
                }
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    TextButton(onClick = { uriHandler.openUri("mailto:${supportInfo.supportEmail}") }) {
                        Text("Email support")
                    }
                    TextButton(onClick = { uriHandler.openUri("mailto:${supportInfo.contactEmail}") }) {
                        Text("Email contact")
                    }
                }
            }
        }

        SectionHeader(
            title = "Request center",
            subtitle = "Keep support handoff and lifecycle capture inside one native screen instead of splitting the flow back to the website.",
        )

        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Text(
                text = "Rental history lookup still depends on the website's authenticated NextAuth session. // VERIFY: add a mobile-safe auth contract before exposing it natively.",
                modifier = Modifier.padding(16.dp),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            SupportTab.entries.forEach { tab ->
                FilterChip(
                    selected = selectedTab == tab,
                    onClick = { selectedTab = tab },
                    label = { Text(tab.label) },
                )
            }
        }

        when (selectedTab) {
            SupportTab.Contact -> ContactRequestForm(
                draft = contactDraft,
                feedback = feedback,
                onDraftChange = onContactDraftChange,
                onClearDraft = onClearContactDraft,
                onDismissFeedback = onDismissFeedback,
                onSubmit = onSubmitContact,
            )

            SupportTab.Updates -> NewsletterForm(
                draft = newsletterDraft,
                feedback = newsletterFeedback,
                onDraftChange = onNewsletterDraftChange,
                onClearDraft = onClearNewsletterDraft,
                onDismissFeedback = onDismissNewsletterFeedback,
                onSubmit = onSubmitNewsletter,
            )
        }
    }
}

@Composable
private fun ContactRequestForm(
    draft: ContactDraft,
    feedback: SubmissionUiState,
    onDraftChange: (ContactDraft) -> Unit,
    onClearDraft: () -> Unit,
    onDismissFeedback: () -> Unit,
    onSubmit: (ContactDraft) -> Unit,
) {
    SubmissionBanner(feedback = feedback, onDismiss = onDismissFeedback)

    SectionHeader(
        title = "Contact Hylono",
        subtitle = "Posts directly to the current `/api/contact` contract and returns the same reference ID used by the website flow. Drafts stay local until you send or clear them.",
    )

    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        ContactInquiryType.entries.forEach { type ->
            FilterChip(
                selected = draft.inquiryType == type,
                onClick = { onDraftChange(draft.copy(inquiryType = type)) },
                label = { Text(type.label) },
            )
        }
    }

    SupportField("Full name", draft.fullName, { onDraftChange(draft.copy(fullName = it)) })
    SupportField("Email", draft.email, { onDraftChange(draft.copy(email = it)) }, KeyboardType.Email)
    SupportField("Phone", draft.phone, { onDraftChange(draft.copy(phone = it)) }, KeyboardType.Phone)
    SupportField("Company", draft.company, { onDraftChange(draft.copy(company = it)) })
    SupportField("Subject", draft.subject, { onDraftChange(draft.copy(subject = it)) })

    OutlinedTextField(
        value = draft.message,
        onValueChange = { onDraftChange(draft.copy(message = it)) },
        label = { Text("Message") },
        minLines = 5,
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
        Text(if (feedback.isSubmitting) "Sending..." else "Send support request")
    }
}

@Composable
private fun NewsletterForm(
    draft: NewsletterDraft,
    feedback: SubmissionUiState,
    onDraftChange: (NewsletterDraft) -> Unit,
    onClearDraft: () -> Unit,
    onDismissFeedback: () -> Unit,
    onSubmit: (NewsletterDraft) -> Unit,
) {
    SubmissionBanner(feedback = feedback, onDismiss = onDismissFeedback)

    SectionHeader(
        title = "Lifecycle updates",
        subtitle = "Uses the existing `/api/newsletter` route so product, protocol, and research updates stay on the same contact rail as the website. Drafts stay local until you send or clear them.",
    )

    SupportField("First name", draft.firstName, { onDraftChange(draft.copy(firstName = it)) })
    SupportField("Email", draft.email, { onDraftChange(draft.copy(email = it)) }, KeyboardType.Email)

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
        Text(if (feedback.isSubmitting) "Subscribing..." else "Subscribe to updates")
    }
}

@Composable
private fun SupportField(
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
