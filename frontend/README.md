# Document Intelligence Platform

A full-stack web application that allows users to upload documents and ask natural language questions about their content using RAG (Retrieval Augmented Generation).

## Features

- **Document Upload**: Drag-and-drop interface for uploading PDFs, Word docs, and text files
- **Document Library**: View all uploaded documents with metadata
- **AI Chat Interface**: Ask natural language questions about document content
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error boundaries and loading states

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Dropzone for file uploads
- Lucide React for icons

### Backend Integration
- Designed to work with Django REST API
- JWT authentication support
- File upload with progress tracking
- Real-time chat interface

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.js        # Main layout with navigation
│   ├── DocumentCard.js  # Document list item
│   ├── FileUpload.js    # Drag-and-drop upload
│   ├── ChatInterface.js # Q&A chat component
│   ├── LoadingSpinner.js# Loading states
│   └── ErrorBoundary.js # Error handling
├── pages/               # Main application pages
│   ├── Dashboard.js     # Document library
│   ├── Upload.js        # File upload page
│   └── DocumentChat.js  # Chat interface
├── context/             # React Context for state
│   └── DocumentContext.js
├── hooks/               # Custom React hooks
│   ├── useDocumentUpload.js
│   └── useChat.js
├── services/            # API integration
│   └── api.js
└── utils/               # Helper functions
    ├── constants.js
    └── helpers.js
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Integration

The frontend expects the following Django REST API endpoints:

```python
# Document endpoints
GET /api/documents/              # List all documents
POST /api/documents/upload/      # Upload document
GET /api/documents/{id}/         # Get document details
DELETE /api/documents/{id}/      # Delete document

# Chat endpoints
POST /api/documents/{id}/ask/    # Ask question
GET /api/documents/{id}/chat/    # Get chat history
```

## Component Documentation

### DocumentCard
Displays document information in the library view.

### FileUpload
Drag-and-drop file upload with validation and progress tracking.

### ChatInterface
Real-time chat interface for asking questions about documents.

### Layout
Main application layout with navigation and responsive design.

## State Management

Uses React Context for global state management:
- Document list and metadata
- Loading states
- Error handling
- Upload progress

## Styling

Built with Tailwind CSS utility classes:
- Responsive design
- Dark mode support (prepared)
- Consistent color scheme
- Accessible components

## Error Handling

Comprehensive error handling:
- Error boundaries for React errors
- API error interceptors
- User-friendly error messages
- Loading states for all async operations

## Performance Optimizations

- React.memo for component optimization
- Lazy loading prepared
- Image optimization
- Efficient re-renders with proper dependencies

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
```