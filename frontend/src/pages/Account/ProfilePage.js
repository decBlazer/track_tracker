import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  MusicNote as MusicIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/reusable/LoadingSpinner';
import NavBar from '../../components/reusable/NavBar';

const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load user statistics');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <LoadingSpinner message="Loading your profile..." />
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
            mb: 4,
          }}
        >
          Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* User Info Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#1db954',
                    fontSize: '3rem',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                
                <Typography variant="h5" component="h2" gutterBottom>
                  {user?.username || 'User'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email || 'No email provided'}
                </Typography>

                <Chip
                  label="Active User"
                  color="primary"
                  sx={{ mt: 2 }}
                />

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <FavoriteIcon sx={{ fontSize: 40, color: '#ff6b35', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      {stats?.trackedTracksCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tracked Songs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <StarIcon sx={{ fontSize: 40, color: '#ffd700', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      {stats?.totalRatings || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Songs Rated
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <MusicIcon sx={{ fontSize: 40, color: '#1db954', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      {stats?.favoriteGenres?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Favorite Genres
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <PersonIcon sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      {stats?.memberSinceDays || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days as Member
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {stats?.recentActivity?.length > 0 ? (
                  <List>
                    {stats.recentActivity.map((activity, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          {activity.type === 'rating' && <StarIcon color="warning" />}
                          {activity.type === 'track' && <FavoriteIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.description}
                          secondary={new Date(activity.timestamp).toLocaleDateString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    No recent activity. Start exploring music!
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Favorite Genres */}
            {stats?.favoriteGenres?.length > 0 && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Favorite Genres
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {stats.favoriteGenres.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage; 