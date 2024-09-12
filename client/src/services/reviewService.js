import api from "../api/api";

const createReview = async (Review,token) => {
  console.log(token);
    const response = await api.post(`/reviews`,Review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
    
  const updateReview = async (id,Review,token) => {
    const response = await api.put(`/reviews/${id}`, Review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  
  const deleteReview = async (id,token) => {
    const response = await api.delete(`/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };  

  export { createReview, updateReview, deleteReview };