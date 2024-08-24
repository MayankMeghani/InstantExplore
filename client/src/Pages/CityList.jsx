import React, { useEffect, useState } from 'react';
import { getCities, createCity, deleteCity, updateCity, getCity } from '../services/cityServices';
import Card from '../components/Card';
import './Styles/CityList.css';
import Button from '../components/addButton';
import CityForm from '../Forms/CityForm';
import './Styles/Modal.css';
import { useNavigate } from 'react-router-dom';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'update'
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities();
        setCities(response);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleButtonClick = () => {
    setFormMode('add');
    setSelectedCity(null);
    setShowForm(!showForm);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedCity(null);
  };

  const handleExploreClick = async (cityId) => {
    try {
      console.log(`Explore clicked for city with ID: ${cityId}`);
      navigate(`/cities/${cityId}/attractions`);
    } catch (error) {
      console.error('Error navigating to city attractions:', error);
    }
  };

  const handleRemoveClick = async (cityId) => {
    try {
      console.log(`Remove clicked for city with ID: ${cityId}`);
      await deleteCity(cityId);
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
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  const handleFormSubmit = async (cityData) => {
    try {
      if (formMode === 'add') {
        const newCity = await createCity(cityData);
        setCities([...cities, newCity]); // Add the newly created city
      } else if (formMode === 'update') {
        await updateCity(selectedCity._id, cityData);
        setCities(cities.map(city => 
          city._id === selectedCity._id ? { ...city, ...cityData } : city
        ));
      }
      setShowForm(false);
      setSelectedCity(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="city-list">
      {cities.map((city) => (
        <Card
          key={city._id}
          Id={city._id}
          images={city.images || 'default-image-url.jpg'} 
          title={city.name}
          description={city.state.name} 
          onExploreClick={handleExploreClick}
          onUpdateClick={handleUpdateClick}
          onRemoveClick={handleRemoveClick}
        />
      ))}
      <div>
        <Button onClick={handleButtonClick}>
          {showForm ? 'Cancel' : 'Add City'}
        </Button>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formMode === 'add' ? 'Add City' : 'Update City'}</h2>
              <button className="close-button" onClick={handleClose}>&times;</button>
            </div>
            <div className="modal-body">
              <CityForm 
                initialData={selectedCity}
                onSubmit={handleFormSubmit}
                mode={formMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityList;
