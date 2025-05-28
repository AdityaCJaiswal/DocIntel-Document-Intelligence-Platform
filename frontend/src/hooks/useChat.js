import { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';

export const useChat = (documentId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (documentId) {
      loadChatHistory();
    }
  }, [documentId]);

  const loadChatHistory = async () => {
    try {
      const response = await documentAPI.getChatHistory(documentId);
      setMessages(response.data);
    } catch (err) {
      setError('Failed to load chat history');
    }
  };

  const sendMessage = async (question) => {
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await documentAPI.askQuestion(documentId, question);
      const botMessage = {
        type: 'bot',
        content: response.data.answer,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to get response');
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error
  };
};