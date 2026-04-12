package com.hylono.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.MonitorHeart
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.ClinicClient
import com.hylono.mobile.data.model.FleetDevice
import com.hylono.mobile.data.model.FleetStatus
import com.hylono.mobile.data.model.RiskLevel
import com.hylono.mobile.data.model.SupportInfo
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.MetricCard
import com.hylono.mobile.ui.components.SectionHeader

private enum class NexusTab(val label: String) {
    Overview("Overview"),
    Clients("Clients"),
    Fleet("Fleet"),
}

@Composable
fun NexusScreen(
    clients: List<ClinicClient>,
    fleet: List<FleetDevice>,
    supportInfo: SupportInfo,
    contentPadding: PaddingValues,
) {
    var selectedTab by rememberSaveable { mutableStateOf(NexusTab.Overview) }
    var selectedClientId by rememberSaveable { mutableStateOf(clients.firstOrNull()?.id.orEmpty()) }
    val selectedClient = clients.firstOrNull { it.id == selectedClientId } ?: clients.firstOrNull()

    LazyColumn(
        modifier = Modifier.padding(contentPadding),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        item {
            SectionHeader(
                title = "Nexus workspace",
                subtitle = "The private operating layer for clinic teams, device health, and follow-up discipline.",
            )
        }
        item {
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Text(
                        text = "Clinic-side operating system",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = "Nexus keeps public discovery, intake, and post-sale operations tied to one workflow. Support window: ${supportInfo.supportHours}.",
                        style = MaterialTheme.typography.bodyLarge,
                    )
                }
            }
        }
        item {
            PrimaryTabRow(selectedTabIndex = selectedTab.ordinal) {
                NexusTab.entries.forEach { tab ->
                    Tab(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        text = { Text(tab.label) },
                    )
                }
            }
        }
        when (selectedTab) {
            NexusTab.Overview -> {
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        MetricCard(
                            title = "Active clients",
                            value = clients.size.toString(),
                            detail = "${clients.count { it.riskLevel != RiskLevel.Stable }} need closer attention.",
                            icon = Icons.Default.LocalHospital,
                            modifier = Modifier.fillMaxWidth(),
                        )
                        MetricCard(
                            title = "Fleet online",
                            value = "${fleet.count { it.status == FleetStatus.Active }} / ${fleet.size}",
                            detail = "${fleet.count { it.status != FleetStatus.Active }} devices need follow-up or service.",
                            icon = Icons.Default.MonitorHeart,
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }
                item {
                    SectionHeader(
                        title = "Immediate attention",
                        subtitle = "Bias the staff view toward issues that actually change safety or device uptime.",
                    )
                }
                items(clients.filter { it.riskLevel == RiskLevel.High }, key = { it.id }) { client ->
                    AlertCard(
                        title = client.name,
                        detail = "High-risk client • ${client.protocol} • ${client.nextSession}",
                    )
                }
                items(fleet.filter { it.status == FleetStatus.Maintenance || it.nextService == "OVERDUE" }, key = { it.id }) { device ->
                    AlertCard(
                        title = device.model,
                        detail = "${device.type} • ${device.serial} • next service ${device.nextService}",
                    )
                }
            }

            NexusTab.Clients -> {
                items(clients, key = { it.id }) { client ->
                    Card(
                        onClick = { selectedClientId = client.id },
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    ) {
                        Column(
                            modifier = Modifier.padding(18.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            Text(
                                text = client.name,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold,
                            )
                            Text(
                                text = "${client.protocol} • adherence ${client.adherence}% • next ${client.nextSession}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
                selectedClient?.let { client ->
                    item {
                        Card(
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        ) {
                            Column(
                                modifier = Modifier.padding(20.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp),
                            ) {
                                Text(
                                    text = "Selected client",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                                Text(
                                    text = client.name,
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.SemiBold,
                                )
                                Text(
                                    text = "${client.email} • ${client.phone}",
                                    style = MaterialTheme.typography.bodyMedium,
                                )
                                FlowRow(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp),
                                ) {
                                    InfoChip(text = client.protocol)
                                    InfoChip(text = "Sessions ${client.totalSessions}")
                                    InfoChip(text = "Joined ${client.joinedDate}")
                                }
                                client.notes.forEach { note ->
                                    Text(
                                        text = "• ${note.date} — ${note.text}",
                                        style = MaterialTheme.typography.bodyLarge,
                                    )
                                }
                            }
                        }
                    }
                }
            }

            NexusTab.Fleet -> {
                items(fleet, key = { it.id }) { device ->
                    Card(
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                        ) {
                            Text(
                                text = device.model,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.SemiBold,
                            )
                            Text(
                                text = "${device.type} • ${device.serial}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.primary,
                            )
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                            ) {
                                Text(text = "Health ${device.health}%", style = MaterialTheme.typography.bodyLarge)
                                Text(text = "Next service ${device.nextService}", style = MaterialTheme.typography.bodyLarge)
                            }
                            device.logs.firstOrNull()?.let { log ->
                                Text(
                                    text = "Latest log: ${log.date} — ${log.description} (${log.technician})",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AlertCard(
    title: String,
    detail: String,
) {
    Card(
        shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                text = detail,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
