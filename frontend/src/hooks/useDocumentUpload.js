import { useState } from 'react';
import { documentAPI } from '../services/api';
import { useDocuments } from '../context/DocumentContext';

export const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { dispatch } = useDocuments();

  const uploadDocument = async (file) => {
    setUploading(true);
    setProgress(0);

    try {
      const response = await documentAPI.uploadDocument(file);
      dispatch({ type: 'ADD_DOCUMENT', payload: response.data });
      setProgress(100);
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to upload document' 
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
    progress
  };
};
