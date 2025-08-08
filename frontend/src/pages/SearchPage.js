import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/reusable/NavBar';
import SearchBar from '../components/reusable/SearchBar';
import SongCard from '../components/reusable/SongCard';
import LoadingSpinner from '../components/reusable/LoadingSpinner';
import { trackAPI, ratingAPI, trackedTrackAPI } from '../services/api';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const response = await trackAPI.searchTracks(searchQuery);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search for tracks. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    navigate(`/search?query=${encodeURIComponent(newQuery)}`);
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
        message: 'Failed to rate track. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleTrack = async (trackId, isTracked) => {
    try {
      if (isTracked) {
        await trackedTrackAPI.untrackSong(trackId);
        setSnackbar({
          open: true,
          message: 'Track removed from your collection',
          severity: 'success'
        });
      } else {
        await trackedTrackAPI.trackSong(trackId);
        setSnackbar({
          open: true,
          message: 'Track added to your collection',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update track collection',
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

  const filteredResults = () => {
    switch (activeTab) {
      case 0: // All results
        return searchResults;
      case 1: // Songs only
        return searchResults.filter(track => track.type === 'song');
      case 2: // Artists only
        return searchResults.filter(track => track.type === 'artist');
      case 3: // Albums only
        return searchResults.filter(track => track.type === 'album');
      default:
        return searchResults;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
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
            }}
          >
            Search Results
          </Typography>
          
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for tracks, artists, or albums..."
            fullWidth={false}
          />
        </Box>

        {/* Search Query Display */}
        {query && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Results for "{query}"
            </Typography>
            <Chip
              label={`${searchResults.length} results found`}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner message="Searching for tracks..." />
        ) : searchResults.length > 0 ? (
          <>
            {/* Filter Tabs */}
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
                <Tab label={`All (${searchResults.length})`} />
                <Tab label={`Songs (${searchResults.filter(t => t.type === 'song').length})`} />
                <Tab label={`Artists (${searchResults.filter(t => t.type === 'artist').length})`} />
                <Tab label={`Albums (${searchResults.filter(t => t.type === 'album').length})`} />
              </Tabs>
            </Box>

            {/* Results Grid */}
            <Grid container spacing={3}>
              {filteredResults().map((track) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
                  <SongCard
                    song={track}
                    onRate={handleRate}
                    onTrack={handleTrack}
                    onClick={() => navigate(`/song/${track.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : query ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No results found for "{query}"
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try searching with different keywords or check your spelling.
            </Typography>
          </Box>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Start your search
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Use the search bar above to find your favorite tracks, artists, or albums.
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

export default SearchPage;