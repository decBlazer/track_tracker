package com.tracktracker.service

import com.tracktracker.model.Track
import com.tracktracker.repository.TrackRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

@Service
class TrackService(private val trackRepository: TrackRepository) {
    @Transactional
    fun createTrack(title: String, artist: String, album: String? = null, releaseYear: Int? = null): Track {
        val track = Track(
            title = title,
            artist = artist,
            album = album,
            releaseYear = releaseYear
        )
        return trackRepository.save(track)
    }

    fun findByTitle(title: String): List<Track> = trackRepository.findByTitleContainingIgnoreCase(title)
    fun findByArtist(artist: String): List<Track> = trackRepository.findByArtistContainingIgnoreCase(artist)
    fun findByAlbum(album: String): List<Track> = trackRepository.findByAlbumContainingIgnoreCase(album)
    fun findById(id: Long): Optional<Track> = trackRepository.findById(id)
    fun searchTracks(query: String): List<Track> = trackRepository.searchTracks(query)

    fun getRandomTracks(limit: Int = 10): List<Track> = trackRepository.findRandomTracks(limit)
} 