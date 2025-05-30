import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const docId = new URLSearchParams(location.search).get('doc');

  const [document, setDocument] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [highlightIndexes, setHighlightIndexes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load document and chunks
  useEffect(() => {
    if (!docId) return;

    axios.get(`http://localhost:8000/api/documents/${docId}/`)
      .then(res => setDocument(res.data))
      .catch(err => {
        console.error('Failed to load document:', err);
        navigate('/library');
      });

    axios.get(`http://localhost:8000/api/documents/${docId}/chunks/`)
      .then(res => setChunks(res.data.map(c => c.content)))
      .catch(err => console.error('Failed to load chunks:', err));

    axios.get(`http://localhost:8000/api/documents/${docId}/chat-history/`)
      .then(res => {
        if (res.data.length > 0) {
          const latestSession = res.data[0];
          setSessionId(latestSession.session_id);
          const loadedMessages = latestSession.messages.flatMap(msg => [
            { user: true, text: msg.question },
            { user: false, text: msg.answer }
          ]);
          setMessages(loadedMessages);
        }
      })
      .catch(err => console.error('Failed to load chat history:', err));

  }, [docId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { user: true, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/ask/', {
        document_id: parseInt(docId),
        question: input,
        session_id: sessionId
      });

      const botMsg = { user: false, text: res.data.answer };
      setMessages(prev => [...prev, botMsg]);
      setSessionId(res.data.session_id);

      if (res.data.highlight_indexes) {
        setHighlightIndexes(res.data.highlight_indexes);
      }

    } catch (err) {
      setMessages(prev => [...prev, { user: false, text: "Error getting answer." }]);
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-lg flex flex-col h-[90vh]">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate('/library')} className="p-2 mr-3 text-gray-400 hover:text-gray-600">
          <ArrowLeft />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Chat with: {document?.title || 'Loading...'}
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden border rounded-lg">
        {/* Left: Document Preview */}
        <div className="w-1/2 border-r overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
          {chunks.length > 0 ? (
            chunks.map((chunk, idx) => (
              <p
                key={idx}
                className={`mb-3 p-2 rounded transition whitespace-pre-wrap ${
                  highlightIndexes.includes(idx)
                    ? 'bg-yellow-100 dark:bg-yellow-800'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                {chunk}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No preview available.</p>
          )}
        </div>

        {/* Right: Chat Interface */}
        <div className="w-1/2 flex flex-col justify-between bg-white dark:bg-gray-900">
          <div className="overflow-y-auto p-4 flex-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 p-3 max-w-[80%] rounded-lg whitespace-pre-wrap ${
                  msg.user
                    ? 'ml-auto bg-blue-100 text-right'
                    : 'mr-auto bg-gray-200 dark:bg-gray-700 text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="italic text-gray-400 text-sm">Loading...</div>
            )}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input
              className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              placeholder="Ask something about this document..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
