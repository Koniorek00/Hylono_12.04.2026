package com.hylono.app.feature.rentals

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.hylono.app.domain.repository.HylonoRepository
import com.hylono.app.ui.components.GradientSpotlightCard
import com.hylono.app.ui.components.SectionHeader
import com.hylono.app.ui.components.StageRow
import com.hylono.app.ui.components.StatusBadge
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoPanel
import com.hylono.app.ui.theme.HylonoText
import com.hylono.app.ui.theme.HylonoTextMuted
import com.hylono.app.ui.util.formatEur

@Composable
fun RentalsScreen(repository: HylonoRepository) {
    val rentals = repository.rentals()
    val devices = repository.devices().filter { it.rentalFromEur != null }
    val steps = listOf(
        "Choose" to "Select a device and term length based on goals, budget, and home footprint.",
        "Receive" to "Hylono delivers, onboards, and starts the first guided protocol block.",
        "Decide" to "Return, extend, or move into a purchase path after the trial window."
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            GradientSpotlightCard(
                title = "Rental-first ownership",
                summary = "The mobile product gives rentals a dedicated operating surface instead of burying them behind marketing pages."
            ) {
                Text(
                    text = "Flexible monthly plans, setup guidance, and a visible next-action trail.",
                    style = MaterialTheme.typography.titleMedium,
                    color = HylonoGold
                )
            }
        }

        item {
            SectionHeader(
                title = "Active rental workspace",
                subtitle = "A native app can keep contracts, next steps, and upgrade timing in one place."
            )
        }

        items(rentals) { rental ->
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(30.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    StatusBadge(state = rental.state)
                    Text(
                        text = rental.deviceTitle,
                        style = MaterialTheme.typography.headlineMedium,
                        color = HylonoText
                    )
                    Text(
                        text = "${rental.termLabel} / ${formatEur(rental.monthlyPriceEur)} monthly / Deposit ${formatEur(rental.depositEur)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoGold
                    )
                    Text(
                        text = rental.nextAction,
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoTextMuted
                    )
                }
            }
        }

        item {
            SectionHeader(
                title = "How rental works",
                subtitle = "Lifted from the website flow, then simplified into a native decision path."
            )
        }

        itemsIndexed(steps) { index, step ->
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp)
            ) {
                StageRow(
                    index = index + 1,
                    title = step.first,
                    summary = step.second,
                    modifier = Modifier.padding(18.dp)
                )
            }
        }

        item {
            SectionHeader(
                title = "Rental-ready devices",
                subtitle = "These are the devices that already have live rental positioning in the website content."
            )
        }

        items(devices) { device ->
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = device.title,
                        style = MaterialTheme.typography.titleLarge,
                        color = HylonoText
                    )
                    Text(
                        text = "From ${formatEur(device.rentalFromEur ?: 0)} monthly",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoGold
                    )
                    Text(
                        text = device.summary,
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }
    }
}
