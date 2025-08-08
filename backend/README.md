# Track Tracker Backend

A Spring Boot backend for tracking and rating music tracks with Spotify integration.

## Prerequisites

- Java 21
- PostgreSQL 15+
- Spotify Developer Account

## Setup

1. **Database Setup**
   ```bash
   # Run the database setup script
   ./scripts/setup-db.sh
   ```

2. **Environment Variables**
   Create a `.env` file in the project root with the following variables:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/tracktracker
   SPRING_DATASOURCE_USERNAME=tracktracker
   SPRING_DATASOURCE_PASSWORD=tracktracker
   ```

3. **Build and Run**
   ```bash
   # Build the project
   ./gradlew build

   # Run the application
   ./gradlew bootRun
   ```

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `GET /api/users/{id}` - Get user details

### Track Management
- `GET /api/tracks/search/name` - Search tracks by name
- `GET /api/tracks/search/artist` - Search tracks by artist
- `GET /api/tracks/{id}` - Get track details

### Rating Management
- `POST /api/ratings` - Create/update rating
- `GET /api/ratings/user/{userId}/track/{trackId}` - Get user's rating for a track
- `GET /api/ratings/track/{trackId}` - Get all ratings for a track
- `GET /api/ratings/user/{userId}` - Get all ratings by a user

### Track Tracking
- `POST /api/tracked` - Track a track
- `POST /api/tracked/{userId}/track/{trackId}/play` - Increment play count
- `GET /api/tracked/user/{userId}` - Get user's tracked tracks
- `GET /api/tracked/user/{userId}/recent` - Get user's recently tracked tracks

### Spotify Integration
- `GET /api/spotify/search` - Search tracks on Spotify
- `GET /api/spotify/tracks/{spotifyId}` - Get track details from Spotify
- `GET /api/spotify/tracks/{spotifyId}/features` - Get track audio features

## Development

### Running Tests
```bash
./gradlew test
```

### Database Migrations
The project uses Flyway for database migrations. Migrations are located in `src/main/resources/db/migration/`.

To create a new migration:
1. Create a new SQL file in the migrations directory
2. Name it following the pattern: `V{version}__{description}.sql`
3. Add your SQL statements

### Spotify Integration
To set up Spotify integration:
1. Create a Spotify Developer account at https://developer.spotify.com/dashboard
2. Create a new application
3. Get the Client ID and Client Secret
4. Set the redirect URI to `http://localhost:8080/api/login/oauth2/code/spotify`
5. Add the credentials to your environment variables 