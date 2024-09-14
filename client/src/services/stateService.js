import api from "../api/api";

const getStates = async () => {
    const response = await api.get('/states');
    return response.data;
  };

  const createState = async (stateData,token) => {
    const response = await api.post('/states', stateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  const updateState = async (id, stateData,token) => {
    const response = await api.put(`/states/${id}`, stateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  const deleteState = async (id,token) => {
    const response = await api.delete(`/states/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }



const getCountries= async () => {
    try {
        const response = await api.get("/countries");
        return response.data;
    } catch (error) {
        throw error;
    }
}

const createCountry = async(country,token) => {
    const response= await api.post("/countries", country, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     return response.data;
}

const updateCountry = async(id,country,token) => {
  const response= await api.put(`/countries/${id}`, country, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     return response.data;
}

const deleteCountry = async(id,token) => {
  const response= await api.delete(`/countries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     return response.data;
}

const getCountryStates = async(countryId)=>{
  const response= await api.get(`/countries/${countryId}/states`);
  return response.data;
}

export { getStates, createState, updateState, deleteState, getCountries, createCountry, updateCountry, deleteCountry,getCountryStates };