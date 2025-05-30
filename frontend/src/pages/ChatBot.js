import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  FileText, 
  MessageSquare, 
  Loader2, 
  Maximize2, 
  Minimize2,
  Copy,
  CheckCircle,
  User,
  Bot
} from 'lucide-react';
import axios from 'axios';

export default function EnhancedChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const docId = new URLSearchParams(location.search).get('doc');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // State management
  const [document, setDocument] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [highlightIndexes, setHighlightIndexes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [error, setError] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(true);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load document and chat data
  useEffect(() => {
    if (!docId) {
      navigate('/library');
      return;
    }

    const loadDocumentData = async () => {
      try {
        setDocumentLoading(true);
        setError(null);

        // Load document details
        const docResponse = await axios.get(`http://localhost:8000/api/documents/${docId}/`);
        setDocument(docResponse.data);

        // Load document chunks
        const chunksResponse = await axios.get(`http://localhost:8000/api/documents/${docId}/chunks/`);
        setChunks(chunksResponse.data.map(c => c.content));

        // Load chat history
        const historyResponse = await axios.get(`http://localhost:8000/api/documents/${docId}/chat-history/`);
        if (historyResponse.data.length > 0) {
          const latestSession = historyResponse.data[0];
          setSessionId(latestSession.session_id);
          const loadedMessages = latestSession.messages.flatMap((msg, index) => [
            { 
              id: `q-${index}`,
              user: true, 
              text: msg.question,
              timestamp: new Date(msg.created_at || Date.now())
            },
            { 
              id: `a-${index}`,
              user: false, 
              text: msg.answer,
              timestamp: new Date(msg.created_at || Date.now())
            }
          ]);
          setMessages(loadedMessages);
        }
      } catch (err) {
        console.error('Failed to load document data:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setDocumentLoading(false);
      }
    };

    loadDocumentData();
  }, [docId, navigate]);

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      id: `user-${Date.now()}`,
      user: true, 
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/ask/', {
        document_id: parseInt(docId),
        question: currentInput,
        session_id: sessionId
      });

      const botMessage = { 
        id: `bot-${Date.now()}`,
        user: false, 
        text: response.data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setSessionId(response.data.session_id);

      // Update highlights if provided
      if (response.data.highlight_indexes) {
        setHighlightIndexes(response.data.highlight_indexes);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = { 
        id: `error-${Date.now()}`,
        user: false, 
        text: "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy message to clipboard
  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Loading state
  if (documentLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-lg flex items-center justify-center h-[90vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !document) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-lg flex items-center justify-center h-[90vh]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/library')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg flex flex-col h-[95vh]">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/library')} 
            className="p-2 mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <FileText className="text-blue-600 mr-2" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {document?.title || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interactive Document Chat
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMaximized(!isPreviewMaximized)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isPreviewMaximized ? "Restore layout" : "Maximize preview"}
          >
            {isPreviewMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Document Preview Panel */}
        <div className={`${isPreviewMaximized ? 'w-full' : 'w-1/2'} border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-800 transition-all duration-300`}>
          <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <FileText className="mr-2 text-blue-600" size={20} />
              Document Preview
            </h3>
            {highlightIndexes.length > 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {highlightIndexes.length} relevant section(s) highlighted
              </p>
            )}
          </div>
          
          <div className="p-4">
            {chunks.length > 0 ? (
              chunks.map((chunk, idx) => (
                <div
                  key={idx}
                  className={`mb-4 p-4 rounded-lg transition-all duration-300 ${
                    highlightIndexes.includes(idx)
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 shadow-md transform scale-[1.02]'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-sm'
                  }`}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {chunk}
                  </p>
                  {highlightIndexes.includes(idx) && (
                    <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 font-medium">
                      ✨ Relevant to your question
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No preview available for this document.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface Panel */}
        <div className={`${isPreviewMaximized ? 'hidden' : 'w-1/2'} flex flex-col bg-white dark:bg-gray-900 transition-all duration-300`}>
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <MessageSquare className="mr-2 text-green-600" size={20} />
              Chat Assistant
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ask questions about the document content
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Start a conversation about this document
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Ask questions, request summaries, or explore the content
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] group ${msg.user ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-center mb-1">
                    {msg.user ? (
                      <User className="h-4 w-4 text-blue-600 mr-2" />
                    ) : (
                      <Bot className={`h-4 w-4 mr-2 ${msg.isError ? 'text-red-500' : 'text-green-600'}`} />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div
                    className={`p-3 rounded-lg shadow-sm ${
                      msg.user
                        ? 'bg-blue-600 text-white'
                        : msg.isError
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {msg.text}
                    </p>
                    
                    {!msg.user && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {error && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ask a question about this document..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[60px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{input.length}/1000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}