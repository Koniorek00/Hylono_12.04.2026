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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.mobile.data.model.Protocol
import com.hylono.mobile.ui.components.SectionHeader

@Composable
fun ProtocolsScreen(
    protocols: List<Protocol>,
    contentPadding: PaddingValues,
    onOpenProtocol: (String) -> Unit,
) {
    val goals = listOf("All") + protocols.map { it.goal }.distinct()
    var selectedGoal by rememberSaveable { mutableStateOf("All") }
    val visibleProtocols = if (selectedGoal == "All") protocols else protocols.filter { it.goal == selectedGoal }

    LazyColumn(
        modifier = Modifier.padding(contentPadding),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        item {
            SectionHeader(
                title = "Protocol library",
                subtitle = "Make protocol adherence a first-class mobile flow instead of an afterthought after device purchase.",
            )
        }
        item {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                goals.forEach { goal ->
                    FilterChip(
                        selected = selectedGoal == goal,
                        onClick = { selectedGoal = goal },
                        label = { Text(goal) },
                    )
                }
            }
        }
        items(visibleProtocols, key = { it.slug }) { protocol ->
            Card(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = protocol.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(text = protocol.shortDescription, style = MaterialTheme.typography.bodyLarge)
                    Text(
                        text = "${protocol.goal} • ${protocol.difficulty} • ${protocol.durationWeeks} weeks • ${protocol.timePerDay}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Text(
                        text = "Reviewer: ${protocol.reviewer}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Button(
                        onClick = { onOpenProtocol(protocol.slug) },
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text("Open program")
                    }
                }
            }
        }
    }
}
