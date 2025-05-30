// src/pages/Upload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function Upload() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/documents/upload/', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { id } = response.data;
      navigate(`/chat?doc=${id}`);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Make sure CSRF and CORS settings are correct.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-white">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-gray-600">
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Upload a Document</h1>
          <p className="text-sm text-gray-500">Accepted formats: PDF, DOCX, TXT</p>
        </div>
      </div>

      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full mb-4"
      />

      {uploading && <p className="text-blue-500">Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
