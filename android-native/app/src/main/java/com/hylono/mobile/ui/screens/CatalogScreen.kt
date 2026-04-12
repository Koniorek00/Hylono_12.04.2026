package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.SectionHeader

@Composable
fun CatalogScreen(
    products: List<Product>,
    contentPadding: PaddingValues,
    onOpenProduct: (String) -> Unit,
    onOpenRental: () -> Unit,
) {
    val modalities = listOf("All") + products.map { it.modality }.distinct()
    var selectedModality by rememberSaveable { mutableStateOf("All") }
    val visibleProducts = if (selectedModality == "All") products else products.filter { it.modality == selectedModality }

    LazyColumn(
        modifier = Modifier.padding(contentPadding),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        item {
            SectionHeader(
                title = "Device catalog",
                subtitle = "Native catalog built around Hylono's real consultation, rental, and follow-up workflows.",
            )
        }
        item {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                modalities.forEach { modality ->
                    FilterChip(
                        selected = selectedModality == modality,
                        onClick = { selectedModality = modality },
                        label = { Text(modality) },
                    )
                }
            }
        }
        items(visibleProducts, key = { it.id }) { product ->
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    InfoChip(text = "${product.modality} • ${product.intendedUse}")
                    Text(
                        text = product.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(text = product.shortDescription, style = MaterialTheme.typography.bodyLarge)
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        product.highlights.forEach { highlight ->
                            InfoChip(text = highlight)
                        }
                    }
                    Text(
                        text = "Purchase ${product.purchasePriceLabel}" + (product.rentalPriceLabel?.let { " • $it" } ?: ""),
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Text(
                        text = product.supportNote,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Button(
                            onClick = { onOpenProduct(product.id) },
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Text("Inspect device")
                        }
                        TextButton(
                            onClick = onOpenRental,
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Text("Start rental workflow")
                        }
                    }
                }
            }
        }
    }
}
