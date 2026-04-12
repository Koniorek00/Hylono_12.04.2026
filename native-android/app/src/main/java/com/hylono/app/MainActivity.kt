package com.hylono.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.enableEdgeToEdge
import androidx.activity.compose.setContent
import com.hylono.app.ui.theme.HylonoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            HylonoTheme {
                HylonoApp()
            }
        }
    }
}
