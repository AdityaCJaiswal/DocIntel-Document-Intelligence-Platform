import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle } from 'lucide-react';

const FileUpload = ({ onFileUpload, accept = '.pdf,.doc,.docx,.txt' }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        await onFileUpload(file);
        setUploadedFiles(prev => [...prev, { file, status: 'success' }]);
      } catch (error) {
        setUploadedFiles(prev => [...prev, { file, status: 'error', error: error.message }]);
      }
    }
    
    setUploading(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drag and drop your file here
        </h3>
        <p className="text-gray-600 mb-4">
          We accept .pdf, .docx, .pptx and .key files
        </p>
        <button
          type="button"
          className="btn-secondary"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Browse files'}
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {item.status === 'error' && (
                  <span className="text-xs text-red-500">{item.error}</span>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;