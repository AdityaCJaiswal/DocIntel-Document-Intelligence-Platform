import { useState } from 'react';
import axios from 'axios';
import { useDocuments } from '../context/DocumentContext';
import Cookies from 'js-cookie'; // ✅ npm install js-cookie


export const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { dispatch } = useDocuments();

  const uploadDocument = async (file) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/documents/upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': Cookies.get('csrftoken'), 
          },
          withCredentials: true, // ✅ Required for CSRF cookies
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        }
      );

      dispatch({ type: 'ADD_DOCUMENT', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to upload document',
      });
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadDocument,
    uploading,
    progress,
  };
};
