import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  createAttraction, deleteAttraction, getAttraction, updateAttraction } from '../services/attractionService';
import { getCityAttractions } from '../services/cityServices';
import Card from '../components/Card';
import Button from '../components/addButton';
import AttractionForm from '../Forms/AttractionForm';
import './Styles/Modal.css';
import './Styles/CityList.css';
import Search from '../components/Search';
import { useUser } from '../hooks/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from '../hooks/snackbarContext';
import ConfirmationModal from '../components/ConfirmationModal'; // Import your ConfirmationModal

const AttractionList = () => {
  const { cityId } = useParams();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [attractionToDelete, setAttractionToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAttractions = async () => {
      setLoading(true);
      try {
        const data = await getCityAttractions(cityId);
        setAttractions(data);
      } catch (err) {
        showSnackbar('Error fetching attractions.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [cityId, showSnackbar]);

  const handleButtonClick = () => {
    setFormMode('add');
    setSelectedAttraction(null);
    setShowForm(!showForm);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedAttraction(null);
    setFormError(null);
  };

  const handleExploreClick = (Id) => {
    navigate(`/cities/${cityId}/attractions/${Id}`);
  };

  const handleRemoveClick = (Id) => {
    setAttractionToDelete(Id);
    setShowConfirmationModal(true);
  };

  const confirmDeleteAttraction = async () => {
    try {
      await deleteAttraction(attractionToDelete, user.token);
      setAttractions(prev => prev.filter(attraction => attraction._id !== attractionToDelete));
      showSnackbar('Attraction deleted successfully.', 'success');
    } catch (error) {
      showSnackbar('Error removing attraction.', 'error');
    } finally {
      setShowConfirmationModal(false);
      setAttractionToDelete(null);
    }
  };

  const handleUpdateClick = async (Id) => {
    try {
      const attractionData = await getAttraction(Id);
      setSelectedAttraction(attractionData);
      setFormMode('update');
      setShowForm(true);
    } catch (error) {
      showSnackbar('Error fetching attraction data.', 'error');
    }
  };

  const handleFormSubmit = async (attractionData) => {
    try {
      if (formMode === 'add') {
        const newAttraction = await createAttraction(attractionData, user.token);
        setAttractions(prev => [...prev, newAttraction]);
        showSnackbar('Attraction added successfully.', 'success');
      } else if (formMode === 'update') {
        await updateAttraction(selectedAttraction._id, attractionData, user.token);
        setAttractions(prev => prev.map(attraction => 
          attraction._id === selectedAttraction._id ? { ...attraction, ...attractionData } : attraction
        ));
        showSnackbar('Attraction updated successfully.', 'success');
      }
      setShowForm(false);
      setSelectedAttraction(null);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Error submitting form.');
      showSnackbar('Error submitting form.', 'error');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredAttractions = attractions.filter(attraction =>
    attraction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className='loader'><CircularProgress /></div>;

  return (
    <div className="list">
      <Search onSearch={handleSearch} />
      <div className="cards">
        {filteredAttractions.length > 0 ? (
          filteredAttractions.map(attraction => (
            <Card
              key={attraction._id}
              title={attraction.name}
              description={attraction.description}
              Id={attraction._id}
              rating={attraction.rating}
              images={attraction.images || ['default-image-url.jpg']}
              onExploreClick={handleExploreClick}
              onUpdateClick={handleUpdateClick}
              onRemoveClick={handleRemoveClick}
              isAdmin={user?.isAdmin}
            />
          ))
        ) : (
          <div>No attractions found.</div>
        )}
      </div>
      {user?.isAdmin && (
        <Button onClick={handleButtonClick}>
          {showForm ? 'Cancel' : 'Add Attraction'}
        </Button>
      )}
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
                error={formError}
              />
            </div>
          </div>
        </div>
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this attraction?"
          onConfirm={confirmDeleteAttraction}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default AttractionList;
