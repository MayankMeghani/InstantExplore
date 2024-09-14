import api from "../api/api";
const getCities = async () => {
    const response = await api.get('/cities');
    return response.data;
  };
  
  const getCity = async (id) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  };

  const getCityAttractions = async (id) => {
    const response = await api.get(`/cities/${id}/attractions`);
    return response.data;
  };
  
  const createCity = async (cityData,token) => {
    const response = await api.post('/cities', cityData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  
  const updateCity = async (id, cityData,token) => {
    const response = await api.put(`/cities/${id}`, cityData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  
  const deleteCity = async (id,token) => {
    const response = await api.delete(`/cities/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  



  export { getCities, getCity, createCity, updateCity, deleteCity, getCityAttractions };