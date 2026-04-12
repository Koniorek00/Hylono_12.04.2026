package com.hylono.mobile.ui

import androidx.lifecycle.ViewModel
import com.hylono.mobile.data.HylonoRepository
import com.hylono.mobile.model.ExploreSection
import com.hylono.mobile.model.HylonoSnapshot
import com.hylono.mobile.model.MemberDestination
import com.hylono.mobile.model.PartnerDestination
import com.hylono.mobile.model.Workspace
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class HylonoUiState(
    val snapshot: HylonoSnapshot,
    val workspace: Workspace = Workspace.MEMBER,
    val memberDestination: MemberDestination = MemberDestination.HOME,
    val partnerDestination: PartnerDestination = PartnerDestination.OVERVIEW,
    val exploreSection: ExploreSection = ExploreSection.PRODUCTS,
    val selectedProductId: String? = null,
    val selectedProtocolId: String? = null,
    val favourites: Set<String> = emptySet(),
)

class HylonoViewModel(
    val repository: HylonoRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(HylonoUiState(snapshot = repository.snapshot()))
    val uiState: StateFlow<HylonoUiState> = _uiState.asStateFlow()

    fun setWorkspace(workspace: Workspace) {
        _uiState.update { current -> current.copy(workspace = workspace) }
    }

    fun setMemberDestination(destination: MemberDestination) {
        _uiState.update { current ->
            current.copy(
                memberDestination = destination,
                selectedProductId = null,
                selectedProtocolId = null,
            )
        }
    }

    fun setPartnerDestination(destination: PartnerDestination) {
        _uiState.update { current -> current.copy(partnerDestination = destination) }
    }

    fun setExploreSection(section: ExploreSection) {
        _uiState.update { current ->
            current.copy(
                exploreSection = section,
                selectedProductId = null,
                selectedProtocolId = null,
            )
        }
    }

    fun openProduct(productId: String) {
        _uiState.update { current -> current.copy(selectedProductId = productId) }
    }

    fun closeProduct() {
        _uiState.update { current -> current.copy(selectedProductId = null) }
    }

    fun openProtocol(protocolId: String) {
        _uiState.update { current -> current.copy(selectedProtocolId = protocolId) }
    }

    fun closeProtocol() {
        _uiState.update { current -> current.copy(selectedProtocolId = null) }
    }

    fun toggleFavourite(productId: String) {
        _uiState.update { current ->
            val updated = current.favourites.toMutableSet()
            if (!updated.add(productId)) {
                updated.remove(productId)
            }
            current.copy(favourites = updated)
        }
    }
}
