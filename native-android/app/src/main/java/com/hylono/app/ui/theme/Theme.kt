package com.hylono.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val HylonoDarkScheme = darkColorScheme(
    primary = HylonoGold,
    onPrimary = HylonoInk,
    secondary = HylonoBlue,
    onSecondary = HylonoInk,
    background = HylonoInk,
    onBackground = HylonoText,
    surface = HylonoSurface,
    onSurface = HylonoText,
    surfaceVariant = HylonoPanel,
    onSurfaceVariant = HylonoTextMuted
)

@Composable
fun HylonoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = HylonoDarkScheme,
        typography = HylonoTypography,
        content = content
    )
}
