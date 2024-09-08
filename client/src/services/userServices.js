import api from '../api/api';

const RegisterUser = async(userData)=>{
    const response = await api.post('/users', userData);
    return response.data;
    
};

const ValidateUser = async(userData)=>{
    const response = await api.post('/users/validate', userData);
    return response.data;
};

export {RegisterUser,ValidateUser};