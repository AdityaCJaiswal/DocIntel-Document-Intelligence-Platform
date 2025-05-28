import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

const Upload = () => {
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload a document</h1>
          <p className="text-gray-600 mt-1">
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

      {/* Cancel Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
          disabled={uploading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Upload;