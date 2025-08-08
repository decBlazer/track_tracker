package com.tracktracker.repository

import com.tracktracker.model.TrackedTrack
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TrackedTrackRepository : JpaRepository<TrackedTrack, Long> {
    fun findByUserIdAndTrackId(userId: Long, trackId: Long): TrackedTrack?
    fun findByUserId(userId: Long): List<TrackedTrack>
    fun findByTrackId(trackId: Long): List<TrackedTrack>
    fun findTopByUserIdOrderByTrackedAtDesc(userId: Long): List<TrackedTrack>
} 