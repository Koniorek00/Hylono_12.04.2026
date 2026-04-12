package com.hylono.mobile.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material.icons.filled.SupportAgent
import androidx.compose.material.icons.filled.TipsAndUpdates
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.AssistChip
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalUriHandler
import com.hylono.mobile.model.ExploreSection
import com.hylono.mobile.model.MemberDestination
import com.hylono.mobile.model.PartnerDestination
import com.hylono.mobile.model.Product
import com.hylono.mobile.model.Protocol
import com.hylono.mobile.model.Workspace

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HylonoApp(
    viewModel: HylonoViewModel,
) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = androidx.compose.runtime.remember { SnackbarHostState() }
    val snapshot = uiState.snapshot

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        contentWindowInsets = WindowInsets.safeDrawing,
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            TopAppBar(
                modifier = Modifier.statusBarsPadding(),
                title = {
                    Column {
                        Text(snapshot.brand.name, fontWeight = FontWeight.Black)
                        Text(
                            if (uiState.workspace == Workspace.MEMBER) "Member workspace" else "Partner workspace",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                },
                actions = {
                    AssistChip(
                        onClick = { viewModel.setWorkspace(Workspace.MEMBER) },
                        label = { Text("Member") },
                        leadingIcon = { Icon(Icons.Default.Home, contentDescription = null) },
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    AssistChip(
                        onClick = { viewModel.setWorkspace(Workspace.PARTNER) },
                        label = { Text("Partner") },
                        leadingIcon = { Icon(Icons.Default.WorkspacePremium, contentDescription = null) },
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                },
            )
        },
        bottomBar = {
            WorkspaceBottomBar(
                workspace = uiState.workspace,
                memberDestination = uiState.memberDestination,
                partnerDestination = uiState.partnerDestination,
                onMemberSelected = viewModel::setMemberDestination,
                onPartnerSelected = viewModel::setPartnerDestination,
            )
        },
    ) { innerPadding ->
        when (uiState.workspace) {
            Workspace.MEMBER -> MemberWorkspace(
                modifier = Modifier.padding(innerPadding),
                uiState = uiState,
                viewModel = viewModel,
                snackbarHostState = snackbarHostState,
            )
            Workspace.PARTNER -> PartnerWorkspace(
                modifier = Modifier.padding(innerPadding),
                uiState = uiState,
            )
        }
    }
}

@Composable
private fun WorkspaceBottomBar(
    workspace: Workspace,
    memberDestination: MemberDestination,
    partnerDestination: PartnerDestination,
    onMemberSelected: (MemberDestination) -> Unit,
    onPartnerSelected: (PartnerDestination) -> Unit,
) {
    val memberItems = listOf(
        Triple(MemberDestination.HOME, Icons.Default.Home, "Home"),
        Triple(MemberDestination.EXPLORE, Icons.Default.Inventory2, "Explore"),
        Triple(MemberDestination.REQUESTS, Icons.Default.Send, "Requests"),
        Triple(MemberDestination.SUPPORT, Icons.Default.SupportAgent, "Support"),
    )
    val partnerItems = listOf(
        Triple(PartnerDestination.OVERVIEW, Icons.Default.Home, "Overview"),
        Triple(PartnerDestination.CLIENTS, Icons.Default.MedicalServices, "Clients"),
        Triple(PartnerDestination.ACADEMY, Icons.Default.Book, "Academy"),
        Triple(PartnerDestination.SUPPLIES, Icons.Default.Storefront, "Supplies"),
    )

    NavigationBar(windowInsets = WindowInsets.navigationBars) {
        if (workspace == Workspace.MEMBER) {
            memberItems.forEach { (destination, icon, label) ->
                NavigationBarItem(
                    selected = memberDestination == destination,
                    onClick = { onMemberSelected(destination) },
                    icon = { Icon(icon, contentDescription = label) },
                    label = { Text(label) },
                )
            }
        } else {
            partnerItems.forEach { (destination, icon, label) ->
                NavigationBarItem(
                    selected = partnerDestination == destination,
                    onClick = { onPartnerSelected(destination) },
                    icon = { Icon(icon, contentDescription = label) },
                    label = { Text(label) },
                )
            }
        }
    }
}

@Composable
private fun MemberWorkspace(
    modifier: Modifier,
    uiState: HylonoUiState,
    viewModel: HylonoViewModel,
    snackbarHostState: SnackbarHostState,
) {
    when (uiState.memberDestination) {
        MemberDestination.HOME -> MemberHomeScreen(
            modifier = modifier.fillMaxSize(),
            uiState = uiState,
            onExploreRequested = {
                viewModel.setMemberDestination(MemberDestination.EXPLORE)
                viewModel.setExploreSection(ExploreSection.PRODUCTS)
            },
            onRequestsRequested = { viewModel.setMemberDestination(MemberDestination.REQUESTS) },
        )

        MemberDestination.EXPLORE -> ExploreScreen(
            modifier = modifier.fillMaxSize(),
            uiState = uiState,
            onSectionSelected = viewModel::setExploreSection,
            onProductSelected = viewModel::openProduct,
            onProtocolSelected = viewModel::openProtocol,
            onCloseProduct = viewModel::closeProduct,
            onCloseProtocol = viewModel::closeProtocol,
            onToggleFavourite = viewModel::toggleFavourite,
        )

        MemberDestination.REQUESTS -> RequestCenterScreen(
            modifier = modifier.fillMaxSize(),
            uiState = uiState,
            repository = viewModel.repository,
            snackbarHostState = snackbarHostState,
        )

        MemberDestination.SUPPORT -> SupportScreen(
            modifier = modifier.fillMaxSize(),
            uiState = uiState,
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun MemberHomeScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
    onExploreRequested: () -> Unit,
    onRequestsRequested: () -> Unit,
) {
    val snapshot = uiState.snapshot
    val featuredProduct = snapshot.products.first()
    val highlightedProtocol = snapshot.protocols.last()

    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            HeroPanel(
                title = "Guided access to Hylono products, rentals, and clinic-ready support.",
                body = snapshot.brand.tagline,
                primaryAction = "Browse products",
                secondaryAction = "Start a request",
                onPrimaryAction = onExploreRequested,
                onSecondaryAction = onRequestsRequested,
            )
        }
        item {
            FlowRow(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                SummaryStatCard("Products", snapshot.products.size.toString(), "Rental-first catalog")
                SummaryStatCard("Protocols", snapshot.protocols.size.toString(), "Structured weekly plans")
                SummaryStatCard("Partners", snapshot.partners.size.toString(), "Current EU listings")
                SummaryStatCard("Research", snapshot.researchStudies.size.toString(), "Evidence snapshots")
            }
        }
        item {
            SectionLabel("Featured pathway")
            HighlightCard(
                icon = Icons.Default.Inventory2,
                overline = featuredProduct.modality,
                title = featuredProduct.title,
                body = featuredProduct.summary,
                footer = "Rental from EUR ${featuredProduct.rentalFromEur} / month",
            )
        }
        item {
            HighlightCard(
                icon = Icons.Default.TipsAndUpdates,
                overline = highlightedProtocol.goal,
                title = highlightedProtocol.title,
                body = highlightedProtocol.summary,
                footer = "${highlightedProtocol.durationWeeks} weeks - ${highlightedProtocol.timePerDay}",
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ExploreScreen(
    modifier: Modifier,
    uiState: HylonoUiState,
    onSectionSelected: (ExploreSection) -> Unit,
    onProductSelected: (String) -> Unit,
    onProtocolSelected: (String) -> Unit,
    onCloseProduct: () -> Unit,
    onCloseProtocol: () -> Unit,
    onToggleFavourite: (String) -> Unit,
) {
    val snapshot = uiState.snapshot
    val selectedProduct = snapshot.products.firstOrNull { it.id == uiState.selectedProductId }
    val selectedProtocol = snapshot.protocols.firstOrNull { it.id == uiState.selectedProtocolId }

    when {
        selectedProduct != null -> ProductDetailScreen(
            modifier = modifier,
            product = selectedProduct,
            linkedProtocols = snapshot.protocols.filter { selectedProduct.protocolIds.contains(it.id) },
            isFavourite = uiState.favourites.contains(selectedProduct.id),
            onBack = onCloseProduct,
            onToggleFavourite = { onToggleFavourite(selectedProduct.id) },
        )

        selectedProtocol != null -> ProtocolDetailScreen(
            modifier = modifier,
            protocol = selectedProtocol,
            onBack = onCloseProtocol,
        )

        else -> LazyColumn(
            modifier = modifier,
            contentPadding = PaddingValues(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            item {
                SectionLabel("Explore")
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    ExploreSection.entries.forEach { section ->
                        FilterChip(
                            selected = uiState.exploreSection == section,
                            onClick = { onSectionSelected(section) },
                            label = { Text(section.name.lowercase().replaceFirstChar(Char::uppercase)) },
                        )
                    }
                }
            }

            when (uiState.exploreSection) {
                ExploreSection.PRODUCTS -> items(snapshot.products, key = Product::id) { product ->
                    ExploreCard(
                        icon = Icons.Default.Inventory2,
                        overline = product.modality,
                        title = product.title,
                        body = product.summary,
                        footer = "Buy EUR ${product.purchasePriceEur} - Rent from EUR ${product.rentalFromEur}",
                        actionLabel = "Open product",
                        accent = if (uiState.favourites.contains(product.id)) "Saved" else "Native detail",
                        onClick = { onProductSelected(product.id) },
                    )
                }

                ExploreSection.PROTOCOLS -> items(snapshot.protocols, key = Protocol::id) { protocol ->
                    ExploreCard(
                        icon = Icons.Default.TipsAndUpdates,
                        overline = protocol.goal,
                        title = protocol.title,
                        body = protocol.summary,
                        footer = "${protocol.durationWeeks} weeks - ${protocol.timePerDay}",
                        actionLabel = "Open protocol",
                        accent = protocol.difficulty,
                        onClick = { onProtocolSelected(protocol.id) },
                    )
                }

                ExploreSection.RESEARCH -> items(snapshot.researchStudies, key = { it.id }) { study ->
                    val uriHandler = LocalUriHandler.current
                    ExploreCard(
                        icon = Icons.Default.Verified,
                        overline = "${study.modality} - ${study.studyType}",
                        title = study.title,
                        body = study.summary,
                        footer = "Published ${study.year}",
                        actionLabel = "Open source",
                        accent = "Peer reviewed",
                        onClick = { uriHandler.openUri(study.url) },
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductDetailScreen(
    modifier: Modifier,
    product: Product,
    linkedProtocols: List<Protocol>,
    isFavourite: Boolean,
    onBack: () -> Unit,
    onToggleFavourite: () -> Unit,
) {
    Column(
        modifier = modifier
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        BackHeader(product.title, onBack)
        HeroPanel(
            title = product.title,
            body = product.summary,
            primaryAction = if (isFavourite) "Saved" else "Save shortlist",
            secondaryAction = "Pricing",
            onPrimaryAction = onToggleFavourite,
            onSecondaryAction = {},
        )
        ElevatedCard {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Commercial path", style = MaterialTheme.typography.titleLarge)
                Text("Purchase price: EUR ${product.purchasePriceEur}")
                Text("Rental from: EUR ${product.rentalFromEur} / month")
                product.financingFromEur?.let { Text("Financing from: EUR $it / month") }
            }
        }
        ElevatedCard {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Highlights", style = MaterialTheme.typography.titleLarge)
                product.highlights.forEach(::FeatureLine)
            }
        }
        ElevatedCard {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Linked protocols", style = MaterialTheme.typography.titleLarge)
                linkedProtocols.forEach { protocol -> Text("- ${protocol.title} - ${protocol.durationWeeks} weeks") }
            }
        }
    }
}

@Composable
private fun ProtocolDetailScreen(
    modifier: Modifier,
    protocol: Protocol,
    onBack: () -> Unit,
) {
    Column(
        modifier = modifier
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        BackHeader(protocol.title, onBack)
        ElevatedCard {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(protocol.goal.uppercase(), color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Text(protocol.summary, style = MaterialTheme.typography.bodyLarge)
                Text("${protocol.durationWeeks} weeks - ${protocol.timePerDay} - ${protocol.difficulty}")
            }
        }
        ElevatedCard {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Required devices", style = MaterialTheme.typography.titleLarge)
                protocol.requiredDevices.forEach(::FeatureLine)
            }
        }
        ElevatedCard {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Contraindications", style = MaterialTheme.typography.titleLarge)
                protocol.contraindications.forEach(::FeatureLine)
            }
        }
    }
}

@Composable
internal fun HeroPanel(
    title: String,
    body: String,
    primaryAction: String,
    secondaryAction: String,
    onPrimaryAction: () -> Unit,
    onSecondaryAction: () -> Unit,
) {
    Surface(shape = RoundedCornerShape(28.dp), color = Color.Transparent) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(28.dp))
                .background(Brush.linearGradient(listOf(Color(0xFF0B172A), Color(0xFF0D6D91), Color(0xFF1CA79B))))
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(title, style = MaterialTheme.typography.displayMedium.copy(color = Color.White))
            Text(body, style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFFE8F7FF)))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(onClick = onPrimaryAction, border = BorderStroke(1.dp, Color.White.copy(alpha = 0.4f))) {
                    Text(primaryAction, color = Color.White)
                }
                FilledTonalButton(onClick = onSecondaryAction) { Text(secondaryAction) }
            }
        }
    }
}

