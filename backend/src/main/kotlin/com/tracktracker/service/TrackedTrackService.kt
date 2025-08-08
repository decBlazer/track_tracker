package com.tracktracker.service

import com.tracktracker.model.Track
import com.tracktracker.model.TrackedTrack
import com.tracktracker.model.User
import com.tracktracker.repository.TrackedTrackRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TrackedTrackService(private val trackedTrackRepository: TrackedTrackRepository) {
    @Transactional
    fun trackTrack(user: User, track: Track, notes: String? = null): TrackedTrack {
        val existingTrack = trackedTrackRepository.findByUserIdAndTrackId(user.id, track.id)
        
        return if (existingTrack != null) {
            existingTrack
        } else {
            TrackedTrack(
                user = user,
                track = track,
                notes = notes
            ).also { trackedTrackRepository.save(it) }
        }
    }

    @Transactional
    fun incrementPlayCount(userId: Long, trackId: Long) {
        trackedTrackRepository.findByUserIdAndTrackId(userId, trackId)?.let { trackedTrack ->
            trackedTrack.playCount++
            trackedTrackRepository.save(trackedTrack)
        }
    }

    fun getTrackedTrack(userId: Long, trackId: Long) = trackedTrackRepository.findByUserIdAndTrackId(userId, trackId)
    fun getUserTrackedTracks(userId: Long) = trackedTrackRepository.findByUserId(userId)
    fun getRecentTrackedTracks(userId: Long) = trackedTrackRepository.findTopByUserIdOrderByTrackedAtDesc(userId)
} 