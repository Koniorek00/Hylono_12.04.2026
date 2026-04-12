package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.PartnerLocation
import com.hylono.mobile.data.model.SupportInfo
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.SectionHeader

@Composable
fun PartnersScreen(
    partners: List<PartnerLocation>,
    supportInfo: SupportInfo,
    contentPadding: PaddingValues,
    onOpenSupport: () -> Unit,
) {
    val uriHandler = LocalUriHandler.current

    LazyColumn(
        modifier = Modifier.padding(contentPadding),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        item {
            SectionHeader(
                title = "Partner locator",
                subtitle = "${supportInfo.serviceArea} support coverage with showrooms, clinics, and distributors.",
            )
        }
        item {
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        text = supportInfo.companyName,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(text = supportInfo.description, style = MaterialTheme.typography.bodyLarge)
                    Text(
                        text = "${supportInfo.supportHours} • ${supportInfo.contactEmail}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    TextButton(onClick = onOpenSupport) {
                        Text("Open request center")
                    }
                }
            }
        }
        items(partners, key = { it.id }) { partner ->
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = partner.name,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = "${partner.type} • ${partner.city}, ${partner.country}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Text(text = "${partner.address}\n${partner.hours}", style = MaterialTheme.typography.bodyLarge)
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        partner.features.forEach { feature ->
                            InfoChip(text = feature)
                        }
                    }
                    Text(
                        text = "Rated ${partner.rating}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        TextButton(onClick = { uriHandler.openUri("tel:${partner.phone.replace(" ", "")}") }) {
                            Text("Call")
                        }
                        TextButton(onClick = { uriHandler.openUri("mailto:${partner.email}") }) {
                            Text("Email")
                        }
                        partner.website?.let { website ->
                            TextButton(onClick = { uriHandler.openUri(website) }) {
                                Text("Website")
                            }
                        }
                    }
                }
            }
        }
    }
}
