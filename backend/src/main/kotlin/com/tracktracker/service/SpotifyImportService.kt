package com.tracktracker.service

import com.fasterxml.jackson.databind.JsonNode
import com.tracktracker.model.Track
import com.tracktracker.repository.TrackRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate
import java.time.Instant
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.random.Random
import java.net.URLEncoder

@Service
class SpotifyImportService(
    private val trackRepository: TrackRepository,
    @Value("\${SPOTIFY_CLIENT_ID:}") private val clientId: String,
    @Value("\${SPOTIFY_CLIENT_SECRET:}") private val clientSecret: String,
) {
    private val restTemplate = RestTemplate()
    private val enabled = clientId.isNotBlank() && clientSecret.isNotBlank()
    private var cachedToken: String? = null
    private var tokenExpiry: Instant = Instant.EPOCH

    private fun getAccessToken(): String {
        if (!enabled) {
            throw IllegalStateException("Spotify CLIENT_ID/SECRET not configured. Set env variables to enable import.")
        }
        val now = Instant.now()
        if (cachedToken != null && now.isBefore(tokenExpiry.minusSeconds(60))) {
            return cachedToken!!
        }

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_FORM_URLENCODED
            val credentials = "$clientId:$clientSecret"
            val encoded = Base64.getEncoder().encodeToString(credentials.toByteArray())
            set("Authorization", "Basic $encoded")
        }
        val body: MultiValueMap<String, String> = LinkedMultiValueMap<String, String>().apply {
            add("grant_type", "client_credentials")
        }
        val request = HttpEntity(body, headers)
        val response = restTemplate.postForEntity(
            "https://accounts.spotify.com/api/token",
            request,
            JsonNode::class.java
        )
        val json = response.body!!
        cachedToken = json["access_token"].asText()
        val expiresIn = json["expires_in"].asLong()
        tokenExpiry = now.plusSeconds(expiresIn)
        return cachedToken!!
    }

    private fun buildAuthHeaders(): HttpEntity<Void> {
        val headers = HttpHeaders()
        headers.accept = listOf(MediaType.APPLICATION_JSON)
        headers.setBearerAuth(getAccessToken())
        return HttpEntity(headers)
    }

    fun importFromPlaylist(playlistId: String, limit: Int = 100): List<Track> {
        if (!enabled) return emptyList()
        val url = "https://api.spotify.com/v1/playlists/$playlistId/tracks?market=US&limit=$limit"
        val response = restTemplate.exchange(url, HttpMethod.GET, buildAuthHeaders(), JsonNode::class.java)
        val items = response.body?.get("items") ?: return emptyList()
        val imported = mutableListOf<Track>()
        for (item in items) {
            val trackNode = item["track"] ?: continue
            val track = parseTrack(trackNode)
            if (track != null) {
                // Avoid duplicates by (title, artist)
                val exists = trackRepository.findByTitleContainingIgnoreCase(track.title).any { it.artist.equals(track.artist, true) }
                if (!exists) {
                    imported += trackRepository.save(track)
                }
            }
        }
        return imported
    }

    fun importRandomTracks(size: Int = 20): List<Track> {
        if (!enabled) return emptyList()
        val randomLetter = ('a' + Random.nextInt(26)).toString()
        val maxOffset = (1000 - size).coerceAtLeast(0)
        val offset = if (maxOffset == 0) 0 else Random.nextInt(maxOffset)
        val url = "https://api.spotify.com/v1/search?q=$randomLetter&type=track&limit=$size&offset=$offset&market=US"
        val response = try {
            restTemplate.exchange(url, HttpMethod.GET, buildAuthHeaders(), JsonNode::class.java)
        } catch (ex: org.springframework.web.client.HttpClientErrorException) {
            // Log and return empty list to let DataSeeder fall back
            println("Spotify API error: ${ex.statusCode} ${ex.responseBodyAsString}")
            return emptyList()
        }
        val tracksNode = response.body?.path("tracks")?.path("items") ?: return emptyList()
        val results = mutableListOf<Track>()
        for (trackNode in tracksNode) {
            val track = parseTrack(trackNode)
            if (track != null) {
                val exists = trackRepository.findByTitleContainingIgnoreCase(track.title).any { it.artist.equals(track.artist, true) }
                if (!exists) {
                    results += trackRepository.save(track)
                }
            }
        }
        return results
    }

    /**
     * Search Spotify for tracks by query and return raw JSON items list; does not persist.
     */
    fun searchSpotifyTracks(query: String, limit: Int = 20, offset: Int = 0): JsonNode? {
        if (!enabled) return null
        val safeLimit = limit.coerceIn(1, 50)
        val safeOffset = offset.coerceAtLeast(0)
        val url = "https://api.spotify.com/v1/search?q=${URLEncoder.encode(query, "UTF-8")}&type=track&market=US&limit=$safeLimit&offset=$safeOffset"
        return try {
            val response = restTemplate.exchange(url, HttpMethod.GET, buildAuthHeaders(), JsonNode::class.java)
            response.body?.path("tracks")?.path("items")
        } catch (ex: Exception) {
            println("Spotify search error: ${ex.message}")
            null
        }
    }

    private fun parseTrack(trackNode: JsonNode): Track? {
        val title = trackNode["name"]?.asText() ?: return null
        val artistArray = trackNode["artists"]
        val artist = if (artistArray != null && artistArray.isArray && artistArray.size() > 0) {
            artistArray[0]["name"].asText()
        } else {
            "Unknown"
        }
        val albumNode = trackNode["album"]
        val album = albumNode?.get("name")?.asText()
        val releaseDate = albumNode?.get("release_date")?.asText()
        val releaseYear = releaseDate?.take(4)?.toIntOrNull()
        val imageUrl = albumNode?.path("images")?.firstOrNull()?.get("url")?.asText()
        return Track(title = title, artist = artist, album = album, releaseYear = releaseYear, imageUrl = imageUrl)
    }
} 