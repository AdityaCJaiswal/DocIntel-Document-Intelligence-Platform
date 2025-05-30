import axios from 'axios';
import { useEffect } from 'react';

export const useCsrf = () => {
  useEffect(() => {
    axios.get('http://localhost:8000/api/csrf/', { withCredentials: true })
      .then(() => console.log("CSRF cookie loaded"))
      .catch(err => console.error("Failed to fetch CSRF cookie:", err));
  }, []);
};
