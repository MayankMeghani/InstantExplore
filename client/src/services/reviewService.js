import api from "../api/api";

const createReview = async (Review) => {
    const response = await api.post(`/reviews`,Review);
    console.log(response.data);
    return response.data;
  };
    
  const updateReview = async (id,Review) => {
    const response = await api.put(`/reviews/${id}`, Review);
    return response.data;
  };
  
  const deleteReview = async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  };  

  export { createReview, updateReview, deleteReview };