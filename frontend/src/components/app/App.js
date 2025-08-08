import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../../theme/theme';
import { AuthProvider } from '../../contexts/AuthContext';

// Pages
import HomePage from '../../pages/HomePage';
import SearchPage from '../../pages/SearchPage';
import SignInPage from '../../pages/Account/SignInPage';
import SignUpPage from '../../pages/Account/SignUpPage';
import SongDetailPage from '../../pages/SongDetailPage';
import ProfilePage from '../../pages/Account/ProfilePage';
import TrackedTracksPage from '../../pages/TrackedTracksPage';

// Components
import ProtectedRoute from '../reusable/ProtectedRoute';
import LoadingSpinner from '../reusable/LoadingSpinner';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/song/:songId" element={<SongDetailPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tracked" 
              element={
                <ProtectedRoute>
                  <TrackedTracksPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;