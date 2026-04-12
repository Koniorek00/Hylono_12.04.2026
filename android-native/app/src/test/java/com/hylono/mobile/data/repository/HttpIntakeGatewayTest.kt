package com.hylono.mobile.data.repository

import org.junit.Assert.assertEquals
import org.junit.Test

class HttpIntakeGatewayTest {
    private val gateway = HttpIntakeGateway("https://hylono.com")

    @Test
    fun `parseSubmissionError surfaces field errors and retry window`() {
        val responseBody = """
            {
              "success": false,
              "message": "Invalid request payload.",
              "fieldErrors": {
                "email": ["Please enter a valid email address."],
                "fullName": ["Missing required field: fullName"]
              }
            }
        """.trimIndent()
        val parsed = gateway.buildSubmissionError(
            statusCode = 400,
            message = "Invalid request payload.",
            fieldErrors = mapOf(
                "email" to listOf("Please enter a valid email address."),
                "fullName" to listOf("Missing required field: fullName"),
            ),
            responseBody = responseBody,
            retryAfterHeader = "90",
        )

        assertEquals("Invalid request payload.", parsed.message)
        assertEquals(
            listOf(
                "Email: Please enter a valid email address.",
                "Full Name: Missing required field: fullName",
            ),
            parsed.details,
        )
        assertEquals(90, parsed.retryAfterSeconds)
    }

    @Test
    fun `parseSubmissionError falls back to rate limit guidance`() {
        val parsed = gateway.buildSubmissionError(
            statusCode = 429,
            message = null,
            responseBody = "",
            retryAfterHeader = "45",
        )

        assertEquals("Too many attempts. Please wait before trying again.", parsed.message)
        assertEquals(45, parsed.retryAfterSeconds)
    }

    @Test
    fun `parseSubmissionError falls back to service unavailable guidance`() {
        val parsed = gateway.buildSubmissionError(
            statusCode = 503,
            message = null,
            responseBody = "",
        )

        assertEquals(
            "Hylono services are temporarily unavailable. Please try again shortly.",
            parsed.message,
        )
        assertEquals(emptyList<String>(), parsed.details)
    }
}
