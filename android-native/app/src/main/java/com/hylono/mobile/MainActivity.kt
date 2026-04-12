package com.hylono.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.hylono.mobile.ui.HylonoMobileApp
import com.hylono.mobile.ui.theme.HylonoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            HylonoTheme {
                HylonoMobileApp()
            }
        }
    }
}
