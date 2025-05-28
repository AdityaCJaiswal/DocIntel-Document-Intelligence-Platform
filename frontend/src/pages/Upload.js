import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

export default function Upload() {
  const navigate = useNavigate();
  const { uploadDocument, uploading } = useDocumentUpload();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const handleFileUpload = async (file) => {
    try {
      const document = await uploadDocument(file);
      setUploadedDoc(document);
      setUploadSuccess(true);
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upload Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your document "{uploadedDoc?.title || uploadedDoc?.filename}" has been uploaded successfully.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(`/document/${uploadedDoc?.id}`)}
              className="btn-secondary"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upload a document</h1>
          <p className="text-gray-600 dark:text-gray-100 mt-1">
            We accept .pdf, .docx, .pptx and .key files
          </p>
        </div>
      </div>

      {/* Upload Component */}
      <div className="card">
        <FileUpload 
          onFileUpload={handleFileUpload}
          disabled={uploading}
        />
      </div>

      {/* Button Links */}
      <div className="flex justify-between items-center mt-6">
        <Link
          to="/library"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
        >
          View all Uploaded Document
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};