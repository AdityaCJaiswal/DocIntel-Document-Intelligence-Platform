import React, { useState } from 'react';
import './ChatBot.css';

const dummyDoc = {
  title: "Sample Uploaded Document",
  paragraphs: [
    "This is the first paragraph of the document.",
    "This is the second paragraph, which contains the answer.",
    "This is the third paragraph."
  ]
};

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(null);

  const handleSend = () => {
    if (!input.trim()) return;
    // Dummy bot logic: always highlights paragraph 1
    setMessages([...messages, { user: true, text: input }, { user: false, text: "Here's the answer from the document." }]);
    setHighlightIdx(1); // highlight the second paragraph
    setInput('');
  };

  return (
    <div className="chatbot-container professional-chatbot">
      {/* Document panel on the left */}
      <div className="chatbot-doc-panel">
        <h3 className="chatbot-doc-title">{dummyDoc.title}</h3>
        {dummyDoc.paragraphs.map((para, idx) => (
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
      </div>
    </div>
  );
}