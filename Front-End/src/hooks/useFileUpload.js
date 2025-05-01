import { useState } from 'react';

/**
 * Custom hook for handling file uploads
 * @returns {object} File upload state and handlers
 */
const useFileUpload = () => {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});

  /**
   * Handle file selection
   * @param {string} fieldName - The field name
   * @param {File} file - The selected file
   */
  const handleFileChange = (fieldName, file) => {
    if (file) {
      // Create object URL for preview
      const preview = URL.createObjectURL(file);
      
      // Update files and previews
      setFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));
      
      setPreviews(prev => ({
        ...prev,
        [fieldName]: preview
      }));
      
      return preview;
    }
    return null;
  };

  /**
   * Reset all files and previews
   */
  const resetFiles = () => {
    // Revoke all object URLs to prevent memory leaks
    Object.values(previews).forEach(preview => {
      URL.revokeObjectURL(preview);
    });
    
    setFiles({});
    setPreviews({});
  };

  /**
   * Add files to FormData
   * @param {FormData} formData - The FormData object
   */
  const addFilesToFormData = (formData) => {
    Object.entries(files).forEach(([fieldName, file]) => {
      formData.append(fieldName, file);
    });
    
    return formData;
  };

  return {
    files,
    previews,
    handleFileChange,
    resetFiles,
    addFilesToFormData
  };
};

export default useFileUpload; 