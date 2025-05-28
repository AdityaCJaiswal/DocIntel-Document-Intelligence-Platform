import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Hash, ExternalLink } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import LoadingSpinner from '../components/LoadingSpinner';
import { documentAPI } from '../services/api';
import { useChat } from '../hooks/useChat';

const DocumentChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { messages, sendMessage, loading: chatLoading } = useChat(id);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const response = await documentAPI.getDocument(id);
      setDocument(response.data);
    } catch (err) {
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading document..." />;
  }

  if (error || !document) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Document not found
        </h3>
        <p className="text-gray-600 mb-6">
          The document you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Document Info Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Document Details</h2>
        </div>

        <div className="space-y-6">
          {/* Document Title */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {document.title || document.filename}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {document.file_type?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Uploaded</p>
                <p className="text-gray-900">{formatDate(document.uploaded_at)}</p>
              </div>
            </div>

            {document.pages && (
              <div className="flex items-center space-x-3 text-sm">
                <Hash className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Pages</p>
                  <p className="text-gray-900">{document.pages}</p>
                </div>
              </div>
            )}

            {document.file_size && (
              <div className="flex items-center space-x-3 text-sm">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="text-gray-900">
                    {(document.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Example Questions */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Example Questions</h4>
            <div className="space-y-2">
              {[
                "What is this document about?",
                "Summarize the main points",
                "What are the key findings?",
                "Who is the CEO of Amazon?",
                "What is the capital of Spain?",
                "How does the internet work?"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  className="w-full text-left p-2 text-xs text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                  disabled={chatLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-gray-50">
        <div className="h-full bg-white">
          <ChatInterface
            documentId={id}
            messages={messages}
            onSendMessage={sendMessage}
            loading={chatLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;