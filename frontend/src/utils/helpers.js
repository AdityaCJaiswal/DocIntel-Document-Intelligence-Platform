export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType) => {
  const type = fileType?.toLowerCase();
  if (type?.includes('pdf')) return '📄';
  if (type?.includes('word') || type?.includes('doc')) return '📝';
  if (type?.includes('powerpoint') || type?.includes('presentation')) return '📊';
  if (type?.includes('text')) return '📃';
  return '📄';
};

export const validateFile = (file) => {
  const errors = [];
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
  }
  
  const supportedTypes = Object.keys(SUPPORTED_FILE_TYPES);
  if (!supportedTypes.includes(file.type)) {
    errors.push('File type not supported');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
