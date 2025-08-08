import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import {
  MusicNote as MusicIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/reusable/NavBar';

const SignUpPage = () => {
  const { login } = useAuth();

  const handleSpotifySignUp = () => {
    login();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      
      <Container maxWidth="sm" sx={{ py: 8 }}>
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
            Join Track Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Create your account and start tracking your favorite music
          </Typography>
        </Box>

        <Card sx={{ p: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              We use Spotify OAuth for secure authentication. No password required!
            </Alert>

            {/* Spotify OAuth Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<MusicIcon />}
              onClick={handleSpotifySignUp}
              sx={{
                bgcolor: '#1db954',
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 3,
                '&:hover': {
                  bgcolor: '#1ed760',
                },
              }}
            >
              Sign Up with Spotify
            </Button>

            {/* Benefits Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1db954' }}>
                Why sign up with Spotify?
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Seamless integration with your Spotify account
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Import your existing playlists and favorites
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Discover new music based on your taste
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Track and rate songs with ease
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Secure authentication - no passwords to remember
                </Typography>
              </Box>
            </Box>

            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  style={{
                    color: '#1db954',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage;