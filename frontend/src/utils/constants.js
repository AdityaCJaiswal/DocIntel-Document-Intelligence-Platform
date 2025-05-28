export const SUPPORTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const API_ENDPOINTS = {
  DOCUMENTS: '/documents/',
  UPLOAD: '/documents/upload/',
  ASK: (id) => `/documents/${id}/ask/`,
  CHAT: (id) => `/documents/${id}/chat/`
};