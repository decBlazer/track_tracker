import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/reusable/NavBar';
import SearchBar from '../components/reusable/SearchBar';
import SongCard from '../components/reusable/SongCard';
import LoadingSpinner from '../components/reusable/LoadingSpinner';
import { trackAPI } from '../services/api';

const HomePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRandomSongs();
  }, []);

  const fetchRandomSongs = async () => {
    try {
      setLoading(true);
      const response = await trackAPI.getRandomSongs();
      setSongs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch songs. Please try again later.');
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleRate = async (songId, rating) => {
    try {
      // This will be implemented when we add rating functionality
      setSnackbar({
        open: true,
        message: `Rated song with ${rating} stars!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to rate song. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #1db954, #1ed760)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Welcome to Track Tracker!
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Discover, track, and rate your favorite music
          </Typography>
          
          <SearchBar onSearch={handleSearch} />
        </Box>

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner message="Loading your music..." />
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ mb: 4, textAlign: 'center' }}
            >
              Discover New Music
            </Typography>
            
            <Grid container spacing={3}>
              {songs.map((song) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={song.id}>
                  <SongCard 
                    song={song} 
                    onRate={handleRate}
                    onClick={() => navigate(`/song/${song.id}`)}
                  />
                </Grid>
              ))}
            </Grid>

            {songs.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary">
                  No songs available at the moment.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try searching for your favorite tracks!
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
