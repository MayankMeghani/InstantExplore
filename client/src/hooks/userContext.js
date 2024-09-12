import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { isValidToken } from '../services/AuthenticationService'; // Assuming your isValidToken function is here

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchAndSetUser = () => {
    const token = localStorage.getItem('token');
    
    if (token && isValidToken(token)) {
      const decodedToken = jwtDecode(token);
      setUser({...decodedToken,token});
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []); // Empty dependency array means it runs once on mount

  const updateUser = () => {
    fetchAndSetUser();
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
