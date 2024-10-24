import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './hooks/userContext'; 
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // Importing the routes
import { SnackbarProvider } from './hooks/snackbarContext'; 
import Header from './components/Header';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <SnackbarProvider>
        <Router>
          <Header /> 
          <AppRoutes /> 
        </Router>
      </SnackbarProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
