package com.tracktracker.controller

import com.tracktracker.service.RatingService
import com.tracktracker.service.TrackService
import com.tracktracker.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/ratings")
class RatingController(
    private val ratingService: RatingService,
    private val userService: UserService,
    private val trackService: TrackService
) {
    @PostMapping
    fun createOrUpdateRating(
        @RequestParam userId: Long,
        @RequestParam trackId: Long,
        @RequestParam rating: Int,
        @RequestParam(required = false) comment: String?
    ): ResponseEntity<Any> {
        if (rating !in 1..5) {
            return ResponseEntity.badRequest().body(mapOf("error" to "Rating must be between 1 and 5"))
        }

        val user = userService.findById(userId).orElse(null)
            ?: return ResponseEntity.badRequest().body(mapOf("error" to "User not found"))
        
        val track = trackService.findById(trackId).orElse(null)
            ?: return ResponseEntity.badRequest().body(mapOf("error" to "Track not found"))

        val trackRating = ratingService.createOrUpdateRating(user, track, rating, comment)
        return ResponseEntity.ok(trackRating)
    }

    @GetMapping("/user/{userId}/track/{trackId}")
    fun getRating(@PathVariable userId: Long, @PathVariable trackId: Long): ResponseEntity<Any> {
        val rating = ratingService.getRating(userId, trackId)
        return if (rating != null) {
            ResponseEntity.ok(rating)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/track/{trackId}")
    fun getTrackRatings(@PathVariable trackId: Long): ResponseEntity<List<com.tracktracker.model.Rating>> {
        return ResponseEntity.ok(ratingService.getTrackRatings(trackId))
    }

    @GetMapping("/user/{userId}")
    fun getUserRatings(@PathVariable userId: Long): ResponseEntity<List<com.tracktracker.model.Rating>> {
        return ResponseEntity.ok(ratingService.getUserRatings(userId))
    }

    @GetMapping("/track/{trackId}/average")
    fun getAverageRating(@PathVariable trackId: Long): ResponseEntity<Map<String, Double?>> {
        return ResponseEntity.ok(mapOf("average" to ratingService.getAverageRating(trackId)))
    }
} 