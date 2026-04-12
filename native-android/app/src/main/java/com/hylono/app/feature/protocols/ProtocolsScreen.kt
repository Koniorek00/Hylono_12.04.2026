package com.hylono.app.feature.protocols

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
import com.hylono.app.domain.repository.HylonoRepository
import com.hylono.app.ui.components.OutlinePill
import com.hylono.app.ui.components.SectionHeader
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoPanel
import com.hylono.app.ui.theme.HylonoPanelRaised
import com.hylono.app.ui.theme.HylonoText
import com.hylono.app.ui.theme.HylonoTextMuted

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ProtocolsScreen(repository: HylonoRepository) {
    val protocols = repository.protocols()
    val goalFilters = listOf("All") + protocols.map { it.goalTitle }.distinct()
    var selectedFilter by rememberSaveable { mutableStateOf("All") }
    val visibleProtocols = protocols.filter {
        selectedFilter == "All" || it.goalTitle == selectedFilter
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Protocol library",
                subtitle = "This is where the native app becomes useful every day: cadence, required devices, and session rhythm."
            )
        }

        item {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                goalFilters.forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) },
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

        items(visibleProtocols) { protocol ->
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
                        text = protocol.title,
                        style = MaterialTheme.typography.headlineMedium,
                        color = HylonoText
                    )
                    Text(
                        text = "${protocol.goalTitle} / ${protocol.difficulty} / ${protocol.durationWeeks} weeks / ${protocol.timePerDay}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoGold
                    )
                    Text(
                        text = protocol.summary,
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoTextMuted
                    )
                    Text(
                        text = protocol.audience,
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoText
                    )
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        protocol.requiredDevices.forEach { device ->
                            OutlinePill(text = device)
                        }
                    }
                    protocol.cadence.forEach { session ->
                        Surface(
                            color = HylonoPanelRaised,
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp)
                        ) {
                            androidx.compose.foundation.layout.Column(
                                modifier = Modifier.padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(
                                    text = session.label,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = HylonoText
                                )
                                Text(
                                    text = "${session.duration} / ${session.parameters}",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = HylonoTextMuted
                                )
                            }
                        }
                    }
                    Text(
                        text = "Safety: ${protocol.safetyNote}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }
    }
}
