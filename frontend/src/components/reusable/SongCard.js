import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Rating,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MusicNote as MusicIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SongCard = ({ song, onRate, onClick, onTrack }) => {
  const { isAuthenticated } = useAuth();
  const [isTracked, setIsTracked] = useState(song.tracked || false);
  const [userRating, setUserRating] = useState(song.userRating || 0);

  const handleTrackToggle = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Show login prompt or redirect
      return;
    }
    
    setIsTracked(!isTracked);
    if (onTrack) {
      onTrack(song.id, !isTracked);
    }
  };

  const handleRate = (e, newValue) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }
    
    setUserRating(newValue);
    if (onRate) {
      onRate(song.id, newValue);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        },
      }}
      onClick={handleCardClick}
    >
      {/* Album Art Placeholder */}
      <Box
        sx={{
          height: 200,
          background: 'linear-gradient(135deg, #1db954, #1ed760)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <MusicIcon sx={{ fontSize: 60, color: 'white' }} />
        
        {/* Play Button Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
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

        {/* Track Button */}
        {isAuthenticated && (
          <Tooltip title={isTracked ? 'Untrack' : 'Track'}>
            <IconButton
              onClick={handleTrackToggle}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: isTracked ? '#ff6b35' : 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              {isTracked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {song.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {song.artist}
        </Typography>

        {song.album && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 1,
            }}
          >
            {song.album}
          </Typography>
        )}

        {song.releaseYear && (
          <Chip
            label={song.releaseYear}
            size="small"
            sx={{
              bgcolor: 'rgba(29, 185, 84, 0.2)',
              color: '#1db954',
              fontSize: '0.7rem',
              mb: 1,
            }}
          />
        )}

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Rating
            value={userRating}
            onChange={handleRate}
            size="small"
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
          {song.averageRating && (
            <Typography variant="caption" color="text.secondary">
              ({song.averageRating.toFixed(1)})
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="caption" color="text.secondary">
            {song.genre || 'Unknown Genre'}
          </Typography>
          {song.duration && (
            <Typography variant="caption" color="text.secondary">
              {formatDuration(song.duration)}
            </Typography>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default SongCard;