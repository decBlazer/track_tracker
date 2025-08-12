package com.tracktracker.controller

import com.fasterxml.jackson.databind.JsonNode
import com.tracktracker.service.SpotifyImportService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/spotify")
class SpotifyController(private val spotifyService: SpotifyImportService) {

    @GetMapping("/search")
    fun searchSpotify(
        @RequestParam query: String,
        @RequestParam(defaultValue = "20") limit: Int,
        @RequestParam(defaultValue = "0") offset: Int
    ): ResponseEntity<JsonNode?> {
        val result = spotifyService.searchSpotifyTracks(query, limit, offset)
        return ResponseEntity.ok(result)
    }
} 