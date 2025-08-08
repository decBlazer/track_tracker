package com.tracktracker.repository

import com.tracktracker.model.Track
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface TrackRepository : JpaRepository<Track, Long> {
    fun findByTitleContainingIgnoreCase(title: String): List<Track>
    fun findByArtistContainingIgnoreCase(artist: String): List<Track>
    fun findByAlbumContainingIgnoreCase(album: String): List<Track>
    
    @Query("SELECT t FROM Track t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.artist) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.album) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun searchTracks(query: String): List<Track>

    @Query(value = "SELECT * FROM tracks ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    fun findRandomTracks(limit: Int): List<Track>
} 