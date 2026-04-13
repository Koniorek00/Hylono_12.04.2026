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
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.RentalHistoryLineItem
import com.hylono.mobile.data.model.RentalHistoryRecord
import com.hylono.mobile.data.model.hasContent
import com.hylono.mobile.ui.MobileSessionUiState
import com.hylono.mobile.ui.RentalHistoryUiState
import com.hylono.mobile.ui.SubmissionUiState
import com.hylono.mobile.ui.components.BackHeader
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.SectionHeader
import com.hylono.mobile.ui.components.SubmissionBanner
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun RentalScreen(
    products: List<Product>,
    draft: RentalDraft,
    feedback: SubmissionUiState,
    mobileSession: MobileSessionUiState,
    rentalHistory: RentalHistoryUiState,
    contentPadding: PaddingValues,
    onBack: () -> Unit,
    onDraftChange: (RentalDraft) -> Unit,
    onClearDraft: () -> Unit,
    onDismissFeedback: () -> Unit,
    onDismissMobileSessionFeedback: () -> Unit,
    onDismissRentalHistoryFeedback: () -> Unit,
    onSignIn: (String, String) -> Unit,
    onSignOut: () -> Unit,
    onRefreshRentalHistory: () -> Unit,
    onSubmit: (RentalDraft) -> Unit,
) {
    val rentableProducts = products.filter { it.rentalMonthlyPrice != null }
    val defaultProductId = rentableProducts.firstOrNull()?.id.orEmpty()
    val selectedProduct = rentableProducts.firstOrNull { it.id == draft.productId }
    val monthlyEstimate = selectedProduct?.rentalMonthlyPrice?.times(draft.quantity)
    var authEmail by rememberSaveable { mutableStateOf(draft.email) }
    var authPassword by rememberSaveable { mutableStateOf("") }

    LaunchedEffect(mobileSession.session?.userEmail) {
        mobileSession.session?.let { session ->
            authEmail = session.userEmail
            authPassword = ""
        }
    }

    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        BackHeader(
            title = "Rental application",
            subtitle = "Submit new rental intake and review the authenticated account's active rental history from one native workspace.",
            onBack = onBack,
        )
        SubmissionBanner(feedback = feedback, onDismiss = onDismissFeedback)

        SectionHeader(
            title = "Secure rental access",
            subtitle = "Use a mobile-safe session to synchronize active rental applications without bouncing back to the website.",
        )
        SubmissionBanner(
            feedback = mobileSession.feedback,
            onDismiss = onDismissMobileSessionFeedback,
        )

        if (mobileSession.isRestoring) {
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        text = "Restoring secure session",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = "Checking whether this device already has a valid mobile session for rental history access.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        } else if (mobileSession.session == null) {
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = "Unlock rental history",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = "Current scope: this mobile sign-in maps to the repo-configured credentials account used by the protected website login. It unlocks history for that account only, without relying on a browser cookie.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    RentalField(
                        label = "Account email",
                        value = authEmail,
                        onValueChange = { authEmail = it },
                        keyboardType = KeyboardType.Email,
                    )
                    OutlinedTextField(
                        value = authPassword,
                        onValueChange = { authPassword = it },
                        label = { Text("Account password") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier.fillMaxWidth(),
                    )
                    Button(
                        onClick = { onSignIn(authEmail, authPassword) },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !mobileSession.isSubmitting,
                    ) {
                        Text(
                            if (mobileSession.isSubmitting) {
                                "Signing in..."
                            } else {
                                "Unlock rental history"
                            },
                        )
                    }
                }
            }
        } else {
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        InfoChip(text = "Signed in")
                        mobileSession.session.scopes.forEach { scope ->
                            InfoChip(text = scope)
                        }
                    }
                    Text(
                        text = mobileSession.session.userName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = mobileSession.session.userEmail,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Button(
                            onClick = onRefreshRentalHistory,
                            enabled = !rentalHistory.isLoading,
                            modifier = Modifier.weight(1f),
                        ) {
                            Text(if (rentalHistory.isLoading) "Syncing..." else "Sync history")
                        }
                        TextButton(
                            onClick = onSignOut,
                            modifier = Modifier.weight(1f),
                        ) {
                            Text("Sign out")
                        }
                    }
                }
            }
        }

        SectionHeader(
            title = "Existing rental applications",
            subtitle = "Review the active rental requests tied to the authenticated mobile session.",
        )
        SubmissionBanner(
            feedback = rentalHistory.feedback,
            onDismiss = onDismissRentalHistoryFeedback,
        )
        when {
            mobileSession.session == null -> {
                Text(
                    text = "Sign in above to synchronize rental applications already associated with your account.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            rentalHistory.isLoading -> {
                Card(
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                ) {
                    Text(
                        text = "Synchronizing rental history...",
                        modifier = Modifier.padding(18.dp),
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }

            rentalHistory.rentals.isEmpty() -> {
                Card(
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                ) {
                    Text(
                        text = "No active rental applications were found for this account yet.",
                        modifier = Modifier.padding(18.dp),
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }

            else -> {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    rentalHistory.rentals.forEach { rental ->
                        RentalHistoryCard(
                            rental = rental,
                            products = products,
                        )
                    }
                }
            }
        }

        SectionHeader(
            title = "New rental application",
            subtitle = "This keeps the native intake aligned with the existing backend contract while leaving authenticated history in the section above.",
        )

        SectionHeader(
            title = "Select device",
            subtitle = "Only rental-ready devices are shown in the app workflow. Drafts stay on this device until you send or clear them.",
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            rentableProducts.forEach { product ->
                androidx.compose.material3.FilterChip(
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
                androidx.compose.material3.FilterChip(
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
            Text(text = "Estimated monthly: ${monthlyEstimate ?: 0} - ${product.rentalPriceLabel.orEmpty()}")
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
private fun RentalHistoryCard(
    rental: RentalHistoryRecord,
    products: List<Product>,
) {
    Card(
        shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                InfoChip(text = "Rental ${rental.id}")
                InfoChip(text = rental.status.replaceFirstChar { it.uppercase() })
                InfoChip(text = "${rental.termMonths} months")
            }
            Text(
                text = "EUR ${formatMonthlyAmount(rental.totalMonthly)} / month",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                text = "Created ${formatCreatedAt(rental.createdAt)}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            rental.contact?.let { contact ->
                Text(
                    text = "${contact.fullName} - ${contact.city}, ${contact.country}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                rental.items.forEach { item ->
                    Text(
                        text = renderRentalItemLine(item, products),
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }
        }
    }
}

private fun renderRentalItemLine(
    item: RentalHistoryLineItem,
    products: List<Product>,
): String {
    val productLabel = products.firstOrNull { product -> product.id == item.techId }
        ?.title
        ?: item.techId

    return "${item.quantity}x $productLabel at EUR ${formatMonthlyAmount(item.monthlyPrice)} / month"
}

private fun formatMonthlyAmount(amount: Double): String =
    String.format(Locale.US, "%.2f", amount)

private fun formatCreatedAt(value: String): String = runCatching {
    val instant = Instant.parse(value)
    val formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")
        .withLocale(Locale.US)
        .withZone(ZoneId.systemDefault())

    formatter.format(instant)
}.getOrDefault(value)

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
