import React, { createContext, useState, useContext, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Snackbar from '@mui/material/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  });

  const showSnackbar = useCallback((message) => {
    setSnackbarState({ open: true, message });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbarState({ open: false, message: '' });
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {ReactDOM.createPortal(
        <Snackbar
          open={snackbarState.open}
          onClose={hideSnackbar}
          message={snackbarState.message}
          autoHideDuration={3000}
        />,
        document.body // This renders the Snackbar in a portal
      )}
    </SnackbarContext.Provider>
  );
};
