import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true, // Important for OAuth2 cookies
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: () => window.location.href = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/oauth2/authorization/spotify`,
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/users/me'),
  register: (userData) => api.post('/users/register', userData),
};

// Track API
export const trackAPI = {
  getRandomSongs: () => api.get('/tracks/random'),
  searchTracks: (query) => api.get(`/tracks/search?query=${encodeURIComponent(query)}`),
  getTrackById: (id) => api.get(`/tracks/${id}`),
  createTrack: (trackData) => api.post('/tracks', trackData),
  updateTrack: (id, trackData) => api.put(`/tracks/${id}`, trackData),
  deleteTrack: (id) => api.delete(`/tracks/${id}`),
};

// Rating API
export const ratingAPI = {
  rateTrack: (trackId, rating) => api.post(`/tracks/${trackId}/rate`, { rating }),
  getUserRating: (trackId) => api.get(`/tracks/${trackId}/rating`),
  getTrackRatings: (trackId) => api.get(`/tracks/${trackId}/ratings`),
};

// Tracked Track API
export const trackedTrackAPI = {
  trackSong: (trackId) => api.post(`/tracks/${trackId}/track`),
  untrackSong: (trackId) => api.delete(`/tracks/${trackId}/track`),
  getTrackedTracks: () => api.get('/tracks/tracked'),
  isTracked: (trackId) => api.get(`/tracks/${trackId}/tracked`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUserStats: () => api.get('/users/stats'),
};

export default api; 