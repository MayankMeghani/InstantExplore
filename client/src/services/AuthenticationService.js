import{RegisterUser,ValidateUser} from './userServices';

export const logIn = async (userData) => {
    const response = await ValidateUser(userData);
    localStorage.setItem('token', response.token);
    return response;
};

export const signUp = async (userData) => {
  const response = await RegisterUser(userData);
  return response;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logOut = () => {
  localStorage.removeItem('token');
};
