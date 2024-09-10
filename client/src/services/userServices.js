import api from '../api/api';

const RegisterUser = async(userData)=>{
    const response = await api.post('/users', userData);
    return response.data;  
};

const ValidateUser = async(userData)=>{
    const response = await api.post('/users/validate', userData);
    return response.data;
};

const getUserReviews = async(userId)=>{
    try{
    const response = await api.get(`/users/reviews/${userId}`);
    return response.data;
    }
    catch(error){
        console.error('Error fetching user reviews:', error);
    }
}

export {RegisterUser,ValidateUser,getUserReviews};