package com.hylono.mobile.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.SupportAgent
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.HylonoRepository
import com.hylono.mobile.model.BookingDraft
import com.hylono.mobile.model.ContactDraft
import com.hylono.mobile.model.Product
import com.hylono.mobile.model.RentalDraft
import com.hylono.mobile.model.RentalLineItem
import com.hylono.mobile.model.RentalLookupResult
import com.hylono.mobile.model.RentalStatus
import com.hylono.mobile.model.Workspace
import kotlinx.coroutines.launch

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun RequestCenterScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
    repository: HylonoRepository,
    snackbarHostState: SnackbarHostState,
) {
    var selectedTab by rememberSaveable { mutableStateOf("booking") }
    val snapshot = uiState.snapshot

    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            SectionLabel("Request center")
            Text(
                "Native intake surface for the same endpoints the website already uses.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        item {
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("booking", "rental", "contact", "newsletter").forEach { tab ->
                    FilterChip(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        label = { Text(tab.replaceFirstChar(Char::uppercase)) },
                    )
                }
            }
        }
        item {
            ApiStatusCard(baseUrl = snapshot.brand.apiBaseUrl)
        }
        item {
            when (selectedTab) {
                "booking" -> BookingForm(repository, snackbarHostState)
                "rental" -> RentalForm(repository, snapshot.products, snackbarHostState)
                "contact" -> ContactForm(repository, snackbarHostState)
                else -> NewsletterForm(repository, snackbarHostState)
            }
        }
        item {
            RentalLookupCard(repository, snackbarHostState)
        }
    }
}

@Composable
internal fun SupportScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
) {
    val snapshot = uiState.snapshot
    val uriHandler = LocalUriHandler.current
    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            HeroPanel(
                title = "Support coverage across ${snapshot.brand.serviceArea}.",
                body = "Use the locator to move from education into a real clinic, showroom, or distributor conversation.",
                primaryAction = "Email support",
                secondaryAction = "Open contact",
                onPrimaryAction = { uriHandler.openUri("mailto:${snapshot.brand.supportEmail}") },
                onSecondaryAction = { uriHandler.openUri("mailto:${snapshot.brand.contactEmail}") },
            )
        }
        items(snapshot.partners, key = { it.id }) { partner ->
            ExploreCard(
                icon = Icons.Default.Public,
                overline = "${partner.type} - ${partner.country}",
                title = partner.name,
                body = "${partner.address}\n${partner.hours}\n${partner.features.joinToString()}",
                footer = partner.email,
                actionLabel = "Open contact",
                accent = partner.city,
                onClick = {
                    partner.website?.let(uriHandler::openUri) ?: uriHandler.openUri("mailto:${partner.email}")
                },
            )
        }
    }
}

