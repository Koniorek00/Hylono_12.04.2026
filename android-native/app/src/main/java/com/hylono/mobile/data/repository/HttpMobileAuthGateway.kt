package com.hylono.mobile.data.repository

import com.hylono.mobile.data.model.MobileAuthResult
import com.hylono.mobile.data.model.MobileAuthSession
import com.hylono.mobile.data.model.RentalHistoryContact
import com.hylono.mobile.data.model.RentalHistoryLineItem
import com.hylono.mobile.data.model.RentalHistoryRecord
import com.hylono.mobile.data.model.RentalHistoryResult
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class HttpMobileAuthGateway(
    private val apiBaseUrl: String,
) {
    suspend fun signIn(
        email: String,
        password: String,
    ): MobileAuthResult = withContext(Dispatchers.IO) {
        postJson(
            path = "/api/mobile/auth",
            payload = JSONObject()
                .put("email", email.trim())
                .put("password", password),
            fallbackMessage = "The server did not return a usable mobile session.",
        )
    }

    suspend fun refreshSession(
        refreshToken: String,
    ): MobileAuthResult = withContext(Dispatchers.IO) {
        postJson(
            path = "/api/mobile/auth/refresh",
            payload = JSONObject()
                .put("refreshToken", refreshToken.trim()),
            fallbackMessage = "The server did not return a refreshed mobile session.",
        )
    }

    suspend fun loadRentalHistory(
        accessToken: String,
    ): RentalHistoryResult = withContext(Dispatchers.IO) {
        val connection = createConnection("/api/rental").apply {
            requestMethod = "GET"
            doInput = true
            setRequestProperty("Authorization", "Bearer ${accessToken.trim()}")
        }

        try {
            val statusCode = connection.responseCode
            val isSuccessCode = statusCode in 200..299
            val responseBody = readResponseBody(connection, isSuccessCode)
            val responseJson = parseJson(responseBody)

            if (isSuccessCode && responseJson?.optBoolean("success", true) != false) {
                val successJson = responseJson ?: JSONObject()
                val rentals = parseRentalHistory(successJson)
                RentalHistoryResult.Success(
                    rentals = rentals,
                    message = successJson.optString("message").ifBlank {
                        "Rental history synchronized."
                    },
                )
            } else {
                parseGatewayError(
                    statusCode = statusCode,
                    responseJson = responseJson,
                    responseBody = responseBody,
                    retryAfterHeader = connection.getHeaderField("Retry-After"),
                ).toRentalHistoryError()
            }
        } catch (_: IOException) {
            RentalHistoryResult.Error(
                message = "Could not reach Hylono services. Check connectivity or backend URL.",
            )
        } catch (_: Exception) {
            RentalHistoryResult.Error(
                message = "The request could not be completed. Please try again in a moment.",
            )
        } finally {
            connection.disconnect()
        }
    }

    private fun postJson(
        path: String,
        payload: JSONObject,
        fallbackMessage: String,
    ): MobileAuthResult {
        val connection = createConnection(path).apply {
            requestMethod = "POST"
            doInput = true
            doOutput = true
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
        }

        return try {
            connection.outputStream.bufferedWriter(Charsets.UTF_8).use { writer ->
                writer.write(payload.toString())
            }

            val statusCode = connection.responseCode
            val isSuccessCode = statusCode in 200..299
            val responseBody = readResponseBody(connection, isSuccessCode)
            val responseJson = parseJson(responseBody)

            if (isSuccessCode && responseJson?.optBoolean("success", true) != false) {
                val successJson = responseJson ?: JSONObject()
                val session = parseSession(successJson)
                if (session != null) {
                    MobileAuthResult.Success(
                        session = session,
                        message = successJson.optString("message").ifBlank {
                            "Mobile session ready."
                        },
                    )
                } else {
                    MobileAuthResult.Error(message = fallbackMessage)
                }
            } else {
                parseGatewayError(
                    statusCode = statusCode,
                    responseJson = responseJson,
                    responseBody = responseBody,
                    retryAfterHeader = connection.getHeaderField("Retry-After"),
                ).toMobileAuthError()
            }
        } catch (_: IOException) {
            MobileAuthResult.Error(
                message = "Could not reach Hylono services. Check connectivity or backend URL.",
            )
        } catch (_: Exception) {
            MobileAuthResult.Error(
                message = "The request could not be completed. Please try again in a moment.",
            )
        } finally {
            connection.disconnect()
        }
    }

    private fun parseSession(responseJson: JSONObject): MobileAuthSession? {
        val sessionJson = responseJson.optJSONObject("session") ?: return null
        val userJson = sessionJson.optJSONObject("user") ?: return null
        val accessToken = sessionJson.optString("accessToken").trim()
        val refreshToken = sessionJson.optString("refreshToken").trim()
        val accessExpiry = sessionJson.optLong("accessTokenExpiresAtEpochSeconds")
        val refreshExpiry = sessionJson.optLong("refreshTokenExpiresAtEpochSeconds")
        val userEmail = userJson.optString("email").trim()
        val userName = userJson.optString("name").trim()
        val scopes = buildList {
            val scopesJson = sessionJson.optJSONArray("scopes") ?: JSONArray()
            for (index in 0 until scopesJson.length()) {
                val scope = scopesJson.optString(index).trim()
                if (scope.isNotBlank()) {
                    add(scope)
                }
            }
        }

        if (
            accessToken.isBlank() ||
            refreshToken.isBlank() ||
            accessExpiry <= 0L ||
            refreshExpiry <= 0L ||
            userEmail.isBlank() ||
            userName.isBlank()
        ) {
            return null
        }

        return MobileAuthSession(
            accessToken = accessToken,
            accessTokenExpiresAtEpochSeconds = accessExpiry,
            refreshToken = refreshToken,
            refreshTokenExpiresAtEpochSeconds = refreshExpiry,
            scopes = scopes,
            userEmail = userEmail,
            userName = userName,
        )
    }

    private fun parseRentalHistory(responseJson: JSONObject): List<RentalHistoryRecord> {
        val rentalsJson = responseJson.optJSONArray("rentals") ?: JSONArray()

        return buildList {
            for (index in 0 until rentalsJson.length()) {
                val rentalJson = rentalsJson.optJSONObject(index) ?: continue
                val id = rentalJson.optString("id").trim()
                val status = rentalJson.optString("status").trim()
                val termMonths = rentalJson.optInt("termMonths", 0)
                val totalMonthly = rentalJson.optDouble("totalMonthly")
                val createdAt = rentalJson.optString("createdAt").trim()
                val items = buildList {
                    val itemsJson = rentalJson.optJSONArray("items") ?: JSONArray()
                    for (itemIndex in 0 until itemsJson.length()) {
                        val itemJson = itemsJson.optJSONObject(itemIndex) ?: continue
                        add(
                            RentalHistoryLineItem(
                                techId = itemJson.optString("techId").trim(),
                                quantity = itemJson.optInt("quantity", 0),
                                monthlyPrice = itemJson.optDouble("monthlyPrice"),
                            ),
                        )
                    }
                }
                val contactJson = rentalJson.optJSONObject("contact")
                val contact = if (contactJson == null) {
                    null
                } else {
                    RentalHistoryContact(
                        fullName = contactJson.optString("fullName").trim(),
                        email = contactJson.optString("email").trim(),
                        city = contactJson.optString("city").trim(),
                        country = contactJson.optString("country").trim(),
                    )
                }

                if (id.isNotBlank()) {
                    add(
                        RentalHistoryRecord(
                            id = id,
                            status = status.ifBlank { "pending" },
                            totalMonthly = totalMonthly,
                            termMonths = termMonths,
                            createdAt = createdAt,
                            items = items,
                            contact = contact,
                        ),
                    )
                }
            }
        }
    }

    private fun createConnection(path: String): HttpURLConnection {
        val baseUrl = apiBaseUrl.trim().trimEnd('/')
        val endpoint = URL("$baseUrl$path")

        return (endpoint.openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 20_000
            instanceFollowRedirects = false
            setRequestProperty("Accept", "application/json")
            setRequestProperty("User-Agent", "HylonoNativeAndroid/0.2.0")
        }
    }

    private fun parseGatewayError(
        statusCode: Int,
        responseJson: JSONObject?,
        responseBody: String,
        retryAfterHeader: String? = null,
    ): ParsedGatewayError {
        val responseMessage = responseJson
            ?.optString("message")
            ?.takeIf { it.isNotBlank() }
        val fieldErrors = responseJson?.toFieldErrors().orEmpty()
        val retryAfterSeconds = retryAfterHeader
            ?.toIntOrNull()
            ?.coerceAtLeast(1)
        val details = fieldErrors
            .toSortedMap()
            .flatMap { (fieldName, messages) ->
                val fieldLabel = humanizeFieldName(fieldName)
                messages
                    .map { it.trim() }
                    .filter { it.isNotBlank() }
                    .map { "$fieldLabel: $it" }
            }
        val plainBodyMessage = responseBody
            .trim()
            .takeIf { it.isNotBlank() && !it.startsWith("<") && it.length <= 200 }
        val resolvedMessage = responseMessage
            .orEmpty()
            .ifBlank { plainBodyMessage.orEmpty() }
            .ifBlank {
                when (statusCode) {
                    400 -> "Review the request details and try again."
                    401 -> "Credentials not accepted. Check email and password."
                    403 -> "This action is not available from the native app session."
                    429 -> "Too many attempts. Please wait before trying again."
                    503 -> "Hylono services are temporarily unavailable. Please try again shortly."
                    in 500..599 -> "Hylono services returned $statusCode. Please try again shortly."
                    else -> "Hylono services returned $statusCode. Please try again."
                }
            }

        return ParsedGatewayError(
            message = resolvedMessage,
            details = details,
            retryAfterSeconds = retryAfterSeconds,
        )
    }

    private fun JSONObject.toFieldErrors(): Map<String, List<String>> {
        val fieldErrors = optJSONObject("fieldErrors") ?: return emptyMap()
        val parsedErrors = mutableMapOf<String, List<String>>()
        val keys = fieldErrors.keys()

        while (keys.hasNext()) {
            val key = keys.next()
            val messages = fieldErrors.optJSONArray(key) ?: continue
            val parsedMessages = mutableListOf<String>()

            for (index in 0 until messages.length()) {
                val message = messages.optString(index).trim()
                if (message.isNotBlank()) {
                    parsedMessages += message
                }
            }

            if (parsedMessages.isNotEmpty()) {
                parsedErrors[key] = parsedMessages
            }
        }

        return parsedErrors
    }

    private fun humanizeFieldName(fieldName: String): String = fieldName
        .replace('_', ' ')
        .replace(Regex("([a-z])([A-Z])"), "$1 $2")
        .trim()
        .replaceFirstChar { character ->
            if (character.isLowerCase()) {
                character.titlecase()
            } else {
                character.toString()
            }
        }

    private fun readResponseBody(connection: HttpURLConnection, isSuccessCode: Boolean): String {
        val stream = try {
            when {
                isSuccessCode -> connection.inputStream
                connection.errorStream != null -> connection.errorStream
                else -> connection.inputStream
            }
        } catch (_: IOException) {
            null
        }

        return stream?.bufferedReader()?.use { it.readText() }.orEmpty()
    }

    private fun parseJson(body: String): JSONObject? = try {
        if (body.isBlank()) {
            null
        } else {
            JSONObject(body)
        }
    } catch (_: Exception) {
        null
    }

    private data class ParsedGatewayError(
        val message: String,
        val details: List<String> = emptyList(),
        val retryAfterSeconds: Int? = null,
    ) {
        fun toMobileAuthError(): MobileAuthResult.Error = MobileAuthResult.Error(
            message = message,
            details = details,
            retryAfterSeconds = retryAfterSeconds,
        )

        fun toRentalHistoryError(): RentalHistoryResult.Error = RentalHistoryResult.Error(
            message = message,
            details = details,
            retryAfterSeconds = retryAfterSeconds,
        )
    }
}
