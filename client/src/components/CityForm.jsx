import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../api/firebase';

const CityForm = ({ initialData, onSubmit, mode }) => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get(`/states`);
        setStates(response.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cityData = {
      name,
      state,
      images: [imageUrl]
    };

    try {
      console.log('City data:', cityData);
      onSubmit(cityData);
      alert(`City ${mode === 'add' ? 'added' : 'updated'} successfully!`);
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} city:`, error);
    }
  };

  return (
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
              {stateOption.name}
            </option>
          ))}
        </select>
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
      <button type="submit">{mode === 'add' ? 'Add City' : 'Update City'}</button>
    </form>
  );
};

export default CityForm;