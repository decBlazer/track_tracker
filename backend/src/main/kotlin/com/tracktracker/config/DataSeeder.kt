package com.tracktracker.config

import com.tracktracker.repository.TrackRepository
import com.tracktracker.model.Track
import com.tracktracker.service.SpotifyImportService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
import java.util.Random

@Component
class DataSeeder(
    private val trackRepository: TrackRepository,
    private val spotifyImportService: SpotifyImportService,
    @Value("\${TRACK_SEED_SIZE:50}") private val seedSize: Int
) : ApplicationRunner {

    private val log = LoggerFactory.getLogger(DataSeeder::class.java)

    override fun run(args: ApplicationArguments?) {
        val existing = trackRepository.count()
        if (existing == 0L) {
            val imported = try {
                log.info("No tracks found in DB. Auto-seeding $seedSize random tracks from Spotify ...")
                spotifyImportService.importRandomTracks(seedSize)
            } catch (ex: IllegalStateException) {
                log.warn("Spotify credentials missing; skipping auto-seed. {}", ex.message)
                emptyList()
            }
            if (imported.isNotEmpty()) {
                log.info("Imported {} tracks from Spotify", imported.size)
            } else if (existing == 0L) {
                // Fallback: generate dummy tracks so UI has something to show
                val dummy = generateDummyTracks(seedSize)
                trackRepository.saveAll(dummy)
                log.info("Generated {} placeholder tracks", dummy.size)
            }
        } else {
            log.info("Database already contains $existing tracks. Skipping auto-seed.")
        }
    }

    private fun generateDummyTracks(n: Int): List<Track> {
        val rand = Random()
        val genres = listOf("Rock", "Pop", "Hip Hop", "Jazz", "Indie")
        return (1..n).map {
            val num = rand.nextInt(1000)
            Track(
                title = "Sample Song $num",
                artist = "Artist ${('A' + rand.nextInt(26))}",
                album = "${genres[rand.nextInt(genres.size)]} Hits",
                releaseYear = 2000 + rand.nextInt(25)
            )
        }
    }
} 