import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleTrackedClick = () => {
    handleMenuClose();
    navigate('/tracked');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Home */}
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              cursor: 'pointer',
              fontWeight: 700,
              color: '#1db954'
            }}
            onClick={() => navigate('/')}
          >
            Track Tracker
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 4 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search for tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '& fieldset': { border: 'none' },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
          </form>
        </Box>

        {/* Navigation and User Menu */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ 
              color: location.pathname === '/' ? '#1db954' : 'white',
              '&:hover': { color: '#1db954' }
            }}
          >
            <HomeIcon />
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleTrackedClick}
                sx={{ 
                  color: location.pathname === '/tracked' ? '#1db954' : 'white',
                  '&:hover': { color: '#1db954' }
                }}
              >
                <FavoriteIcon />
              </IconButton>
              
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: 'white' }}
              >
                <Avatar
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#1db954',
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#203a43',
                    border: '1px solid rgba(255,255,255,0.1)',
                    mt: 1,
                  },
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleTrackedClick}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  My Tracks
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/signin')}
              sx={{
                borderColor: '#1db954',
                color: '#1db954',
                '&:hover': {
                  borderColor: '#1ed760',
                  backgroundColor: 'rgba(29, 185, 84, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
