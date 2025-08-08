package com.tracktracker.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "tracks")
data class Track(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val title: String,

    @Column(nullable = false)
    val artist: String,

    @Column
    val album: String? = null,

    @Column(name = "release_year")
    val releaseYear: Int? = null,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "track", cascade = [CascadeType.ALL])
    val ratings: MutableList<Rating> = mutableListOf()
) 