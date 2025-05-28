import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DocumentChat from './pages/DocumentChat';
import Upload from './pages/Upload';
import ErrorBoundary from './components/ErrorBoundary';
import { DocumentProvider } from './context/DocumentContext';
import ChatBot from './pages/ChatBot';
import Library from './pages/Library';

function App() {
  return (
    <ErrorBoundary>
      <DocumentProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/document/:id" element={<DocumentChat />} />
              <Route path="/chat" element={<ChatBot />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </Layout>
        </Router>
      </DocumentProvider>
    </ErrorBoundary>
  );
}

export default App;