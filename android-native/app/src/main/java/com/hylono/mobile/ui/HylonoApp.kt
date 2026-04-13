package com.hylono.mobile.ui

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.ui.screens.BookingScreen
import com.hylono.mobile.ui.screens.CatalogScreen
import com.hylono.mobile.ui.screens.HomeScreen
import com.hylono.mobile.ui.screens.NexusScreen
import com.hylono.mobile.ui.screens.PartnersScreen
import com.hylono.mobile.ui.screens.ProductDetailScreen
import com.hylono.mobile.ui.screens.ProtocolDetailScreen
import com.hylono.mobile.ui.screens.ProtocolsScreen
import com.hylono.mobile.ui.screens.RentalScreen
import com.hylono.mobile.ui.screens.SupportScreen

private data class BottomDestination(
    val route: String,
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
)

private object Routes {
    const val Home = "home"
    const val Catalog = "catalog"
    const val Protocols = "protocols"
    const val Partners = "partners"
    const val Nexus = "nexus"
    const val Support = "support"
    const val Booking = "booking"
    const val Rental = "rental"
    const val ProductDetail = "product/{productId}"
    const val ProtocolDetail = "protocol/{protocolSlug}"

    fun product(productId: String): String = "product/$productId"
    fun protocol(protocolSlug: String): String = "protocol/$protocolSlug"
}

private val topLevelDestinations = listOf(
    BottomDestination(Routes.Home, "Care", Icons.Default.Home),
    BottomDestination(Routes.Catalog, "Catalog", Icons.Default.LocalHospital),
    BottomDestination(Routes.Protocols, "Protocols", Icons.AutoMirrored.Filled.MenuBook),
    BottomDestination(Routes.Partners, "Locator", Icons.Default.Place),
    BottomDestination(Routes.Nexus, "Nexus", Icons.Default.Shield),
)

