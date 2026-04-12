package com.hylono.app.feature.devices

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.hylono.app.domain.model.DeviceCategory
import com.hylono.app.domain.repository.HylonoRepository
import com.hylono.app.ui.components.OutlinePill
import com.hylono.app.ui.components.SectionHeader
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoPanel
import com.hylono.app.ui.theme.HylonoText
import com.hylono.app.ui.theme.HylonoTextMuted
import com.hylono.app.ui.util.formatEur

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DevicesScreen(repository: HylonoRepository) {
    val devices = repository.devices()
    val categories = listOf("All") + DeviceCategory.entries.map { it.name.replace('_', ' ') }
    var selectedCategory by rememberSaveable { mutableStateOf("All") }
    val filteredDevices = devices.filter {
        selectedCategory == "All" || it.category.name.replace('_', ' ') == selectedCategory
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Device architecture",
                subtitle = "The Android app starts from operational fit: household routine, output profile, and protocol compatibility."
            )
        }

        item {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                categories.forEach { category ->
                    FilterChip(
                        selected = selectedCategory == category,
                        onClick = { selectedCategory = category },
                        label = { Text(category) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = HylonoGold,
                            selectedLabelColor = com.hylono.app.ui.theme.HylonoInk,
                            containerColor = HylonoPanel,
                            labelColor = HylonoTextMuted
                        )
                    )
                }
            }
        }

        items(filteredDevices) { device ->
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(30.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = device.title,
                        style = MaterialTheme.typography.headlineMedium,
                        color = HylonoText
                    )
                    Text(
                        text = device.family,
                        style = MaterialTheme.typography.titleMedium,
                        color = HylonoGold
                    )
                    Text(
                        text = device.summary,
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoTextMuted
                    )
                    Text(
                        text = "Purchase ${formatEur(device.purchasePriceEur)}" +
                            (device.rentalFromEur?.let { " | Rental from ${formatEur(it)}" } ?: ""),
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoText
                    )
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        device.highlights.forEach { highlight ->
                            OutlinePill(text = highlight)
                        }
                    }
                    Text(
                        text = "Used in ${device.protocolTitles.joinToString()}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                    Text(
                        text = "Best aligned with ${device.goalTitles.joinToString()}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }
    }
}
