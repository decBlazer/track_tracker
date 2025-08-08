package com.tracktracker.repository

import com.tracktracker.model.Rating
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface RatingRepository : JpaRepository<Rating, Long> {
    fun findByUserId(userId: Long): List<Rating>
    fun findByTrackId(trackId: Long): List<Rating>
    fun findByUserIdAndTrackId(userId: Long, trackId: Long): Rating?
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.track.id = :trackId")
    fun getAverageRatingForTrack(trackId: Long): Double?
} 