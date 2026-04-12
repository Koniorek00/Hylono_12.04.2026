package com.hylono.app.domain.repository

import com.hylono.app.domain.model.AccountSnapshot
import com.hylono.app.domain.model.DeviceSummary
import com.hylono.app.domain.model.GoalPath
import com.hylono.app.domain.model.HomeOverview
import com.hylono.app.domain.model.ProtocolPlan
import com.hylono.app.domain.model.RentalCase
import com.hylono.app.domain.model.SupportChannel

interface HylonoRepository {
    fun homeOverview(): HomeOverview
    fun goals(): List<GoalPath>
    fun devices(): List<DeviceSummary>
    fun protocols(): List<ProtocolPlan>
    fun rentals(): List<RentalCase>
    fun supportChannels(): List<SupportChannel>
    fun accountSnapshot(): AccountSnapshot
}
