package com.hylono.mobile.data.model

data class MobileAuthSession(
    val accessToken: String,
    val accessTokenExpiresAtEpochSeconds: Long,
    val refreshToken: String,
    val refreshTokenExpiresAtEpochSeconds: Long,
    val scopes: List<String> = emptyList(),
    val userEmail: String,
    val userName: String,
) {
    fun requiresRefresh(
        nowEpochSeconds: Long = System.currentTimeMillis() / 1000,
        bufferSeconds: Long = 60,
    ): Boolean = accessTokenExpiresAtEpochSeconds <= nowEpochSeconds + bufferSeconds

    fun isRefreshExpired(
        nowEpochSeconds: Long = System.currentTimeMillis() / 1000,
    ): Boolean = refreshTokenExpiresAtEpochSeconds <= nowEpochSeconds
}

data class RentalHistoryContact(
    val fullName: String,
    val email: String,
    val city: String,
    val country: String,
)

data class RentalHistoryLineItem(
    val techId: String,
    val quantity: Int,
    val monthlyPrice: Double,
)

data class RentalHistoryRecord(
    val id: String,
    val status: String,
    val totalMonthly: Double,
    val termMonths: Int,
    val createdAt: String,
    val items: List<RentalHistoryLineItem>,
    val contact: RentalHistoryContact? = null,
)

sealed interface MobileAuthResult {
    data class Success(
        val session: MobileAuthSession,
        val message: String,
    ) : MobileAuthResult

    data class Error(
        val message: String,
        val details: List<String> = emptyList(),
        val retryAfterSeconds: Int? = null,
    ) : MobileAuthResult
}

sealed interface RentalHistoryResult {
    data class Success(
        val rentals: List<RentalHistoryRecord>,
        val message: String,
    ) : RentalHistoryResult

    data class Error(
        val message: String,
        val details: List<String> = emptyList(),
        val retryAfterSeconds: Int? = null,
    ) : RentalHistoryResult
}
