package com.hylono.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.SupportAgent
import androidx.compose.material.icons.filled.Widgets
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.outlined.MenuBook
import androidx.compose.material.icons.outlined.SupportAgent
import androidx.compose.material.icons.outlined.Widgets
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.hylono.app.data.operations.SeedOperationsGateway
import com.hylono.app.data.repository.InMemoryHylonoRepository
import com.hylono.app.feature.devices.DevicesScreen
import com.hylono.app.feature.home.HomeScreen
import com.hylono.app.feature.protocols.ProtocolsScreen
import com.hylono.app.feature.rentals.RentalsScreen
import com.hylono.app.feature.support.SupportScreen
import com.hylono.app.ui.theme.HylonoBlue
import com.hylono.app.ui.theme.HylonoGold
import com.hylono.app.ui.theme.HylonoInk

private data class TopLevelDestination(
    val route: String,
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
)

@Composable
fun HylonoApp() {
    val repository = remember { InMemoryHylonoRepository() }
    val operationsGateway = remember { SeedOperationsGateway() }
    val navController = rememberNavController()
    val destinations = remember {
        listOf(
            TopLevelDestination("today", "Today", Icons.Filled.Home, Icons.Outlined.Home),
            TopLevelDestination("devices", "Devices", Icons.Filled.Widgets, Icons.Outlined.Widgets),
            TopLevelDestination("protocols", "Protocols", Icons.Filled.MenuBook, Icons.Outlined.MenuBook),
            TopLevelDestination("rentals", "Rentals", Icons.Filled.Inventory2, Icons.Outlined.Inventory2),
            TopLevelDestination("support", "Support", Icons.Filled.SupportAgent, Icons.Outlined.SupportAgent)
        )
    }
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = backStackEntry?.destination

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = Color.Transparent,
        bottomBar = {
            NavigationBar(
                containerColor = HylonoInk.copy(alpha = 0.96f),
                tonalElevation = 0.dp
            ) {
                destinations.forEach { destination ->
                    val selected = currentDestination?.hierarchy?.any { it.route == destination.route } == true
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(destination.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = if (selected) destination.selectedIcon else destination.unselectedIcon,
                                contentDescription = destination.label
                            )
                        },
                        label = { Text(destination.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = HylonoInk,
                            selectedTextColor = HylonoGold,
                            indicatorColor = HylonoGold,
                            unselectedIconColor = Color.White.copy(alpha = 0.70f),
                            unselectedTextColor = Color.White.copy(alpha = 0.70f)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            HylonoInk,
                            HylonoInk,
                            HylonoBlue.copy(alpha = 0.48f),
                            HylonoInk
                        )
                    )
                )
                .padding(innerPadding)
        ) {
            NavHost(
                navController = navController,
                startDestination = "today",
                modifier = Modifier.fillMaxSize()
            ) {
                composable("today") {
                    HomeScreen(
                        repository = repository,
                        operationsGateway = operationsGateway
                    )
                }
                composable("devices") {
                    DevicesScreen(repository = repository)
                }
                composable("protocols") {
                    ProtocolsScreen(repository = repository)
                }
                composable("rentals") {
                    RentalsScreen(repository = repository)
                }
                composable("support") {
                    SupportScreen(
                        repository = repository,
                        operationsGateway = operationsGateway
                    )
                }
            }
        }
    }
}
