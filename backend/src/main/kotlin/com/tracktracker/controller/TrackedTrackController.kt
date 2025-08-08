package com.tracktracker.controller

import com.tracktracker.service.TrackedTrackService
import com.tracktracker.service.TrackService
import com.tracktracker.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tracked")
class TrackedTrackController(
    private val trackedTrackService: TrackedTrackService,
    private val userService: UserService,
    private val trackService: TrackService
) {
    @PostMapping
    fun trackTrack(
        @RequestParam userId: Long,
        @RequestParam trackId: Long,
        @RequestParam(required = false) notes: String?
    ): ResponseEntity<Any> {
        val user = userService.findById(userId).orElse(null)
            ?: return ResponseEntity.badRequest().body(mapOf("error" to "User not found"))
        
        val track = trackService.findById(trackId).orElse(null)
            ?: return ResponseEntity.badRequest().body(mapOf("error" to "Track not found"))

        val trackedTrack = trackedTrackService.trackTrack(user, track, notes)
        return ResponseEntity.ok(trackedTrack)
    }

    @PostMapping("/{userId}/track/{trackId}/play")
    fun incrementPlayCount(
        @PathVariable userId: Long,
        @PathVariable trackId: Long
    ): ResponseEntity<Any> {
        trackedTrackService.incrementPlayCount(userId, trackId)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/user/{userId}/track/{trackId}")
    fun getTrackedTrack(@PathVariable userId: Long, @PathVariable trackId: Long): ResponseEntity<Any> {
        val trackedTrack = trackedTrackService.getTrackedTrack(userId, trackId)
        return if (trackedTrack != null) {
            ResponseEntity.ok(trackedTrack)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/user/{userId}")
    fun getUserTrackedTracks(@PathVariable userId: Long): ResponseEntity<List<com.tracktracker.model.TrackedTrack>> {
        return ResponseEntity.ok(trackedTrackService.getUserTrackedTracks(userId))
    }

    @GetMapping("/user/{userId}/recent")
    fun getRecentTrackedTracks(@PathVariable userId: Long): ResponseEntity<List<com.tracktracker.model.TrackedTrack>> {
        return ResponseEntity.ok(trackedTrackService.getRecentTrackedTracks(userId))
    }
} 