package com.hylono.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.activity.compose.setContent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import com.hylono.mobile.data.HylonoRepository
import com.hylono.mobile.ui.HylonoApp
import com.hylono.mobile.ui.HylonoViewModel
import com.hylono.mobile.ui.theme.HylonoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val repository = HylonoRepository(BuildConfig.HYLONO_API_BASE_URL)

        setContent {
            HylonoTheme {
                val appViewModel = viewModel<HylonoViewModel>(
                    factory = HylonoViewModelFactory(repository),
                )
                HylonoApp(viewModel = appViewModel)
            }
        }
    }
}

private class HylonoViewModelFactory(
    private val repository: HylonoRepository,
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HylonoViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return HylonoViewModel(repository) as T
        }
        error("Unknown ViewModel class: ${modelClass.name}")
    }
}
