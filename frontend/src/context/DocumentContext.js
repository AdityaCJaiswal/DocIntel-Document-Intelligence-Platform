import React, { createContext, useContext, useReducer } from 'react';

const DocumentContext = createContext();

const documentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return {
        ...state,
        documents: action.payload,
        loading: false
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload]
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  documents: [],
  loading: false,
  error: null
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  return (
    <DocumentContext.Provider value={{ state, dispatch }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};