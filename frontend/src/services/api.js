import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Document API endpoints
export const documentAPI = {
  // Get all documents
  getAllDocuments: () => api.get('/documents/'),
  
  // Get single document
  getDocument: (id) => api.get(`/documents/${id}/`),
  
  // Upload document
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete document
  deleteDocument: (id) => api.delete(`/documents/${id}/`),
  
  // Ask question about document
  askQuestion: (documentId, question) => 
    api.post(`/documents/${documentId}/ask/`, { question }),
  
  // Get chat history
  getChatHistory: (documentId) => api.get(`/documents/${documentId}/chat/`),
};

export default api;