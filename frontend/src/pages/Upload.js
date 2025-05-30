import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

export default function Upload() {
  const navigate = useNavigate();
  const { uploadDocument, uploading } = useDocumentUpload();

  const handleFileUpload = async (file) => {
    try {
      const document = await uploadDocument(file);
      if (document?.id) {
        // ✅ Redirect to chat page with document ID after successful upload
        navigate(`/chat?doc=${document.id}`);
      } else {
        alert("Upload succeeded but no document ID returned.");
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert("Upload failed. Please check console for details.");
    }
  };

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
            We accept .pdf, .docx, .pptx, and .key files
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
    </div>
  );
}
