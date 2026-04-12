package com.hylono.app.feature.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
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
import com.hylono.app.domain.operations.HylonoOperationsGateway
import com.hylono.app.domain.repository.HylonoRepository
import com.hylono.app.ui.components.GradientSpotlightCard
import com.hylono.app.ui.components.MetricCard
import com.hylono.app.ui.components.OutlinePill
import com.hylono.app.ui.components.SectionHeader
import com.hylono.app.ui.components.StatusBadge
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoGoldSoft
import com.hylono.app.ui.theme.HylonoPanel
import com.hylono.app.ui.theme.HylonoText
import com.hylono.app.ui.theme.HylonoTextMuted
import com.hylono.app.ui.util.formatEur

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun HomeScreen(
    repository: HylonoRepository,
    operationsGateway: HylonoOperationsGateway
) {
    val overview = repository.homeOverview()
    val goals = repository.goals()
    val account = repository.accountSnapshot()
    var selectedGoalTitle by rememberSaveable { mutableStateOf(goals.first().title) }
    val selectedGoal = goals.first { it.title == selectedGoalTitle }
    val unusedGateway = operationsGateway

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        item {
            GradientSpotlightCard(
                title = "Hylono / Android",
                summary = overview.welcomeSummary
            ) {
                Text(
                    text = overview.welcomeTitle,
                    style = MaterialTheme.typography.titleLarge,
                    color = HylonoGoldSoft
                )
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinePill(text = overview.nextSessionWindow)
                    OutlinePill(text = overview.supportWindow)
                    OutlinePill(text = "Protocol completion ${overview.completionRate}%")
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    value = "${account.adherencePercent}%",
                    label = "Adherence",
                    supporting = "Current weekly protocol completion",
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    value = account.activeStackTitle,
                    label = "Active stack",
                    supporting = account.nextMilestone,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            SectionHeader(
                title = "Choose a goal",
                subtitle = "The app shifts from public route browsing to native stack planning."
            )
        }

        item {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                goals.forEach { goal ->
                    FilterChip(
                        selected = goal.title == selectedGoalTitle,
                        onClick = { selectedGoalTitle = goal.title },
                        label = { Text(goal.title) },
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

        item {
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text(
                        text = selectedGoal.subtitle,
                        style = MaterialTheme.typography.titleLarge,
                        color = HylonoText
                    )
                    Text(
                        text = selectedGoal.description,
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoTextMuted
                    )
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        selectedGoal.keyModalities.forEach { modality ->
                            OutlinePill(text = modality)
                        }
                    }
                    Text(
                        text = selectedGoal.recommendation.title,
                        style = MaterialTheme.typography.titleMedium,
                        color = HylonoGold
                    )
                    Text(
                        text = selectedGoal.recommendation.devices.joinToString(" + "),
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoText
                    )
                    Text(
                        text = "Rental from ${formatEur(selectedGoal.recommendation.rentalFromEur)} | Purchase from ${formatEur(selectedGoal.recommendation.purchaseFromEur)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }

        item {
            SectionHeader(
                title = "Operational snapshot",
                subtitle = "The native app keeps ownership, rental, and support in one place."
            )
        }

        item {
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
            ) {
                androidx.compose.foundation.layout.Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = overview.nextSessionTitle,
                        style = MaterialTheme.typography.titleLarge,
                        color = HylonoText
                    )
                    Text(
                        text = overview.nextSessionWindow,
                        style = MaterialTheme.typography.bodyLarge,
                        color = HylonoGold
                    )
                    StatusBadge(state = overview.activeRental.state)
                    Text(
                        text = "${overview.activeRental.deviceTitle} / ${overview.activeRental.termLabel}",
                        style = MaterialTheme.typography.titleMedium,
                        color = HylonoText
                    )
                    Text(
                        text = overview.activeRental.nextAction,
                        style = MaterialTheme.typography.bodyMedium,
                        color = HylonoTextMuted
                    )
                }
            }
        }

        item {
            SectionHeader(
                title = "Open account tasks",
                subtitle = account.label
            )
        }

        items(account.openItems) { item ->
            Surface(
                color = HylonoPanel,
                shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp)
            ) {
                Text(
                    text = item,
                    modifier = Modifier.padding(18.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = HylonoText
                )
            }
        }
    }
}
