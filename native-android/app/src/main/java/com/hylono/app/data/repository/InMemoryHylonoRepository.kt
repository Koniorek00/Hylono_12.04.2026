package com.hylono.app.data.repository

import com.hylono.app.data.seed.HylonoSeedData
import com.hylono.app.domain.model.AccountSnapshot
import com.hylono.app.domain.model.DeviceSummary
import com.hylono.app.domain.model.GoalPath
import com.hylono.app.domain.model.HomeOverview
import com.hylono.app.domain.model.ProtocolPlan
import com.hylono.app.domain.model.RentalCase
import com.hylono.app.domain.model.SupportChannel
import com.hylono.app.domain.repository.HylonoRepository

class InMemoryHylonoRepository : HylonoRepository {
    override fun homeOverview(): HomeOverview = HylonoSeedData.homeOverview

    override fun goals(): List<GoalPath> = HylonoSeedData.goals

    override fun devices(): List<DeviceSummary> = HylonoSeedData.devices

    override fun protocols(): List<ProtocolPlan> = HylonoSeedData.protocols

    override fun rentals(): List<RentalCase> = HylonoSeedData.rentals

    override fun supportChannels(): List<SupportChannel> = HylonoSeedData.supportChannels

    override fun accountSnapshot(): AccountSnapshot = HylonoSeedData.account
}
