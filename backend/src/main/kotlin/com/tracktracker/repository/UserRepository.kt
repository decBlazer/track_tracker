package com.tracktracker.repository

import com.tracktracker.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): Optional<User>
    fun findByEmail(email: String): Optional<User>
    fun findBySpotifyId(spotifyId: String): User?
    fun existsByUsername(username: String): Boolean
    fun existsByEmail(email: String): Boolean
} 