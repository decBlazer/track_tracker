package com.tracktracker.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "tracked_tracks")
data class TrackedTrack(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne
    @JoinColumn(name = "track_id", nullable = false)
    val track: Track,

    @Column(name = "tracked_at")
    val trackedAt: LocalDateTime = LocalDateTime.now(),

    @Column
    val notes: String? = null,

    @Column(name = "play_count")
    var playCount: Int = 0
) 