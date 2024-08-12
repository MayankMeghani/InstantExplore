import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCityAttractions } from '../services/cityServices';
import { createAttraction, deleteAttraction, getAttraction, updateAttraction } from '../services/attractionService';
import Card from './Card';
import Button from './addButton';
import AttractionForm from './AttractionForm';
import './Modal.css';
import { useNavigate } from 'react-router-dom';

const AttractionList = () => {
  const { cityId } = useParams();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Fetching attractions for city with ID: ${cityId}`);
    const fetchAttractions = async () => {
      try {
        const data = await getCityAttractions(cityId);
        setAttractions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [cityId]);

  const handleButtonClick = () => {
    setFormMode('add');
    setSelectedAttraction(null);
    setShowForm(!showForm);
  };

  const handleClose = () => {
    setShowForm(false); 
    setSelectedAttraction(null);
  };

  const handleExploreClick = async (Id) => {
    try {
      navigate(`/cities/${cityId}/attractions/${Id}`);
    } catch (error) {
      console.error('Error navigating to attraction detail:', error);
    }
  };

  const handleRemoveClick = async (Id) => {
    try {
      await deleteAttraction(Id); 
      setAttractions(attractions.filter(attraction => attraction._id !== Id));
    } catch (error) {
      console.error('Error removing attraction:', error);
    }
  };

  const handleUpdateClick = async (Id) => {
    try {
      console.log(`Update clicked for attraction with ID: ${Id}`);
      const attractionData = await getAttraction(Id);
      setSelectedAttraction(attractionData);
      console.log(attractionData);
      setFormMode('update');
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching attraction data:', error);
    }
  };

  const handleFormSubmit = async (attractionData) => {
    try {
      if (formMode === 'add') {
        const newAttraction = await createAttraction(attractionData);
        setAttractions([...attractions, newAttraction]); // Add the newly created attraction
      } else if (formMode === 'update') {
        await updateAttraction(selectedAttraction._id, attractionData);
        setAttractions(attractions.map(attraction => 
          attraction._id === selectedAttraction._id ? { ...attraction, ...attractionData } : attraction
        ));
      }
      setShowForm(false);
      setSelectedAttraction(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="city-list">
      {attractions.map((attraction) => (
        <Card 
          key={attraction._id}
          title={attraction.name}
          description={attraction.description}
          Id={attraction._id}
          images={attraction.images || ['default-image-url.jpg']} // Ensure `images` is an array
          onExploreClick={handleExploreClick}
          onUpdateClick={handleUpdateClick}
          onRemoveClick={handleRemoveClick}
        />
      ))}
      
      <div>
        <Button onClick={handleButtonClick}>
          {showForm ? 'Cancel' : 'Add Attraction'}
        </Button>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formMode === 'add' ? 'Add Attraction' : 'Update Attraction'}</h2>
              <button className="close-button" onClick={handleClose}>&times;</button>
            </div>
            <div className="modal-body">
              <AttractionForm 
                initialData={selectedAttraction}
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

export default AttractionList;
