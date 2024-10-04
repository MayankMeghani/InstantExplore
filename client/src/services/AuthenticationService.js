import{RegisterUser,ValidateUser} from './userServices';
import api from '../api/api';
export const logIn = async (userData) => {
    const response = await ValidateUser(userData);
    localStorage.setItem('token', response.token);
    return response;
};

export const signUp = async (userData) => {
  const response = await RegisterUser(userData);
  return response;
};

export const isValidToken = async(token) => {
  try{
  const response = await api.post('/valid',token);
  return response.data;
  }
  catch(error){
    console.log('Error validating token:', error);
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logOut = () => {
  localStorage.removeItem('token');
};
