import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { isValidToken } from '../services/AuthenticationService'; // Assuming your isValidToken function is here
import { logOut } from '../services/AuthenticationService';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchAndSetUser = () => {
    const token = localStorage.getItem('token');
    
    if (token && isValidToken(token)) {
      const decodedToken = jwtDecode(token);
      setUser({ ...decodedToken, token });
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []); // Runs once on mount

  const updateUser = () => {
    fetchAndSetUser();
  };

   const logout = async () => {
    try {
      await logOut(); // Call your logout service
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
