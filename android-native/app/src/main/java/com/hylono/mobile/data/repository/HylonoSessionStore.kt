package com.hylono.mobile.data.repository

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.hylono.mobile.data.model.MobileAuthSession
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class HylonoSessionStore(
    private val context: Context,
) {
    suspend fun loadSession(): MobileAuthSession? = withContext(Dispatchers.IO) {
        val encryptedPayload = sharedPreferences.getString(sessionPayloadKey, null)
            ?: return@withContext null

        val decryptedPayload = runCatching { decrypt(encryptedPayload) }
            .getOrNull()
            ?.takeIf { it.isNotBlank() }
            ?: run {
                clearSessionInternal()
                return@withContext null
            }

        decodeSession(decryptedPayload)?.also { return@withContext it }

        clearSessionInternal()
        null
    }

    suspend fun saveSession(session: MobileAuthSession) = withContext(Dispatchers.IO) {
        val encodedSession = encodeSession(session)
        val encryptedSession = encrypt(encodedSession)

        sharedPreferences.edit()
            .putString(sessionPayloadKey, encryptedSession)
            .apply()
    }

    suspend fun clearSession() = withContext(Dispatchers.IO) {
        clearSessionInternal()
    }

    private fun clearSessionInternal() {
        sharedPreferences.edit()
            .remove(sessionPayloadKey)
            .apply()
    }

    private fun encodeSession(session: MobileAuthSession): String = JSONObject()
        .put("accessToken", session.accessToken)
        .put("accessTokenExpiresAtEpochSeconds", session.accessTokenExpiresAtEpochSeconds)
        .put("refreshToken", session.refreshToken)
        .put("refreshTokenExpiresAtEpochSeconds", session.refreshTokenExpiresAtEpochSeconds)
        .put("scopes", JSONArray(session.scopes))
        .put("userEmail", session.userEmail)
        .put("userName", session.userName)
        .toString()

    private fun decodeSession(raw: String): MobileAuthSession? = runCatching {
        val json = JSONObject(raw)
        val accessToken = json.optString("accessToken").trim()
        val refreshToken = json.optString("refreshToken").trim()
        val userEmail = json.optString("userEmail").trim()
        val userName = json.optString("userName").trim()
        val accessExpiry = json.optLong("accessTokenExpiresAtEpochSeconds")
        val refreshExpiry = json.optLong("refreshTokenExpiresAtEpochSeconds")
        val scopes = buildList {
            val scopesJson = json.optJSONArray("scopes") ?: JSONArray()
            for (index in 0 until scopesJson.length()) {
                val value = scopesJson.optString(index).trim()
                if (value.isNotBlank()) {
                    add(value)
                }
            }
        }

        if (
            accessToken.isBlank() ||
            refreshToken.isBlank() ||
            userEmail.isBlank() ||
            userName.isBlank() ||
            accessExpiry <= 0L ||
            refreshExpiry <= 0L
        ) {
            null
        } else {
            MobileAuthSession(
                accessToken = accessToken,
                accessTokenExpiresAtEpochSeconds = accessExpiry,
                refreshToken = refreshToken,
                refreshTokenExpiresAtEpochSeconds = refreshExpiry,
                scopes = scopes,
                userEmail = userEmail,
                userName = userName,
            )
        }
    }.getOrNull()

    private fun encrypt(raw: String): String {
        val cipher = Cipher.getInstance(cipherTransformation)
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())
        val iv = cipher.iv
        val encryptedBytes = cipher.doFinal(raw.toByteArray(StandardCharsets.UTF_8))

        return "${encodeBase64(iv)}:${encodeBase64(encryptedBytes)}"
    }

    private fun decrypt(payload: String): String {
        val parts = payload.split(':', limit = 2)
        require(parts.size == 2) { "Invalid encrypted session payload." }

        val iv = decodeBase64(parts[0])
        val encryptedBytes = decodeBase64(parts[1])
        val cipher = Cipher.getInstance(cipherTransformation)
        cipher.init(
            Cipher.DECRYPT_MODE,
            getOrCreateSecretKey(),
            GCMParameterSpec(128, iv),
        )

        return String(cipher.doFinal(encryptedBytes), StandardCharsets.UTF_8)
    }

    private fun getOrCreateSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(androidKeyStore).apply {
            load(null)
        }
        val existingKey = keyStore.getKey(keyAlias, null) as? SecretKey
        if (existingKey != null) {
            return existingKey
        }

        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            androidKeyStore,
        )
        keyGenerator.init(
            KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setRandomizedEncryptionRequired(true)
                .setKeySize(256)
                .build(),
        )

        return keyGenerator.generateKey()
    }

    private fun encodeBase64(value: ByteArray): String =
        Base64.encodeToString(value, Base64.NO_WRAP)

    private fun decodeBase64(value: String): ByteArray =
        Base64.decode(value, Base64.NO_WRAP)

    private val sharedPreferences by lazy {
        context.getSharedPreferences(sessionPreferencesName, Context.MODE_PRIVATE)
    }

    private companion object {
        private const val androidKeyStore = "AndroidKeyStore"
        private const val cipherTransformation = "AES/GCM/NoPadding"
        private const val keyAlias = "hylono_mobile_session_key"
        private const val sessionPreferencesName = "hylono_mobile_session"
        private const val sessionPayloadKey = "mobile_session_payload"
    }
}
