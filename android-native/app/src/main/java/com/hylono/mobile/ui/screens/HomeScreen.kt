package com.hylono.mobile.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.MonitorHeart
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.SupportAgent
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.HylonoAppData
import com.hylono.mobile.data.model.RiskLevel
import com.hylono.mobile.ui.components.GradientPanel
import com.hylono.mobile.ui.components.InfoChip
import com.hylono.mobile.ui.components.MetricCard
import com.hylono.mobile.ui.components.SectionHeader
import com.hylono.mobile.ui.theme.CarbonBlue
import com.hylono.mobile.ui.theme.OxygenBlue
import com.hylono.mobile.ui.theme.SignalMint

@Composable
fun HomeScreen(
    data: HylonoAppData,
    contentPadding: PaddingValues,
    onOpenCatalog: () -> Unit,
    onOpenProtocols: () -> Unit,
    onOpenBooking: () -> Unit,
    onOpenRental: () -> Unit,
    onOpenSupport: () -> Unit,
    onOpenNexus: () -> Unit,
    onOpenProduct: (String) -> Unit,
) {
    val atRiskClients = data.clients.count { it.riskLevel != RiskLevel.Stable }
    val serviceFlags = data.fleet.count { it.health < 90 || it.nextService == "OVERDUE" }

    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(contentPadding)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        GradientPanel(
            title = "Hylono Care Stack",
            body = "Native field app for guided device access, protocol adherence, intake capture, and clinic-side Nexus operations.",
            accent = Brush.linearGradient(listOf(CarbonBlue, OxygenBlue, SignalMint)),
        )

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            InfoChip(text = data.supportInfo.serviceArea)
            InfoChip(text = data.supportInfo.supportHours)
        }

        SectionHeader(
            title = "Action lanes",
            subtitle = "Move straight into the flows an operator or customer actually needs.",
        )

        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            ActionCard(
                title = "Book a consult",
                body = "Capture consultation, device-demo, and clinic-ready intake from the app.",
                icon = Icons.Default.CalendarMonth,
                onClick = onOpenBooking,
            )
            ActionCard(
                title = "Start a rental",
                body = "Submit a rental-ready application against the current catalog and monthly pricing.",
                icon = Icons.Default.Sync,
                onClick = onOpenRental,
            )
            ActionCard(
                title = "Support and updates",
                body = "Send a support request or subscribe to lifecycle updates without leaving the native shell.",
                icon = Icons.Default.SupportAgent,
                onClick = onOpenSupport,
            )
            ActionCard(
                title = "Open Nexus",
                body = "Review fleet health, client adherence, and internal operating pressure.",
                icon = Icons.Default.Shield,
                onClick = onOpenNexus,
            )
        }

        SectionHeader(
            title = "Operational pulse",
            subtitle = "The app keeps consumer discovery tied to the clinic and support workflow behind it.",
        )

        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            MetricCard(
                title = "Care programs",
                value = data.protocols.size.toString(),
                detail = "Protocol-first programs already mapped from the website content layer.",
                icon = Icons.Default.LocalHospital,
                modifier = Modifier.fillMaxWidth(),
            )
            MetricCard(
                title = "At-risk clients",
                value = atRiskClients.toString(),
                detail = "Clients needing review or follow-up in Nexus right now.",
                icon = Icons.Default.MonitorHeart,
                modifier = Modifier.fillMaxWidth(),
            )
            MetricCard(
                title = "Service flags",
                value = serviceFlags.toString(),
                detail = "Devices with overdue or low-health signals that merit action.",
                icon = Icons.Default.Speed,
                modifier = Modifier.fillMaxWidth(),
            )
        }

        SectionHeader(
            title = "Featured devices",
            subtitle = "Lead with the catalog items most connected to Hylono's consultation and rental motion.",
        )

        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            data.products.forEach { product ->
                FeaturedProductCard(
                    title = product.title,
                    modality = product.modality,
                    detail = product.shortDescription,
                    onOpen = { onOpenProduct(product.id) },
                )
            }
        }

        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                Text(
                    text = "Why this app shape works",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    text = "The website already contains device education, protocol guidance, and partner operations. The native app consolidates them into faster booking, better field usage, and clinic-side follow-through.",
                    style = MaterialTheme.typography.bodyLarge,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(onClick = onOpenCatalog) {
                        Text("Open catalog")
                    }
                    TextButton(onClick = onOpenProtocols) {
                        Text("See protocols")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))
    }
}

@Composable
private fun ActionCard(
    title: String,
    body: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Box(
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.primaryContainer, RoundedCornerShape(18.dp))
                    .padding(14.dp),
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    text = body,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Icon(imageVector = Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null)
        }
    }
}

@Composable
private fun FeaturedProductCard(
    title: String,
    modality: String,
    detail: String,
    onOpen: () -> Unit,
) {
    Card(
        onClick = onOpen,
        modifier = Modifier.width(280.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            InfoChip(text = modality)
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                text = detail,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            TextButton(onClick = onOpen) {
                Text("Inspect device")
            }
        }
    }
}
