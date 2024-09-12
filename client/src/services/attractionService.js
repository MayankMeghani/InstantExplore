import api from "../api/api";

const getAttractions = async () => {
  const response = await api.get('/attractions');
  return response.data;
};

const getAttraction = async (id) => {
  const response = await api.get(`/attractions/${id}`);
  return response.data;
};

const createAttraction = async (AttractionData, token) => {
  const response = await api.post('/attractions', AttractionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateAttraction = async (id, AttractionData, token) => {
  const response = await api.put(`/attractions/${id}`, AttractionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteAttraction = async (id, token) => {
  const response = await api.delete(`/attractions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { getAttractions, getAttraction, createAttraction, updateAttraction, deleteAttraction };
