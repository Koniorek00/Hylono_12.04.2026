package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
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
import com.hylono.mobile.ui.components.SectionHeader

@Composable
fun ProtocolDetailScreen(
    protocol: Protocol?,
    supportingProducts: List<Product>,
    contentPadding: PaddingValues,
    onBack: () -> Unit,
    onBook: () -> Unit,
    onOpenProduct: (String) -> Unit,
) {
    if (protocol == null) {
        Column(
            modifier = Modifier
                .padding(contentPadding)
                .padding(24.dp),
        ) {
            BackHeader(
                title = "Program not found",
                subtitle = "The selected program could not be resolved from the seed library.",
                onBack = onBack,
            )
        }
        return
    }

    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        BackHeader(
            title = protocol.title,
            subtitle = "${protocol.goal} • ${protocol.difficulty}",
            onBack = onBack,
        )

        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(
                modifier = Modifier.padding(22.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(text = protocol.shortDescription, style = MaterialTheme.typography.bodyLarge)
                Text(
                    text = "${protocol.durationWeeks} weeks • ${protocol.timePerDay}",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
                Text(text = "Best fit: ${protocol.targetAudience}", style = MaterialTheme.typography.bodyLarge)
                Text(text = "Reviewer: ${protocol.reviewer}", style = MaterialTheme.typography.titleMedium)
                Button(onClick = onBook, modifier = Modifier.fillMaxWidth()) {
                    Text("Book consult for this program")
                }
            }
        }

        SectionHeader(
            title = "Program structure",
            subtitle = "Translate protocol content into a paced mobile routine with visible steps.",
        )
        protocol.weeks.forEach { week ->
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Text(
                        text = "Week ${week.number}: ${week.title}",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                    )
                    week.days.forEachIndexed { index, day ->
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(
                                text = "Day ${day.number}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold,
                            )
                            day.sessions.forEach { session ->
                                Text(
                                    text = "• ${session.modality} — ${session.duration} — ${session.parameters}",
                                    style = MaterialTheme.typography.bodyLarge,
                                )
                                session.note?.let { note ->
                                    Text(
                                        text = note,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                            }
                            if (index < week.days.lastIndex) {
                                HorizontalDivider(modifier = Modifier.padding(top = 6.dp))
                            }
                        }
                    }
                }
            }
        }

        SectionHeader(
            title = "Safety posture",
            subtitle = protocol.safetyNotes,
        )
        Card(
            shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                protocol.contraindications.forEach { contraindication ->
                    Text(text = "• $contraindication", style = MaterialTheme.typography.bodyLarge)
                }
            }
        }

        if (supportingProducts.isNotEmpty()) {
            SectionHeader(
                title = "Supporting devices",
                subtitle = "Keep the commercial recommendation anchored to the protocol, not just the hardware card.",
            )
            supportingProducts.forEach { product ->
                Card(
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Text(
                            text = product.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                        )
                        Text(text = product.shortDescription, style = MaterialTheme.typography.bodyMedium)
                        TextButton(onClick = { onOpenProduct(product.id) }) {
                            Text("Inspect device")
                        }
                    }
                }
            }
        }
    }
}
