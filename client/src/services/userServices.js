import api from '../api/api';

const RegisterUser = async(userData)=>{
    const response = await api.post('/users', userData);
    return response.data;  
};

const ValidateUser = async(userData)=>{
    const response = await api.post('/users/login', userData);
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

const getUserRequests = async(userId)=>{
    try{
    const response = await api.get(`/users/requests/${userId}`);
    
    return response.data;
    }
    catch(error){
        console.error('Error fetching user requests:', error);
    }
}
export {RegisterUser,ValidateUser,getUserReviews,getUserRequests};