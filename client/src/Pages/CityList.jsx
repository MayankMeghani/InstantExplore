import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities, createCity, deleteCity, updateCity, getCity } from '../services/cityServices';
import Card from '../components/Card';
import './Styles/CityList.css';
import Button from '../components/addButton';
import CityForm from '../Forms/CityForm';
import './Styles/Modal.css';
import Search from '../components/Search';
import {useUser} from '../hooks/userContext';
import RequestForm from '../Forms/RequestForm';
import {addRequest} from '../services/requestServices';
const CityList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCityForm, setShowCityForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const {user} = useUser();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities();
        setCities(response);

        setIsAdmin(user?.isAdmin || false);

        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCities();
  }, [user]);

  const handleRequestButtonClick = () => {
    setShowRequestForm(!showRequestForm);
  };

  
  const handleCloseRequestForm = () => {
    setShowRequestForm(false);
  };
  const handleRequestFormSubmit = async (AttractionData) => {
    try {
      const response=await addRequest(AttractionData,user.token);
      console.log(response);
      setShowRequestForm(false);
    } catch (error) {
      setFormError(error.response?.data?.message);
      console.error('Error submitting form:', error);
    }
  };


  const handleCityButtonClick = () => {
    setFormMode('add');
    setSelectedCity(null);
    setShowCityForm(!showCityForm);
  };

  const handleCloseCityForm = () => {
    setShowCityForm(false);
    setSelectedCity(null);
  };

  const handleExploreClick = async (cityId) => {
    try {
      navigate(`/cities/${cityId}/attractions`);
    } catch (error) {
      console.error('Error navigating to city attractions:', error);
    }
  };

  const handleRemoveClick = async (cityId) => {
    try {
      await deleteCity(cityId,user.token);
      setCities(cities.filter(city => city._id !== cityId));
    } catch (error) {
      console.error('Error removing city:', error);
    }
  };

  const handleUpdateClick = async (cityId) => {
    try {
      const cityData = await getCity(cityId);
      setSelectedCity(cityData);
      setFormMode('update');
      setShowCityForm(true);
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  const handleCityFormSubmit = async (cityData) => {
    try {
      if (formMode === 'add') {
        const newCity = await createCity(cityData,user.token);
        setCities([...cities, newCity]);
      } else if (formMode === 'update') {
        await updateCity(selectedCity._id, cityData,user.token);
        setCities(cities.map(city =>
          city._id === selectedCity._id ? { ...city, ...cityData } : city
        ));
      }
      setShowCityForm(false);
      setSelectedCity(null);
    } catch (error) {
      setFormError(error.response?.data?.message);
      console.error('Error submitting form:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
    || city.state.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="list">
      <Search onSearch={handleSearch} />
      
      <div className="cards"> 
        {filteredCities.length > 0 ? (filteredCities.map((city) => (
          <Card
            key={city._id}
            Id={city._id}
            images={city.images || ['default-image-url.jpg']}
            title={city.name}
            description={city.state.name}
            onExploreClick={handleExploreClick}
            onUpdateClick={handleUpdateClick }
            onRemoveClick={handleRemoveClick }
            isAdmin={isAdmin}

          />
        ))) : (
          <div>No City found.</div>  
        )}
      </div>
      <div>
      {user && !isAdmin&& (
          <Button onClick={handleRequestButtonClick}>
            {showCityForm ? 'Cancel' : 'Suggest Place'}
          </Button>
        )}

        {isAdmin && (
          <Button onClick={handleCityButtonClick}>
            {showCityForm ? 'Cancel' : 'Add City'}
          </Button>
        )}
      </div>     
       {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{'Request to add attraction'}</h2>
              <button className="close-button" onClick={handleCloseRequestForm}>&times;</button>
            </div>
            <div className="modal-body">
              <RequestForm
                onSubmit={handleRequestFormSubmit}
                error={formError}
              />
            </div>
          </div>
        </div>
      )}

      {showCityForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formMode === 'add' ? 'Add City' : 'Update City'}</h2>
              <button className="close-button" onClick={handleCloseCityForm}>&times;</button>
            </div>
            <div className="modal-body">
              <CityForm
                initialData={selectedCity}
                onSubmit={handleCityFormSubmit}
                mode={formMode}
                error={formError}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityList;