package com.hylono.mobile.data

import com.hylono.mobile.model.BookingDraft
import com.hylono.mobile.model.ContactDraft
import com.hylono.mobile.model.NewsletterDraft
import com.hylono.mobile.model.RentalDraft
import com.hylono.mobile.model.RentalLineItem
import com.hylono.mobile.model.RentalLookupResult
import com.hylono.mobile.model.RentalStatus
import com.hylono.mobile.model.SubmissionResult
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class HylonoApi(
    private val baseUrl: String,
) {
    suspend fun submitBooking(draft: BookingDraft): SubmissionResult =
        postJson(
            path = "/api/booking",
            body = JSONObject()
                .put("name", draft.name)
                .put("email", draft.email)
                .put("phone", draft.phone.ifBlank { JSONObject.NULL })
                .put("preferredDate", draft.preferredDate.ifBlank { JSONObject.NULL })
                .put("techInterest", draft.techInterest.ifBlank { JSONObject.NULL })
                .put("notes", draft.notes.ifBlank { JSONObject.NULL })
                .put("bookingType", "consultation"),
            referenceKey = "bookingRef",
        )

    suspend fun submitContact(draft: ContactDraft): SubmissionResult =
        postJson(
            path = "/api/contact",
            body = JSONObject()
                .put("name", draft.name)
                .put("email", draft.email)
                .put("phone", draft.phone.ifBlank { JSONObject.NULL })
                .put("company", draft.company.ifBlank { JSONObject.NULL })
                .put("subject", draft.subject)
                .put("message", draft.message)
                .put("inquiryType", draft.inquiryType.lowercase()),
            referenceKey = "ticketId",
        )

    suspend fun submitNewsletter(draft: NewsletterDraft): SubmissionResult =
        postJson(
            path = "/api/newsletter",
            body = JSONObject()
                .put("email", draft.email)
                .put("firstName", draft.firstName.ifBlank { JSONObject.NULL })
                .put("source", "android-app"),
            referenceKey = null,
        )

    suspend fun submitRental(draft: RentalDraft): SubmissionResult =
        postJson(
            path = "/api/rental",
            body = JSONObject()
                .put("fullName", draft.fullName)
                .put("email", draft.email)
                .put("phone", draft.phone.ifBlank { JSONObject.NULL })
                .put("address", draft.address)
                .put("city", draft.city)
                .put("postalCode", draft.postalCode)
                .put("country", draft.country)
                .put("company", draft.company.ifBlank { JSONObject.NULL })
                .put("termMonths", draft.termMonths)
                .put("items", JSONArray(draft.items.map { item -> item.toJson() })),
            referenceKey = "rental.id",
        )

    suspend fun lookupRentals(email: String): RentalLookupResult = withContext(Dispatchers.IO) {
        val sanitizedBaseUrl = baseUrl.trim().trimEnd('/')
        if (sanitizedBaseUrl.isBlank()) {
            return@withContext RentalLookupResult(
                success = false,
                message = "HYLONO_API_BASE_URL is not configured.",
            )
        }

        val encodedEmail = URLEncoder.encode(email.trim(), Charsets.UTF_8.name())
        val connection = (URL("$sanitizedBaseUrl/api/rental?email=$encodedEmail").openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 8_000
            readTimeout = 8_000
            setRequestProperty("Accept", "application/json")
        }

        try {
            val responseBody = connection.readResponseBody()
            val payload = JSONObject(responseBody)
            if (!payload.optBoolean("success", false)) {
                return@withContext RentalLookupResult(
                    success = false,
                    message = payload.optString("message", "Could not load rental records."),
                )
            }

            val rentalsArray = payload.optJSONArray("rentals") ?: JSONArray()
            val rentals = buildList {
                for (index in 0 until rentalsArray.length()) {
                    val item = rentalsArray.getJSONObject(index)
                    val items = item.optJSONArray("items") ?: JSONArray()
                    val itemsSummary = buildList {
                        for (itemIndex in 0 until items.length()) {
                            val rentalItem = items.getJSONObject(itemIndex)
                            add("${rentalItem.optString("techId")} x${rentalItem.optInt("quantity", 0)}")
                        }
                    }.joinToString(", ")

                    add(
                        RentalStatus(
                            id = item.optString("id"),
                            status = item.optString("status"),
                            totalMonthly = item.optDouble("totalMonthly", 0.0),
                            termMonths = item.optInt("termMonths", 0),
                            createdAt = item.optString("createdAt"),
                            itemsSummary = itemsSummary,
                        ),
                    )
                }
            }

            RentalLookupResult(
                success = true,
                message = payload.optString("message", "Rental records loaded."),
                rentals = rentals,
            )
        } catch (error: Exception) {
            RentalLookupResult(
                success = false,
                message = error.message ?: "Could not reach the Hylono rental endpoint.",
            )
        } finally {
            connection.disconnect()
        }
    }

    private suspend fun postJson(
        path: String,
        body: JSONObject,
        referenceKey: String?,
    ): SubmissionResult = withContext(Dispatchers.IO) {
        val sanitizedBaseUrl = baseUrl.trim().trimEnd('/')
        if (sanitizedBaseUrl.isBlank()) {
            return@withContext SubmissionResult(
                success = false,
                message = "HYLONO_API_BASE_URL is not configured.",
            )
        }

        val connection = (URL("$sanitizedBaseUrl$path").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 8_000
            readTimeout = 8_000
            doOutput = true
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
            setRequestProperty("Accept", "application/json")
        }

        try {
            connection.outputStream.use { output ->
                output.write(body.toString().toByteArray(Charsets.UTF_8))
            }

            val responseBody = connection.readResponseBody()
            val payload = runCatching { JSONObject(responseBody) }.getOrDefault(JSONObject())
            val reference = referenceKey?.let { payload.findNestedString(it) }

            SubmissionResult(
                success = payload.optBoolean("success", connection.responseCode in 200..299),
                message = payload.optString("message", "Request finished with status ${connection.responseCode}."),
                reference = reference,
            )
        } catch (error: Exception) {
            SubmissionResult(
                success = false,
                message = error.message ?: "Could not reach the Hylono API.",
            )
        } finally {
            connection.disconnect()
        }
    }

    private fun HttpURLConnection.readResponseBody(): String {
        val stream = if (responseCode in 200..299) inputStream else errorStream
        if (stream == null) {
            return ""
        }

        return BufferedReader(InputStreamReader(stream)).use { reader ->
            buildString {
                while (true) {
                    val line = reader.readLine() ?: break
                    append(line)
                }
            }
        }
    }

    private fun JSONObject.findNestedString(path: String): String? {
        val segments = path.split('.')
        var current: JSONObject = this
        for (index in 0 until segments.lastIndex) {
            val next = current.optJSONObject(segments[index]) ?: return null
            current = next
        }
        return current.optString(segments.last(), null)
    }

    private fun RentalLineItem.toJson(): JSONObject =
        JSONObject()
            .put("techId", techId)
            .put("quantity", quantity)
            .put("monthlyPrice", monthlyPrice)
}
