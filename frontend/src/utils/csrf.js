import axios from 'axios';

// Call this once on app load
export const getCSRFToken = async () => {
  try {
    await axios.get('http://localhost:8000/api/csrf/', {
      withCredentials: true,
    });
    console.log('[CSRF] Cookie set.');
  } catch (error) {
    console.error('[CSRF] Failed to set cookie:', error);
  }
};
