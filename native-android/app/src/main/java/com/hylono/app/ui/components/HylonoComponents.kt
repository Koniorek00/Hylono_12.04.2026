package com.hylono.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hylono.app.domain.model.RentalState
import com.hylono.app.ui.theme.HylonoBlue
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoInk
import com.hylono.app.ui.theme.HylonoPanel
import com.hylono.app.ui.theme.HylonoPanelRaised
import com.hylono.app.ui.theme.HylonoSuccess
import com.hylono.app.ui.theme.HylonoText
import com.hylono.app.ui.theme.HylonoTextMuted
import com.hylono.app.ui.theme.HylonoWarning

@Composable
fun SectionHeader(
    title: String,
    subtitle: String? = null,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
            color = HylonoText
        )
        subtitle?.let {
            Text(
                text = it,
                style = MaterialTheme.typography.bodyMedium,
                color = HylonoTextMuted
            )
        }
    }
}

@Composable
fun MetricCard(
    value: String,
    label: String,
    supporting: String,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        color = HylonoPanel,
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                color = HylonoGold
            )
            Text(
                text = label,
                style = MaterialTheme.typography.titleMedium,
                color = HylonoText
            )
            Text(
                text = supporting,
                style = MaterialTheme.typography.bodySmall,
                color = HylonoTextMuted
            )
        }
    }
}

@Composable
fun GradientSpotlightCard(
    title: String,
    summary: String,
    modifier: Modifier = Modifier,
    content: @Composable Column.() -> Unit = {}
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(32.dp))
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        HylonoPanelRaised,
                        HylonoInk,
                        HylonoBlue.copy(alpha = 0.22f)
                    )
                )
            )
            .border(
                width = 1.dp,
                color = HylonoGold.copy(alpha = 0.20f),
                shape = RoundedCornerShape(32.dp)
            )
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.displayLarge,
            color = HylonoText
        )
        Text(
            text = summary,
            style = MaterialTheme.typography.bodyLarge,
            color = HylonoTextMuted
        )
        content()
    }
}

@Composable
fun StatusBadge(
    state: RentalState,
    modifier: Modifier = Modifier
) {
    val (background, foreground, label) = when (state) {
        RentalState.PENDING_REVIEW -> Triple(HylonoBlue.copy(alpha = 0.16f), HylonoBlue, "Pending review")
        RentalState.AWAITING_CONTRACT -> Triple(HylonoWarning.copy(alpha = 0.16f), HylonoWarning, "Awaiting contract")
        RentalState.ACTIVE -> Triple(HylonoSuccess.copy(alpha = 0.16f), HylonoSuccess, "Active")
        RentalState.RETURN_WINDOW -> Triple(HylonoGold.copy(alpha = 0.16f), HylonoGold, "Return window")
    }

    Text(
        text = label,
        modifier = modifier
            .clip(RoundedCornerShape(999.dp))
            .background(background)
            .padding(horizontal = 12.dp, vertical = 8.dp),
        style = MaterialTheme.typography.labelMedium,
        color = foreground
    )
}

@Composable
fun OutlinePill(
    text: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = text,
        modifier = modifier
            .clip(RoundedCornerShape(999.dp))
            .border(1.dp, Color.White.copy(alpha = 0.16f), RoundedCornerShape(999.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp),
        style = MaterialTheme.typography.labelMedium,
        color = HylonoTextMuted
    )
}

@Composable
fun StageRow(
    index: Int,
    title: String,
    summary: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text(
            text = index.toString().padStart(2, '0'),
            style = MaterialTheme.typography.titleLarge,
            color = HylonoGold,
            fontWeight = FontWeight.Bold
        )
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = HylonoText
            )
            Text(
                text = summary,
                style = MaterialTheme.typography.bodyMedium,
                color = HylonoTextMuted
            )
        }
    }
}
