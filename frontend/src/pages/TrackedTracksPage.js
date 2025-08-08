import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { trackedTrackAPI, ratingAPI } from '../services/api';
import LoadingSpinner from '../components/reusable/LoadingSpinner';
import NavBar from '../components/reusable/NavBar';
import SongCard from '../components/reusable/SongCard';

const TrackedTracksPage = () => {
  const { isAuthenticated } = useAuth();
  const [trackedTracks, setTrackedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrackedTracks();
    }
  }, [isAuthenticated]);

  const fetchTrackedTracks = async () => {
    try {
      setLoading(true);
      const response = await trackedTrackAPI.getTrackedTracks();
      setTrackedTracks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tracked tracks');
      console.error('Error fetching tracked tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUntrack = async (trackId) => {
    try {
      await trackedTrackAPI.untrackSong(trackId);
      setTrackedTracks(prev => prev.filter(track => track.id !== trackId));
      setSnackbar({
        open: true,
        message: 'Track removed from your collection',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove track',
        severity: 'error'
      });
    }
  };

  const handleRate = async (trackId, rating) => {
    try {
      await ratingAPI.rateTrack(trackId, rating);
      setSnackbar({
        open: true,
        message: `Rated track with ${rating} stars!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to rate track',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredTracks = () => {
    switch (activeTab) {
      case 0: // All tracks
        return trackedTracks;
      case 1: // Recently added
        return trackedTracks
          .sort((a, b) => new Date(b.trackedAt) - new Date(a.trackedAt))
          .slice(0, 10);
      case 2: // Highly rated
        return trackedTracks
          .filter(track => track.userRating >= 4)
          .sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
      default:
        return trackedTracks;
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="info">
            Please sign in to view your tracked tracks.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <LoadingSpinner message="Loading your tracked tracks..." />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
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
          My Tracked Tracks
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            {trackedTracks.length} tracks in your collection
          </Typography>
          <Chip
            label={`${trackedTracks.filter(t => t.userRating > 0).length} rated`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs for filtering */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#1db954',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1db954',
              },
            }}
          >
            <Tab label={`All (${trackedTracks.length})`} />
            <Tab label="Recently Added" />
            <Tab label="Highly Rated" />
          </Tabs>
        </Box>

        {/* Tracks Grid */}
        {filteredTracks().length > 0 ? (
          <Grid container spacing={3}>
            {filteredTracks().map((track) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
                <SongCard
                  song={track}
                  onRate={handleRate}
                  onTrack={handleUntrack}
                  onClick={() => window.open(`/song/${track.id}`, '_blank')}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {activeTab === 0 ? 'No tracked tracks yet' : 'No tracks match this filter'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeTab === 0 
                ? 'Start exploring music and track your favorite songs!'
                : 'Try a different filter or add more tracks to your collection.'
              }
            </Typography>
          </Box>
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

export default TrackedTracksPage; 