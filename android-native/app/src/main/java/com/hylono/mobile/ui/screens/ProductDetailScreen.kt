package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.Protocol
import com.hylono.mobile.ui.components.BackHeader
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.SectionHeader

@Composable
fun ProductDetailScreen(
    product: Product?,
    protocols: List<Protocol>,
    contentPadding: PaddingValues,
    onBack: () -> Unit,
    onBook: () -> Unit,
    onRent: () -> Unit,
    onOpenProtocol: (String) -> Unit,
) {
    if (product == null) {
        Column(
            modifier = Modifier
                .padding(contentPadding)
                .padding(24.dp),
        ) {
            BackHeader(
                title = "Device not found",
                subtitle = "The selected device could not be resolved from the seed catalog.",
                onBack = onBack,
            )
        }
        return
    }

    val linkedProtocols = protocols.filter { it.slug in product.protocolIds }

    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        BackHeader(
            title = product.title,
            subtitle = "${product.modality} • ${product.intendedUse}",
            onBack = onBack,
        )

        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(
                modifier = Modifier.padding(22.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                Text(text = product.shortDescription, style = MaterialTheme.typography.bodyLarge)
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    product.goalTags.forEach { goal ->
                        InfoChip(text = goal)
                    }
                }
                Text(
                    text = "Purchase ${product.purchasePriceLabel}",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
                product.financingLabel?.let { financing ->
                    Text(text = financing, style = MaterialTheme.typography.titleMedium)
                }
                product.rentalPriceLabel?.let { rental ->
                    Text(text = rental, style = MaterialTheme.typography.titleMedium)
                }
                Button(onClick = onBook, modifier = Modifier.fillMaxWidth()) {
                    Text("Book consult for this device")
                }
                TextButton(onClick = onRent, modifier = Modifier.fillMaxWidth()) {
                    Text("Open rental workflow")
                }
            }
        }

        SectionHeader(
            title = "What stands out",
            subtitle = product.reviewStatus,
        )
        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                product.highlights.forEach { highlight ->
                    Text(text = "• $highlight", style = MaterialTheme.typography.bodyLarge)
                }
            }
        }

        SectionHeader(
            title = "Safety and deployment notes",
            subtitle = product.supportNote,
        )
        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                product.safetyNotes.forEach { note ->
                    Text(text = "• $note", style = MaterialTheme.typography.bodyLarge)
                }
            }
        }

        SectionHeader(
            title = "Linked protocols",
            subtitle = "Tie the device back to a guided routine rather than a raw hardware sale.",
        )
        linkedProtocols.forEach { protocol ->
            Card(
                onClick = { onOpenProtocol(protocol.slug) },
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        text = protocol.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = "${protocol.goal} • ${protocol.timePerDay}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
