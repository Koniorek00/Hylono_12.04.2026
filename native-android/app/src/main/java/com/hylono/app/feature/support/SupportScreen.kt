package com.hylono.app.feature.support

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.hylono.app.domain.operations.HylonoOperationsGateway
import com.hylono.app.domain.repository.HylonoRepository
import com.hylono.app.ui.components.GradientSpotlightCard
import com.hylono.app.ui.components.OutlinePill
import com.hylono.app.ui.components.SectionHeader
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoPanel
import com.hylono.app.ui.theme.HylonoText
import com.hylono.app.ui.theme.HylonoTextMuted

@Composable
fun SupportScreen(
    repository: HylonoRepository,
    operationsGateway: HylonoOperationsGateway
) {
    val channels = repository.supportChannels()
    val unusedGateway = operationsGateway

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            GradientSpotlightCard(
                title = "Support that matches ownership",
                summary = "Health-adjacent hardware needs onboarding, service context, and policy visibility. The native app surfaces all three."
            ) {
                OutlinePill(text = "support@hylono.com")
                OutlinePill(text = "Mon-Fri 09:00-18:00 CET")
                OutlinePill(text = "EU coverage")
            }
        }

        item {
            SectionHeader(
                title = "Support channels",
                subtitle = "Each card maps directly to an existing Next.js contract or trust route."
            )
        }

        items(channels) { channel ->
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = channel.title,
                        style = MaterialTheme.typography.titleLarge,
                        color = HylonoText
                    )
                    Text(
                        text = channel.responseWindow,
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoGold
                    )
                    Text(
                        text = channel.summary,
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoTextMuted
                    )
                    Text(
                        text = channel.routeHint,
                        style = MaterialTheme.typography.labelMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }

        item {
            SectionHeader(
                title = "Why native matters here",
                subtitle = "Support becomes a working relationship, not a footer link."
            )
        }

        item {
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "The website is still correct for public discovery. The app is where Hylono can run delivery checklists, protocol reminders, rental actions, and advisor follow-up with far less friction.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoText
                    )
                    Text(
                        text = "Next build step: wire these flows to the existing /api/contact, /api/booking, and /api/rental handlers.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }
    }
}
