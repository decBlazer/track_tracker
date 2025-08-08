package com.tracktracker.controller

import com.tracktracker.service.TrackService
import com.tracktracker.service.SpotifyImportService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tracks")
class TrackController(
    private val trackService: TrackService,
    private val spotifyImportService: SpotifyImportService
) {
    @PostMapping
    fun createTrack(
        @RequestParam title: String,
        @RequestParam artist: String,
        @RequestParam(required = false) album: String?,
        @RequestParam(required = false) releaseYear: Int?
    ): ResponseEntity<Any> {
        val track = trackService.createTrack(title, artist, album, releaseYear)
        return ResponseEntity.ok(track)
    }

    @GetMapping("/search")
    fun searchTracks(@RequestParam query: String) = ResponseEntity.ok(trackService.searchTracks(query))

    @GetMapping("/search/name")
    fun searchByName(@RequestParam query: String) = ResponseEntity.ok(trackService.findByTitle(query))

    @GetMapping("/search/artist")
    fun searchByArtist(@RequestParam query: String) = ResponseEntity.ok(trackService.findByArtist(query))

    @GetMapping("/search/album")
    fun searchByAlbum(@RequestParam query: String) = ResponseEntity.ok(trackService.findByAlbum(query))

    @GetMapping("/random")
    fun getRandomTracks(@RequestParam(defaultValue = "10") size: Int) = ResponseEntity.ok(trackService.getRandomTracks(size))

    // --- Import helpers ---

    @PostMapping("/import/spotify")
    fun importFromSpotify(@RequestParam playlistId: String, @RequestParam(defaultValue = "100") size: Int): ResponseEntity<Any> {
        val imported = spotifyImportService.importFromPlaylist(playlistId, size)
        return ResponseEntity.ok(imported)
    }

    @PostMapping("/import/random")
    fun importRandomTracks(@RequestParam(defaultValue = "20") size: Int): ResponseEntity<Any> {
        val imported = spotifyImportService.importRandomTracks(size)
        return ResponseEntity.ok(imported)
    }

    @GetMapping("/{id}")
    fun getTrack(@PathVariable id: Long) = trackService.findById(id)
        .map { ResponseEntity.ok(it) }
        .orElse(ResponseEntity.notFound().build())
} 