@Composable
private fun BookingForm(
    repository: HylonoRepository,
    snackbarHostState: SnackbarHostState,
) {
    var name by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var phone by rememberSaveable { mutableStateOf("") }
    var preferredDate by rememberSaveable { mutableStateOf("") }
    var techInterest by rememberSaveable { mutableStateOf("") }
    var notes by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    RequestCard("Book a consultation", "Posts into the current `/api/booking` route.") {
        Field("Full name", name) { name = it }
        Field("Email", email) { email = it }
        Field("Phone", phone) { phone = it }
        Field("Preferred date", preferredDate) { preferredDate = it }
        Field("Technology interest", techInterest) { techInterest = it }
        Field("Notes", notes, singleLine = false) { notes = it }
        SubmitButton(
            label = if (loading) "Submitting..." else "Send booking request",
            enabled = !loading && name.isNotBlank() && email.isNotBlank(),
        ) {
            loading = true
            scope.launch {
                val result = repository.submitBooking(
                    BookingDraft(name, email, phone, preferredDate, techInterest, notes),
                )
                loading = false
                snackbarHostState.showSnackbar(result.message, SnackbarDuration.Short)
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun RentalForm(
    repository: HylonoRepository,
    products: List<Product>,
    snackbarHostState: SnackbarHostState,
) {
    var fullName by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var phone by rememberSaveable { mutableStateOf("") }
    var address by rememberSaveable { mutableStateOf("") }
    var city by rememberSaveable { mutableStateOf("") }
    var postalCode by rememberSaveable { mutableStateOf("") }
    var country by rememberSaveable { mutableStateOf("Poland") }
    var company by rememberSaveable { mutableStateOf("") }
    var months by rememberSaveable { mutableIntStateOf(12) }
    var selectedProductId by rememberSaveable { mutableStateOf(products.first().id) }
    var loading by rememberSaveable { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val product = products.first { it.id == selectedProductId }

    RequestCard("Start a rental application", "Posts into the current `/api/rental` route.") {
        Field("Full name", fullName) { fullName = it }
        Field("Email", email) { email = it }
        Field("Phone", phone) { phone = it }
        Field("Address", address) { address = it }
        Field("City", city) { city = it }
        Field("Postal code", postalCode) { postalCode = it }
        Field("Country", country) { country = it }
        Field("Company", company) { company = it }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            products.forEach { item ->
                FilterChip(
                    selected = selectedProductId == item.id,
                    onClick = { selectedProductId = item.id },
                    label = { Text(item.title) },
                )
            }
        }
        Text("Selected rental from EUR ${product.rentalFromEur} / month")
        Field("Term months", months.toString()) { value ->
            months = value.toIntOrNull()?.coerceIn(1, 60) ?: months
        }
        SubmitButton(
            label = if (loading) "Submitting..." else "Send rental request",
            enabled = !loading && fullName.isNotBlank() && email.isNotBlank() && address.isNotBlank(),
        ) {
            loading = true
            scope.launch {
                val result = repository.submitRental(
                    RentalDraft(
                        fullName = fullName,
                        email = email,
                        phone = phone,
                        address = address,
                        city = city,
                        postalCode = postalCode,
                        country = country,
                        company = company,
                        termMonths = months,
                        items = listOf(RentalLineItem(product.id, 1, product.rentalFromEur.toDouble())),
                    ),
                )
                loading = false
                snackbarHostState.showSnackbar(result.message, SnackbarDuration.Short)
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ContactForm(
    repository: HylonoRepository,
    snackbarHostState: SnackbarHostState,
) {
    var name by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var phone by rememberSaveable { mutableStateOf("") }
    var company by rememberSaveable { mutableStateOf("") }
    var subject by rememberSaveable { mutableStateOf("") }
    var inquiryType by rememberSaveable { mutableStateOf("General") }
    var message by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    RequestCard("Contact Hylono", "Routes directly into the current support and CRM flow.") {
        Field("Full name", name) { name = it }
        Field("Email", email) { email = it }
        Field("Phone", phone) { phone = it }
        Field("Company", company) { company = it }
        Field("Subject", subject) { subject = it }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("General", "Rental", "B2B", "Support", "Press").forEach { type ->
                FilterChip(selected = inquiryType == type, onClick = { inquiryType = type }, label = { Text(type) })
            }
        }
        Field("Message", message, singleLine = false) { message = it }
        SubmitButton(
            label = if (loading) "Submitting..." else "Send contact request",
            enabled = !loading && name.isNotBlank() && email.isNotBlank() && message.length >= 10,
        ) {
            loading = true
            scope.launch {
                val result = repository.submitContact(
                    ContactDraft(
                        name = name,
                        email = email,
                        phone = phone,
                        company = company,
                        subject = subject.ifBlank { "App contact request" },
                        message = message,
                        inquiryType = inquiryType,
                    ),
                )
                loading = false
                snackbarHostState.showSnackbar(result.message, SnackbarDuration.Short)
            }
        }
    }
}

@Composable
private fun NewsletterForm(
    repository: HylonoRepository,
    snackbarHostState: SnackbarHostState,
) {
    var firstName by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    RequestCard("Subscribe to updates", "Uses the same newsletter endpoint and provider sync flow.") {
        Field("First name", firstName) { firstName = it }
        Field("Email", email) { email = it }
        SubmitButton(
            label = if (loading) "Submitting..." else "Subscribe",
            enabled = !loading && email.isNotBlank(),
        ) {
            loading = true
            scope.launch {
                val result = repository.submitNewsletter(com.hylono.mobile.model.NewsletterDraft(email, firstName))
                loading = false
                snackbarHostState.showSnackbar(result.message, SnackbarDuration.Short)
            }
        }
    }
}

@Composable
private fun RentalLookupCard(
    repository: HylonoRepository,
    snackbarHostState: SnackbarHostState,
) {
    var email by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    var lookup by remember { mutableStateOf<RentalLookupResult?>(null) }
    val scope = rememberCoroutineScope()

    RequestCard("Lookup existing rentals", "Reads the current `GET /api/rental?email=` route.") {
        Field("Email", email) { email = it }
        SubmitButton(
            label = if (loading) "Loading..." else "Check rental status",
            enabled = !loading && email.isNotBlank(),
        ) {
            loading = true
            scope.launch {
                lookup = repository.lookupRentals(email)
                loading = false
                snackbarHostState.showSnackbar(lookup?.message ?: "Lookup finished.", SnackbarDuration.Short)
            }
        }
        lookup?.let { result ->
            Spacer(modifier = Modifier.height(8.dp))
            if (result.rentals.isEmpty()) {
                Text(result.message, color = MaterialTheme.colorScheme.onSurfaceVariant)
            } else {
                result.rentals.forEach(::RentalStatusRow)
            }
        }
    }
}

@Composable
private fun RequestCard(
    title: String,
    description: String,
    content: @Composable ColumnScope.() -> Unit,
) {
    ElevatedCard {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = {
                Text(title, style = MaterialTheme.typography.titleLarge)
                Text(description, color = MaterialTheme.colorScheme.onSurfaceVariant)
                content()
            },
        )
    }
}

@Composable
private fun Field(
    label: String,
    value: String,
    singleLine: Boolean = true,
    onValueChange: (String) -> Unit,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        label = { Text(label) },
        singleLine = singleLine,
        minLines = if (singleLine) 1 else 4,
    )
}

@Composable
private fun SubmitButton(
    label: String,
    enabled: Boolean,
    onClick: () -> Unit,
) {
    FilledTonalButton(onClick = onClick, enabled = enabled, modifier = Modifier.fillMaxWidth()) {
        Text(label)
    }
}

@Composable
private fun ApiStatusCard(baseUrl: String) {
    OutlinedCard(modifier = Modifier.fillMaxWidth(), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("API target", fontWeight = FontWeight.Bold)
            Text(baseUrl, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(
                "Set `HYLONO_API_BASE_URL` at build time to target local Next.js (`http://10.0.2.2:3000`) or production.",
                style = MaterialTheme.typography.bodySmall,
            )
        }
    }
}

@Composable
private fun RentalStatusRow(rental: RentalStatus) {
    OutlinedCard(modifier = Modifier.fillMaxWidth(), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(rental.id, fontWeight = FontWeight.Bold)
            Text("${rental.status} - ${rental.termMonths} months - EUR ${rental.totalMonthly} / month")
            Text(rental.itemsSummary, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(rental.createdAt, style = MaterialTheme.typography.bodySmall)
        }
    }
}
