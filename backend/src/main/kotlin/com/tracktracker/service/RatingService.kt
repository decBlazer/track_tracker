package com.tracktracker.service

import com.tracktracker.model.Rating
import com.tracktracker.model.Track
import com.tracktracker.model.User
import com.tracktracker.repository.RatingRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class RatingService(private val ratingRepository: RatingRepository) {
    @Transactional
    fun createOrUpdateRating(user: User, track: Track, rating: Int, comment: String? = null): Rating {
        val existingRating = ratingRepository.findByUserIdAndTrackId(user.id, track.id)
        
        return if (existingRating != null) {
            existingRating.copy(
                rating = rating,
                comment = comment,
                updatedAt = LocalDateTime.now()
            ).also { ratingRepository.save(it) }
        } else {
            Rating(
                user = user,
                track = track,
                rating = rating,
                comment = comment
            ).also { ratingRepository.save(it) }
        }
    }

    fun getRating(userId: Long, trackId: Long) = ratingRepository.findByUserIdAndTrackId(userId, trackId)
    fun getTrackRatings(trackId: Long) = ratingRepository.findByTrackId(trackId)
    fun getUserRatings(userId: Long) = ratingRepository.findByUserId(userId)
    fun getAverageRating(trackId: Long) = ratingRepository.getAverageRatingForTrack(trackId)
} 