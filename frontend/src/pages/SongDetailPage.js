import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
  Chip,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MusicNote as MusicIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trackAPI, ratingAPI, trackedTrackAPI } from '../services/api';
import LoadingSpinner from '../components/reusable/LoadingSpinner';
import NavBar from '../components/reusable/NavBar';

const SongDetailPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isTracked, setIsTracked] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchSongDetails();
  }, [songId]);

  const fetchSongDetails = async () => {
    try {
      setLoading(true);
      const [songResponse, ratingResponse, trackedResponse] = await Promise.allSettled([
        trackAPI.getTrackById(songId),
        ratingAPI.getUserRating(songId),
        trackedTrackAPI.isTracked(songId)
      ]);

      if (songResponse.status === 'fulfilled') {
        setSong(songResponse.value.data);
      } else {
        throw new Error('Failed to fetch song details');
      }

      if (ratingResponse.status === 'fulfilled') {
        setUserRating(ratingResponse.value.data.rating || 0);
        setAverageRating(ratingResponse.value.data.averageRating || 0);
      }

      if (trackedResponse.status === 'fulfilled') {
        setIsTracked(trackedResponse.value.data.tracked || false);
      }
    } catch (err) {
      setError('Failed to fetch song details');
      console.error('Error fetching song details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (newRating) => {
    if (!isAuthenticated) {
      // Show login prompt
      return;
    }

    try {
      await ratingAPI.rateTrack(songId, newRating);
      setUserRating(newRating);
      // Optionally refresh average rating
    } catch (error) {
      console.error('Error rating track:', error);
    }
  };

  const handleTrackToggle = async () => {
    if (!isAuthenticated) {
      // Show login prompt
      return;
    }

    try {
      if (isTracked) {
        await trackedTrackAPI.untrackSong(songId);
        setIsTracked(false);
      } else {
        await trackedTrackAPI.trackSong(songId);
        setIsTracked(true);
      }
    } catch (error) {
      console.error('Error toggling track:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: song?.title,
        text: `Check out "${song?.title}" by ${song?.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <LoadingSpinner message="Loading song details..." />
      </Box>
    );
  }

  if (error || !song) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            {error || 'Song not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Grid container spacing={4}>
          {/* Album Art Section */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  height: 400,
                  background: 'linear-gradient(135deg, #1db954, #1ed760)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <MusicIcon sx={{ fontSize: 80, color: 'white' }} />
                
                {/* Play Button Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.8)',
                      },
                    }}
                  >
                    <PlayIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Song Details Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                      {song.title}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                      {song.artist}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={isTracked ? 'Untrack' : 'Track'}>
                      <IconButton
                        onClick={handleTrackToggle}
                        sx={{
                          color: isTracked ? '#ff6b35' : 'text.secondary',
                        }}
                      >
                        {isTracked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Share">
                      <IconButton onClick={handleShare}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Album Info */}
                {song.album && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Album
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {song.album}
                    </Typography>
                  </Box>
                )}

                {/* Release Year */}
                {song.releaseYear && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Release Year
                    </Typography>
                    <Chip label={song.releaseYear} color="primary" variant="outlined" />
                  </Box>
                )}

                {/* Genre */}
                {song.genre && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Genre
                    </Typography>
                    <Chip label={song.genre} color="secondary" variant="outlined" />
                  </Box>
                )}

                {/* Duration */}
                {song.duration && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Duration
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {formatDuration(song.duration)}
                    </Typography>
                  </Box>
                )}

                {/* Popularity */}
                {song.popularity !== undefined && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Popularity
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={song.popularity}
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#1db954',
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {song.popularity}%
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Rating Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Rate this track
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      value={userRating}
                      onChange={(event, newValue) => handleRate(newValue)}
                      size="large"
                      readOnly={!isAuthenticated}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#ff6b35',
                        },
                        '& .MuiRating-iconHover': {
                          color: '#ff6b35',
                        },
                      }}
                    />
                    {averageRating > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Average: {averageRating.toFixed(1)}/5
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Additional Info */}
                {song.description && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {song.description}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default SongDetailPage;
