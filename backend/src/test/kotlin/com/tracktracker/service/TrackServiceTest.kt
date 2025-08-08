package com.tracktracker.service

import com.tracktracker.model.Track
import com.tracktracker.repository.TrackRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoExtension
import java.util.Optional
import org.junit.jupiter.api.Assertions.*

@ExtendWith(MockitoExtension::class)
class TrackServiceTest {
    @Mock
    private lateinit var trackRepository: TrackRepository

    @InjectMocks
    private lateinit var trackService: TrackService

    @Test
    fun `createTrack should save and return track`() {
        // Given
        val title = "Test Track"
        val artist = "Test Artist"
        val album = "Test Album"
        val releaseYear = 2023

        val expectedTrack = Track(
            title = title,
            artist = artist,
            album = album,
            releaseYear = releaseYear
        )

        `when`(trackRepository.save(any())).thenReturn(expectedTrack)

        // When
        val result = trackService.createTrack(title, artist, album, releaseYear)

        // Then
        assertNotNull(result)
        assertEquals(title, result.title)
        assertEquals(artist, result.artist)
        assertEquals(album, result.album)
        assertEquals(releaseYear, result.releaseYear)
    }

    @Test
    fun `findByTitle should return tracks when exists`() {
        // Given
        val title = "Test Track"
        val expectedTracks = listOf(
            Track(title = title, artist = "Test Artist")
        )

        `when`(trackRepository.findByTitleContainingIgnoreCase(title)).thenReturn(expectedTracks)

        // When
        val result = trackService.findByTitle(title)

        // Then
        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(title, result[0].title)
    }

    @Test
    fun `findByTitle should return empty list when no tracks found`() {
        // Given
        val title = "nonexistent"
        `when`(trackRepository.findByTitleContainingIgnoreCase(title)).thenReturn(emptyList())

        // When
        val result = trackService.findByTitle(title)

        // Then
        assertTrue(result.isEmpty())
    }
} 