import api from "../api/api";

const getAttractions = async () => {
    const response = await api.get('/attractions');
    return response.data;
  };
  
const getAttraction = async (id) => {
    const response = await api.get(`/attractions/${id}`);
    return response.data;
  };

const createAttraction = async (AttractionData) => {
    const response = await api.post('/attractions', AttractionData);
    return response.data;
  };
  
const updateAttraction = async (id, AttractionData) => {
    const response = await api.put(`/attractions/${id}`, AttractionData);
    return response.data;
  };
  
const deleteAttraction = async (id) => {
    const response = await api.delete(`/attractions/${id}`);
    return response.data;
  };
  
  export { getAttractions, getAttraction, createAttraction, updateAttraction, deleteAttraction };