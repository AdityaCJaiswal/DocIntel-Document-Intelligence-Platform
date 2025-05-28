import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './ChatBot.css';

// Dummy data for demonstration
const libraryDocs = [
  {
    id: 1,
    title: "Project Proposal.pdf",
    paragraphs: [
      "Proposal intro...",
      "Project scope...",
      "Timeline and deliverables."
    ]
  },
  {
    id: 2,
    title: "Invoice_2024_05.pdf",
    paragraphs: [
      "Invoice details...",
      "Payment terms...",
      "Contact info."
    ]
  }
];

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'history'
  const [history, setHistory] = useState([]); // [{id, messages, doc}]
  const [chatId, setChatId] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDocPicker, setShowDocPicker] = useState(true);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { user: true, text: input },
      { user: false, text: "Here's the answer from the document." }
    ]);
    setHighlightIdx(1);
    setInput('');
  };

  const handleNewChat = () => {
    if (messages.length && selectedDoc) {
      setHistory([{ id: chatId, messages, doc: selectedDoc }, ...history]);
      setChatId(chatId + 1);
    }
    setMessages([]);
    setHighlightIdx(null);
    setActiveTab('chat');
    setShowDocPicker(true);
    setSelectedDoc(null);
  };

  const handleShowHistory = () => setActiveTab('history');
  const handleShowChat = () => setActiveTab('chat');

  const handleHistoryClick = (hist) => {
    setMessages(hist.messages);
    setSelectedDoc(hist.doc);
    setActiveTab('chat');
    setShowDocPicker(false);
  };

  // Simulate upload (replace with your real upload logic)
  const handleUploadDoc = () => {
    const uploaded = {
      id: Date.now(),
      title: "New Uploaded Document",
      paragraphs: [
        "Uploaded doc intro...",
        "Uploaded doc content...",
        "Uploaded doc summary."
      ]
    };
    setSelectedDoc(uploaded);
    setShowDocPicker(false);
  };

  // Select from library
  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setShowDocPicker(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-gray-900 dark:text-gray-100">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold text-gray-700 dark:text-gray-100">Back to Home</span>
      </div>
      {/* Document Picker Step */}
      {showDocPicker ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Start a New Chat</h2>
          <div className="flex gap-6 mb-8">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
              onClick={handleUploadDoc}
            >
              Upload Document
            </button>
            <div>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition mb-2"
                onClick={() => {}} // No-op, just for UI
                disabled
              >
                Select from Library
              </button>
              <div className="bg-white dark:bg-gray-800 border rounded shadow mt-2 p-2">
                {libraryDocs.map(doc => (
                  <button
                    key={doc.id}
                    className="block w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition text-gray-900 dark:text-gray-100"
                    onClick={() => handleSelectDoc(doc)}
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Layout */}
          <div className="chatbot-container professional-chatbot">
            {/* Document panel on the left */}
            <div className="chatbot-doc-panel">
              <h3 className="chatbot-doc-title">{selectedDoc?.title}</h3>
              {selectedDoc?.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={highlightIdx === idx ? "highlighted-para" : ""}
                >
                  {para}
                </p>
              ))}
            </div>
            {/* Chat panel on the right */}
            <div className="chatbot-chat-panel">
              {/* Chat panel navbar */}
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded-md font-medium text-sm transition ${activeTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={handleNewChat}
                  >
                    New Chat
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md font-medium text-sm transition ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={handleShowHistory}
                  >
                    History
                  </button>
                </div>
              </div>
              {/* Chat or History */}
              {activeTab === 'chat' ? (
                <>
                  <div className="chatbot-messages">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={
                          msg.user
                            ? "chatbot-message chatbot-message-user"
                            : "chatbot-message chatbot-message-bot"
                        }
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <div className="chatbot-input">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Ask about your document..."
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend}>Send</button>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  {history.length === 0 ? (
                    <div className="text-gray-500 text-sm">No chat history yet.</div>
                  ) : (
                    <ul>
                      {history.map(hist => (
                        <li key={hist.id}>
                          <button
                            className="text-blue-700 hover:underline text-left"
                            onClick={() => handleHistoryClick(hist)}
                          >
                            Chat #{hist.id} ({hist.messages.length} messages) - {hist.doc.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="mt-4 px-3 py-1 rounded-md font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    onClick={handleShowChat}
                  >
                    Back to Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Cancel Button at Bottom */}
      <div className="flex justify-end mt-8">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}