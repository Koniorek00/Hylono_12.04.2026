package com.hylono.mobile.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = CarbonBlue,
    onPrimary = Mist,
    primaryContainer = OxygenBlue,
    onPrimaryContainer = CarbonBlue,
    secondary = SignalMint,
    onSecondary = CarbonBlue,
    secondaryContainer = Mist,
    onSecondaryContainer = Ink,
    tertiary = Ember,
    onTertiary = CarbonBlue,
    background = Sand,
    onBackground = Ink,
    surface = Color.White,
    onSurface = Ink,
    surfaceVariant = Mist,
    onSurfaceVariant = Slate,
    outline = Color(0xFFBBC8D0),
)

private val DarkColorScheme = darkColorScheme(
    primary = OxygenBlue,
    onPrimary = Night,
    primaryContainer = Ocean,
    onPrimaryContainer = Mist,
    secondary = SignalMint,
    onSecondary = Night,
    secondaryContainer = Color(0xFF103235),
    onSecondaryContainer = Mist,
    tertiary = Ember,
    onTertiary = Night,
    background = Night,
    onBackground = Mist,
    surface = CarbonBlue,
    onSurface = Mist,
    surfaceVariant = Ocean,
    onSurfaceVariant = Color(0xFFC5D3DB),
    outline = Color(0xFF46535F),
)

@Composable
fun HylonoTheme(
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) DarkColorScheme else LightColorScheme,
        typography = HylonoTypography,
        content = content,
    )
}
