package com.hylono.mobile.data.repository

import com.hylono.mobile.data.model.BookingDraft
import com.hylono.mobile.data.model.ContactDraft
import com.hylono.mobile.data.model.NewsletterDraft
import com.hylono.mobile.data.model.Product
import com.hylono.mobile.data.model.RentalDraft
import com.hylono.mobile.data.model.SubmissionResult
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

internal data class ParsedSubmissionError(
    val message: String,
    val details: List<String> = emptyList(),
    val retryAfterSeconds: Int? = null,
)

class HttpIntakeGateway(
    private val apiBaseUrl: String,
) : HylonoIntakeGateway {
    override suspend fun submitBooking(request: BookingDraft): SubmissionResult = withContext(Dispatchers.IO) {
        postJson(
            path = "/api/booking",
            payload = JSONObject()
                .put("name", request.fullName.trim())
                .put("email", request.email.trim())
                .put("phone", request.phone.trim())
                .put("preferredDate", request.preferredDate.trim())
                .put("preferredTime", request.preferredTime.trim())
                .put("bookingType", request.bookingType.apiValue)
                .put("techInterest", request.techInterest.orEmpty())
                .put("notes", request.notes.trim()),
        ) { response ->
            SubmissionResult.Success(
                message = response.optString("message").ifBlank {
                    "Booking request sent. Hylono will confirm the slot shortly."
                },
                reference = response.optString("bookingRef").takeIf { it.isNotBlank() },
            )
        }
    }

    override suspend fun submitRental(
        request: RentalDraft,
        product: Product,
    ): SubmissionResult = withContext(Dispatchers.IO) {
        val rentalPrice = product.rentalMonthlyPrice ?: return@withContext SubmissionResult.Error(
            "This product is not configured for rental intake.",
        )

        postJson(
            path = "/api/rental",
            payload = JSONObject()
                .put(
                    "items",
                    JSONArray().put(
                        JSONObject()
                            .put("techId", product.id)
                            .put("quantity", request.quantity)
                            .put("monthlyPrice", rentalPrice),
                    ),
                )
                .put("fullName", request.fullName.trim())
                .put("email", request.email.trim())
                .put("phone", request.phone.trim())
                .put("address", request.address.trim())
                .put("city", request.city.trim())
                .put("postalCode", request.postalCode.trim())
                .put("country", request.country.trim())
                .put("company", request.company.trim())
                .put("termMonths", request.termMonths),
        ) { response ->
            val rentalId = response.optJSONObject("rental")
                ?.optString("id")
                ?.takeIf { it.isNotBlank() }
            SubmissionResult.Success(
                message = response.optString("message").ifBlank {
                    "Rental request sent. Hylono will review the application."
                },
                reference = rentalId,
            )
        }
    }

    override suspend fun submitContact(request: ContactDraft): SubmissionResult = withContext(Dispatchers.IO) {
        postJson(
            path = "/api/contact",
            payload = JSONObject()
                .put("name", request.fullName.trim())
                .put("email", request.email.trim())
                .put("phone", request.phone.trim().takeIf { it.isNotBlank() })
                .put("company", request.company.trim().takeIf { it.isNotBlank() })
                .put("subject", request.subject.trim().takeIf { it.isNotBlank() })
                .put("message", request.message.trim())
                .put("inquiryType", request.inquiryType.apiValue),
        ) { response ->
            SubmissionResult.Success(
                message = response.optString("message").ifBlank {
                    "Support request sent. Hylono will reply within 1 business day."
                },
                reference = response.optString("ticketId").takeIf { it.isNotBlank() },
            )
        }
    }

    override suspend fun submitNewsletter(request: NewsletterDraft): SubmissionResult = withContext(Dispatchers.IO) {
        postJson(
            path = "/api/newsletter",
            payload = JSONObject()
                .put("email", request.email.trim())
                .put("firstName", request.firstName.trim().takeIf { it.isNotBlank() })
                .put("source", "android-native-app"),
        ) { response ->
            SubmissionResult.Success(
                message = response.optString("message").ifBlank {
                    "Subscription received. Check your inbox to confirm."
                },
            )
        }
    }

    private fun postJson(
        path: String,
        payload: JSONObject,
        onSuccess: (JSONObject) -> SubmissionResult.Success,
    ): SubmissionResult {
        val baseUrl = apiBaseUrl.trim().trimEnd('/')
        val endpoint = URL("$baseUrl$path")
        val connection = (endpoint.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            doInput = true
            doOutput = true
            connectTimeout = 15_000
            readTimeout = 20_000
            instanceFollowRedirects = false
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
            setRequestProperty("Accept", "application/json")
            setRequestProperty("User-Agent", "HylonoNativeAndroid/0.1.0")
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
                onSuccess(responseJson ?: JSONObject())
            } else {
                parseSubmissionError(
                    statusCode = statusCode,
                    responseJson = responseJson,
                    responseBody = responseBody,
                    retryAfterHeader = connection.getHeaderField("Retry-After"),
                ).let { parsedError ->
                    SubmissionResult.Error(
                        message = parsedError.message,
                        details = parsedError.details,
                        retryAfterSeconds = parsedError.retryAfterSeconds,
                    )
                }
            }
        } catch (_: IOException) {
            SubmissionResult.Error(
                "Could not reach Hylono services. Check connectivity or backend URL.",
            )
        } catch (_: Exception) {
            SubmissionResult.Error(
                "The request could not be completed. Please try again in a moment.",
            )
        } finally {
            connection.disconnect()
        }
    }

    internal fun parseSubmissionError(
        statusCode: Int,
        responseJson: JSONObject?,
        responseBody: String,
        retryAfterHeader: String? = null,
    ): ParsedSubmissionError {
        val responseMessage = responseJson
            ?.optString("message")
            ?.takeIf { it.isNotBlank() }
        val fieldErrors = responseJson?.toFieldErrors().orEmpty()

        return buildSubmissionError(
            statusCode = statusCode,
            message = responseMessage,
            fieldErrors = fieldErrors,
            responseBody = responseBody,
            retryAfterHeader = retryAfterHeader,
        )
    }

    internal fun buildSubmissionError(
        statusCode: Int,
        message: String?,
        fieldErrors: Map<String, List<String>> = emptyMap(),
        responseBody: String,
        retryAfterHeader: String? = null,
    ): ParsedSubmissionError {
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
        val resolvedMessage = message
            .orEmpty()
            .ifBlank { plainBodyMessage.orEmpty() }
            .ifBlank {
                when (statusCode) {
                    400 -> "Review the request details and try again."
                    401, 403 -> "This action is not available from the native app session."
                    429 -> "Too many attempts. Please wait before trying again."
                    503 -> "Hylono services are temporarily unavailable. Please try again shortly."
                    in 500..599 -> "Hylono services returned $statusCode. Please try again shortly."
                    else -> "Hylono services returned $statusCode. Please try again."
                }
            }

        return ParsedSubmissionError(
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
}
