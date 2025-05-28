import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Eye, MessageCircle } from 'lucide-react';

const DocumentCard = ({ document }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileType) => {
    return <FileText className="h-6 w-6 text-blue-600" />;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getFileIcon(document.file_type)}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {document.title || document.filename}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {document.file_type} • {document.pages} pages
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(document.uploaded_at)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/document/${document.id}`}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            <span>Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;