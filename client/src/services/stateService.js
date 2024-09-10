import api from "../api/api";

const getStates = async () => {
    const response = await api.get('/states');
    return response.data;
  };

  const createState = async (stateData) => {
    const response = await api.post('/states', stateData);
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

const createCountry = async( country) => {
    const response= await api.post("/countries", country);
     return response.data;
}

export {getStates,createState,getCountries, createCountry};