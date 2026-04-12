package com.hylono.mobile.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.model.PartnerDestination
import com.hylono.mobile.model.RiskLevel
import com.hylono.mobile.model.SupplyStatus

@Composable
internal fun PartnerWorkspace(
    modifier: Modifier,
    uiState: HylonoUiState,
) {
    when (uiState.partnerDestination) {
        PartnerDestination.OVERVIEW -> PartnerOverviewScreen(modifier, uiState)
        PartnerDestination.CLIENTS -> PartnerClientsScreen(modifier, uiState)
        PartnerDestination.ACADEMY -> PartnerAcademyScreen(modifier, uiState)
        PartnerDestination.SUPPLIES -> PartnerSuppliesScreen(modifier, uiState)
    }
}

@Composable
private fun PartnerOverviewScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
) {
    val snapshot = uiState.snapshot
    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            HeroPanel(
                title = "Partner operations in a native workspace.",
                body = "This surface maps the current Nexus ideas from the website into a field-usable Android shell for clinic operators.",
                primaryAction = "Clients",
                secondaryAction = "Academy",
                onPrimaryAction = {},
                onSecondaryAction = {},
            )
        }
        item {
            SectionLabel("Clinic snapshot")
        }
        items(snapshot.partnerMetrics, key = { it.label }) { metric ->
            HighlightCard(
                icon = Icons.Default.WorkspacePremium,
                overline = metric.label,
                title = metric.value,
                body = metric.detail,
                footer = "Seeded until live partner APIs are added",
            )
        }
    }
}

@Composable
private fun PartnerClientsScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
) {
    val snapshot = uiState.snapshot
    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item { SectionLabel("Clients") }
        items(snapshot.clients, key = { it.id }) { client ->
            val riskTone = when (client.riskLevel) {
                RiskLevel.STABLE -> "Stable"
                RiskLevel.MONITOR -> "Monitor"
                RiskLevel.HIGH -> "High risk"
            }
            ExploreCard(
                icon = Icons.Default.MedicalServices,
                overline = client.protocol,
                title = client.name,
                body = client.note,
                footer = "Adherence ${client.adherencePercent}% - Next ${client.nextSession}",
                actionLabel = "Review",
                accent = riskTone,
                onClick = {},
            )
        }
    }
}

@Composable
private fun PartnerAcademyScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
) {
    val snapshot = uiState.snapshot
    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item { SectionLabel("Academy") }
        items(snapshot.academyTracks, key = { it.id }) { track ->
            ExploreCard(
                icon = Icons.Default.Book,
                overline = track.duration,
                title = track.title,
                body = track.focus,
                footer = track.modules.joinToString(),
                actionLabel = "Open track",
                accent = track.milestone,
                onClick = {},
            )
        }
        item {
            ElevatedCard {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Text("Active assignments", style = MaterialTheme.typography.titleLarge)
                    snapshot.academyAssignments.forEach { assignment ->
                        Text("- ${assignment.title} - ${assignment.status}")
                    }
                }
            }
        }
    }
}

@Composable
private fun PartnerSuppliesScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
) {
    val snapshot = uiState.snapshot
    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item { SectionLabel("Supplies") }
        items(snapshot.supplies, key = { it.id }) { supply ->
            val statusLabel = when (supply.status) {
                SupplyStatus.HEALTHY -> "Healthy"
                SupplyStatus.REORDER -> "Restock"
                SupplyStatus.REVIEW -> "Review"
            }
            ExploreCard(
                icon = Icons.Default.Inventory2,
                overline = "${supply.category} - ${supply.sku}",
                title = supply.name,
                body = supply.note,
                footer = "On hand ${supply.onHand} / Par ${supply.parLevel}",
                actionLabel = "Draft",
                accent = statusLabel,
                onClick = {},
            )
        }
        item {
            OutlinedCard(
                modifier = Modifier.fillMaxWidth(),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text("Recent requisitions", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    uiState.snapshot.requisitions.forEach { requisition ->
                        Text("- ${requisition.label} - ${requisition.status} - ${requisition.submittedAt}")
                    }
                }
            }
        }
    }
}
