package com.hylono.mobile.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

private val LightColors = lightColorScheme(
    primary = Color(0xFF0D6D91),
    onPrimary = Color.White,
    secondary = Color(0xFF1D9C8E),
    onSecondary = Color.White,
    tertiary = Color(0xFFBF7A1D),
    background = Color(0xFFF6F4EE),
    surface = Color(0xFFFFFCF6),
    onSurface = Color(0xFF111827),
    surfaceVariant = Color(0xFFE6EEF2),
    outline = Color(0xFF94A3B8),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF65D2FF),
    onPrimary = Color(0xFF04243A),
    secondary = Color(0xFF7BE7D9),
    onSecondary = Color(0xFF072A27),
    tertiary = Color(0xFFFFC46A),
    background = Color(0xFF08111D),
    surface = Color(0xFF0C1726),
    onSurface = Color(0xFFF8FAFC),
    surfaceVariant = Color(0xFF12304A),
    outline = Color(0xFF6B829A),
)

private val HylonoTypography = androidx.compose.material3.Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Black,
        fontSize = 40.sp,
        lineHeight = 44.sp,
    ),
    displayMedium = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 36.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    ),
)

@Composable
fun HylonoTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography = HylonoTypography,
        content = content,
    )
}

