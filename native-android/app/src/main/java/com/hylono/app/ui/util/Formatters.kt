package com.hylono.app.ui.util

import java.text.NumberFormat
import java.util.Locale

private val eurFormatter = NumberFormat.getIntegerInstance(Locale.US)

fun formatEur(amount: Int): String = "EUR ${eurFormatter.format(amount)}"
