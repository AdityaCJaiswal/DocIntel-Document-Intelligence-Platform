import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDocuments } from '../context/DocumentContext';
import { documentAPI } from '../services/api';

const Dashboard = () => {
  const { state, dispatch } = useDocuments();
  const { documents, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await documentAPI.getAllDocuments();
      dispatch({ type: 'SET_DOCUMENTS', payload: response.data });
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to load documents' 
      });
    }
  };

  const filteredDocuments = documents
    .filter(doc => 
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.uploaded_at) - new Date(a.uploaded_at);
      }
      return a.title?.localeCompare(b.title) || 0;
    });

  if (loading) {
    return <LoadingSpinner text="Loading documents..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to DocSense</h1>
          <p className="text-gray-600 mt-1">
            Here's a list of your documents. You can search, filter, and sort the list to find the document you want.
          </p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All documents</h2>
          <span className="text-sm text-gray-500">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && (
              <Link to="/upload" className="btn-primary">
                Upload Document
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;