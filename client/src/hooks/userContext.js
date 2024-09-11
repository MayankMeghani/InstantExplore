import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from '../api/tokenDecoder';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = decodeToken();
    setUser(token);
  }, []);

  const updateUser = () => {
    const newToken = decodeToken();
    setUser(newToken);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);