@Composable
fun HylonoMobileApp(
    modifier: Modifier = Modifier,
    viewModel: HylonoViewModel = viewModel(factory = HylonoViewModel.Factory),
) {
    val navController = rememberNavController()
    val uiState = viewModel.uiState
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    val currentRoute = currentDestination?.route
    val showBottomBar = topLevelDestinations.any { it.route == currentRoute }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    topLevelDestinations.forEach { destination ->
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
                            icon = { Icon(destination.icon, contentDescription = destination.label) },
                            label = { Text(destination.label) },
                        )
                    }
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Routes.Home,
            modifier = Modifier.fillMaxSize(),
        ) {
            composable(Routes.Home) {
                HomeScreen(
                    data = uiState.data,
                    contentPadding = innerPadding,
                    onOpenCatalog = { navController.navigate(Routes.Catalog) },
                    onOpenProtocols = { navController.navigate(Routes.Protocols) },
                    onOpenBooking = { navController.navigate(Routes.Booking) },
                    onOpenRental = { navController.navigate(Routes.Rental) },
                    onOpenSupport = { navController.navigate(Routes.Support) },
                    onOpenNexus = { navController.navigate(Routes.Nexus) },
                    onOpenProduct = { navController.navigate(Routes.product(it)) },
                )
            }
            composable(Routes.Catalog) {
                CatalogScreen(
                    products = uiState.data.products,
                    contentPadding = innerPadding,
                    onOpenProduct = { navController.navigate(Routes.product(it)) },
                    onOpenRental = { navController.navigate(Routes.Rental) },
                )
            }
            composable(Routes.Protocols) {
                ProtocolsScreen(
                    protocols = uiState.data.protocols,
                    contentPadding = innerPadding,
                    onOpenProtocol = { navController.navigate(Routes.protocol(it)) },
                )
            }
            composable(Routes.Partners) {
                PartnersScreen(
                    partners = uiState.data.partners,
                    supportInfo = uiState.data.supportInfo,
                    contentPadding = innerPadding,
                    onOpenSupport = { navController.navigate(Routes.Support) },
                )
            }
            composable(Routes.Nexus) {
                NexusScreen(
                    clients = uiState.data.clients,
                    fleet = uiState.data.fleet,
                    supportInfo = uiState.data.supportInfo,
                    contentPadding = innerPadding,
                )
            }
            composable(Routes.Support) {
                SupportScreen(
                    supportInfo = uiState.data.supportInfo,
                    contactDraft = uiState.contactDraft,
                    newsletterDraft = uiState.newsletterDraft,
                    feedback = uiState.contactFeedback,
                    newsletterFeedback = uiState.newsletterFeedback,
                    contentPadding = innerPadding,
                    onBack = { navController.popBackStack() },
                    onContactDraftChange = viewModel::updateContactDraft,
                    onNewsletterDraftChange = viewModel::updateNewsletterDraft,
                    onClearContactDraft = viewModel::clearContactDraft,
                    onClearNewsletterDraft = viewModel::clearNewsletterDraft,
                    onDismissFeedback = viewModel::clearContactFeedback,
                    onDismissNewsletterFeedback = viewModel::clearNewsletterFeedback,
                    onSubmitContact = viewModel::submitContact,
                    onSubmitNewsletter = viewModel::submitNewsletter,
                )
            }
            composable(Routes.Booking) {
                BookingScreen(
                    products = uiState.data.products,
                    draft = uiState.bookingDraft,
                    feedback = uiState.bookingFeedback,
                    contentPadding = innerPadding,
                    onBack = { navController.popBackStack() },
                    onDraftChange = viewModel::updateBookingDraft,
                    onClearDraft = viewModel::clearBookingDraft,
                    onDismissFeedback = viewModel::clearBookingFeedback,
                    onSubmit = viewModel::submitBooking,
                )
            }
            composable(Routes.Rental) {
                RentalScreen(
                    products = uiState.data.products,
                    draft = uiState.rentalDraft,
                    feedback = uiState.rentalFeedback,
                    mobileSession = uiState.mobileSession,
                    rentalHistory = uiState.rentalHistory,
                    contentPadding = innerPadding,
                    onBack = { navController.popBackStack() },
                    onDraftChange = viewModel::updateRentalDraft,
                    onClearDraft = viewModel::clearRentalDraft,
                    onDismissFeedback = viewModel::clearRentalFeedback,
                    onDismissMobileSessionFeedback = viewModel::clearMobileSessionFeedback,
                    onDismissRentalHistoryFeedback = viewModel::clearRentalHistoryFeedback,
                    onSignIn = viewModel::signIn,
                    onSignOut = viewModel::signOut,
                    onRefreshRentalHistory = viewModel::refreshRentalHistory,
                    onSubmit = viewModel::submitRental,
                )
            }
            composable(Routes.ProductDetail) { backStackEntry ->
                val productId = backStackEntry.arguments?.getString("productId")
                ProductDetailScreen(
                    product = uiState.data.products.find { product -> product.id == productId },
                    protocols = uiState.data.protocols,
                    contentPadding = innerPadding,
                    onBack = { navController.popBackStack() },
                    onBook = { navController.navigate(Routes.Booking) },
                    onRent = { navController.navigate(Routes.Rental) },
                    onOpenProtocol = { protocolSlug ->
                        navController.navigate(Routes.protocol(protocolSlug))
                    },
                )
            }
            composable(Routes.ProtocolDetail) { backStackEntry ->
                val protocolSlug = backStackEntry.arguments?.getString("protocolSlug")
                ProtocolDetailScreen(
                    protocol = uiState.data.protocols.find { protocol -> protocol.slug == protocolSlug },
                    supportingProducts = productsForProtocol(
                        products = uiState.data.products,
                        protocolSlug = protocolSlug,
                    ),
                    contentPadding = innerPadding,
                    onBack = { navController.popBackStack() },
                    onBook = { navController.navigate(Routes.Booking) },
                    onOpenProduct = { navController.navigate(Routes.product(it)) },
                )
            }
        }
    }
}

private fun productsForProtocol(
    products: List<Product>,
    protocolSlug: String?,
): List<Product> = products.filter { product ->
    protocolSlug != null && protocolSlug in product.protocolIds
}