@Composable
internal fun ExploreCard(
    icon: ImageVector,
    overline: String,
    title: String,
    body: String,
    footer: String,
    actionLabel: String,
    accent: String,
    onClick: () -> Unit,
) {
    ElevatedCard(onClick = onClick, colors = CardDefaults.elevatedCardColors()) {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier.size(44.dp).clip(CircleShape).background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                }
                Column {
                    Text(overline.uppercase(), fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                    Text(title, style = MaterialTheme.typography.titleLarge)
                }
            }
            Text(body, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Divider()
            Text(footer, fontWeight = FontWeight.SemiBold)
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text(accent, color = MaterialTheme.colorScheme.tertiary, fontWeight = FontWeight.Bold)
                TextButton(onClick = onClick) { Text(actionLabel) }
            }
        }
    }
}

@Composable
internal fun HighlightCard(
    icon: ImageVector,
    overline: String,
    title: String,
    body: String,
    footer: String,
) {
    OutlinedCard(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)) {
        Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Text(overline.uppercase(), fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Text(title, style = MaterialTheme.typography.headlineMedium)
            Text(body, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(footer, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
internal fun SummaryStatCard(label: String, value: String, detail: String) {
    ElevatedCard(modifier = Modifier.width(160.dp)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(label.uppercase(), fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
            Text(value, style = MaterialTheme.typography.headlineMedium)
            Text(detail, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
internal fun SectionLabel(text: String) {
    Text(text = text, style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.onSurface)
}

@Composable
internal fun FeatureLine(text: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
        Text("-", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Black)
        Text(text, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
internal fun BackHeader(title: String, onBack: () -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = onBack) {
            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
        }
        Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
    }
}
