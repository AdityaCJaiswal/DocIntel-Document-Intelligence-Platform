import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Upload, 
  FolderOpen, 
  Clock, 
  FileCheck,
  TrendingUp,
  Calendar,
  BarChart3,
  Zap,
  Bot,
  Brain,
  Sparkles
} from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDocuments } from '../context/DocumentContext';
import { documentAPI } from '../services/api';

const Dashboard = () => {
  const { state, dispatch } = useDocuments();
  const { documents, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [view, setView] = useState('grid'); // 'grid' or 'list'

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

  // Calculate stats
  const totalDocuments = documents.length;
  const recentDocuments = documents.filter(doc => {
    const uploadDate = new Date(doc.uploaded_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  const totalPages = documents.reduce((sum, doc) => sum + (doc.pages || 0), 0);

  if (loading) {
    return <LoadingSpinner text="Loading your document intelligence platform..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              DocIntel Intelligence
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your documents into intelligent conversations. Upload, analyze, and interact with your content using AI-powered insights.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Upload Action */}
          <Link to="/upload" className="group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Upload New Document</h3>
                  <p className="text-blue-100">Add documents to your intelligence library</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <Sparkles className="h-5 w-5" />
                <span>AI-powered processing</span>
              </div>
            </div>
          </Link>

          {/* Library Action */}
          <div className="group cursor-pointer" onClick={() => document.getElementById('documents-section').scrollIntoView({ behavior: 'smooth' })}>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Browse Library</h3>
                  <p className="text-purple-100">Explore your document collection</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-purple-100">
                <Bot className="h-5 w-5" />
                <span>{totalDocuments} documents ready for AI chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDocuments}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentDocuments}</p>
                <p className="text-gray-600 dark:text-gray-400">This Week</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPages.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Pages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div id="documents-section" className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            
            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Document Library</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage and interact with your intelligent document collection</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Documents Grid/List */}
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mb-6">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {searchTerm ? 'No documents found' : 'Your intelligent library awaits'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search terms or explore different keywords'
                    : 'Upload your first document and start having intelligent conversations with your content'
                  }
                </p>
                {!searchTerm && (
                  <Link to="/upload" className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                    <Plus className="h-5 w-5" />
                    <span>Upload Your First Document</span>
                    <Zap className="h-5 w-5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} ready for AI interaction
                    </span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {filteredDocuments.map((document) => (
                    <EnhancedDocumentCard key={document.id} document={document} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Document Card Component
const EnhancedDocumentCard = ({ document }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileTypeIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case 'docx':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'txt':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="group bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800 dark:group-hover:to-indigo-800 transition-colors">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {document.title || document.filename}
              </h3>
              {getFileTypeIcon(document.filename)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(document.uploaded_at)}</span>
              </div>
              
              {document.pages && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>{document.pages} pages</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Ready for AI chat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/chat?doc=${document.id}`}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Bot className="h-5 w-5" />
            <span>Chat with AI</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;