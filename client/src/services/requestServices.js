import api from "../api/api";

const getRequests = async()=>{
    const response = await api.get('/requests');
    return response.data;
}

const addRequest =async(requestData,token)=>{
    console.log(requestData);
    const response = await api.post('/requests', requestData, {
        headers: {
        Authorization: `Bearer ${token}`,
    },
    });
    return response.data;
    
};

const updateRequest = async(id,requestData,token)=>{
    const response = await api.put(`/requests/${id}`, requestData, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const removeRequest = async(id,token)=>{
    const response = await api.delete(`/requests/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export {getRequests,addRequest,updateRequest,removeRequest};
