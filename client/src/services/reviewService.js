import api from "../api/api";


const getReviews = async () => {
  try {
    const response = await api.get(`/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error in getReviews:', error);
    throw error;
  }
};
const createReview = async (Review,token) => {
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

  const updateLike = async (id,likeStatus,user)=>{
    const response = await api.post(`/reviews/${id}/like`, 
      {
        likeStatus: likeStatus,
        userId: user._id
      },
      {
        headers: { 
          Authorization: `Bearer ${user.token}`
        }
      }
    );
    return response.data;

  }

  export { getReviews,createReview, updateReview, deleteReview,updateLike };