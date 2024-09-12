import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../api/firebase';
import StateForm from './StateForm';
import {getStates,createState} from '../services/stateService.js';
import {useUser} from '../hooks/userContext.js';

const CityForm = ({ initialData, onSubmit, mode, error }) => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [states, setStates] = useState([]);
  const [showStateForm, setShowStateForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [message, setMessage] = useState(null);
  const {user} = useUser();
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getStates();
        setStates(response);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();

    if (initialData) {
      setName(initialData.name || '');
      setState(initialData.state?._id || '');
      setImageUrl(initialData.images?.[0] || '');
    }
  }, [initialData]);

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const storageRef = ref(storage, "City/" + selectedFile.name);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        setImageUrl(downloadUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

const handleAddState = () => {
  setShowStateForm(true);
};
const handleStateFormSubmit = async (newState) => {
  try {
    const response = await createState(newState,user.token);
    setShowStateForm(false);
    setStates([...states, response]); 
    setMessage('New state added successfully');
  } catch (error) {
    console.error('Error adding new state:', error);
    setFormError(error.response?.data?.message);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cityData = {
      name,
      state,
      images: [imageUrl]
    };

    try {
      setMessage(null);
      console.log('City data:', cityData);
      onSubmit(cityData);
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} city:`, error);
    }
  };

  return (
    <> 
       {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>} 
        {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">City Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        >
          <option value="">Select a state</option>
          {states.map((stateOption) => (
            <option key={stateOption._id} value={stateOption._id}>
              {stateOption.name},{stateOption.country.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddState}>Add New State</button>
      </div>
      <div>
        <label htmlFor="image">City Image:</label>
        <input
          type="file"
          id="image"
          onChange={handleImageUpload}
          required={mode === 'add'}
        />
        {imageUrl && <img src={imageUrl} alt="City" style={{maxWidth: '200px', marginTop: '10px'}} />}
      </div>
      <button type="submit" disabled={!imageUrl}>{mode === 'add' ? 'Add City' : 'Update City'}</button>
    </form>
    {showStateForm && (
        <StateForm onSubmit={handleStateFormSubmit} onCancel={() => setShowStateForm(false)} error={formError} />
      )}
    </>
  );
};

export default CityForm;