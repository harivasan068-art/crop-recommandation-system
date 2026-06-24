import { createContext, useContext, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);

  const showWarning = useCallback((message) => {
    toast.warning(message);
  }, []);

  const showInfo = useCallback((message) => {
    toast.info(message);
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
