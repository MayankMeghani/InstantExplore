import React, { useState, useEffect } from 'react';
import { getCountries, updateCountry, updateState, deleteCountry, deleteState ,getCountryStates } from '../services/stateService'; // Import your service functions
import {useUser} from '../hooks/userContext';
import Button from '../components/addButton';
import CountryForm from '../Forms/CountryForm';
import { createCountry , createState } from '../services/stateService';
import StateForm from '../Forms/StateForm';


const AdminPanel = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [editingStateId, setEditingStateId] = useState(null);
  const{user} = useUser();
  const [showCountryForm, setshowCountryForm] = useState(false);
  const [showStateForm, setshowStateForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const countriesData = await getCountries();
      setCountries(countriesData);
    }
    fetchData();
  }, []);

  const handleButtonClick = () => {
    setSelectedCountry(null);
    setshowCountryForm(!showCountryForm);
  };

  const handleClose = () => {
    setshowCountryForm(false);
    setSelectedCountry(null);
  };

  const handleStateButtonClick = () => {
    setshowStateForm(!showStateForm);
  };

  const handleCloseState = () => {
    setshowStateForm(false);
  };

  const handleCountryFormSubmit = async(newCountry)=>{
    try {
        const response = await createCountry(newCountry,user.token);
        setCountries([...countries, response]);
        setshowCountryForm(false);
      } catch (error) {
        console.error('Error adding new country:', error);
        setError(error.response?.data?.message);
      }
  }

  const handleStateFormSubmit = async(newState)=>{
    try {
        const response = await createState(newState,user.token);
        setStates([...states, response]);
        setshowStateForm(false);
      } catch (error) {
        console.error('Error adding new state:', error);
        setError(error.response?.data?.message);
      }
  }

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    try{
    setStates([]);
    const statesData = await getCountryStates(country._id);
    setStates(statesData);
    }
    catch(error){
      console.error('Error fetching states:', error.response?.data?.message);
    }
  };


  const handleUpdateCountry = async (id) => {
    await updateCountry(id, { name: countryName },user.token);
    setEditingCountryId(null);
    refreshCountries();
  };

  const handleUpdateState = async (id) => {
    await updateState(id, { name: stateName },user.token);
    setEditingStateId(null);
    refreshStates();
  };

  const handleDeleteCountry = async (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      await deleteCountry(id,user.token);
      refreshCountries();
    }
  };

  const handleDeleteState = async (id) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      await deleteState(id,user.token);
      refreshStates();
    }
  };

  const refreshCountries = async () => {
    const countriesData = await getCountries();
    setCountries(countriesData);
    setSelectedCountry(null);
    setStates([]);
  };

  const refreshStates = async () => {
    if (selectedCountry) {
      const statesData = await getCountryStates(selectedCountry._id);
      setStates(statesData);
    }
  };



  return (
    <>
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="country-management">
        <h3>Countries</h3>
        <ul>
          {countries.map((country) => (
            <li key={country._id}>
              {editingCountryId === country._id ? (
                <>
                  <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    placeholder="Country Name"
                  />
                  <button onClick={() => handleUpdateCountry(country._id)}>Save</button>
                  <button onClick={() => setEditingCountryId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {country.name}
                  <button onClick={() => {
                    setEditingCountryId(country._id);
                    setCountryName(country.name);
                  }}>Edit</button>
                  <button onClick={() => handleDeleteCountry(country._id)}>Delete</button>
                  <button onClick={() => handleCountrySelect(country)}>View States</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {selectedCountry && (
        <div className="state-management">
          <h3>States in {selectedCountry.name}</h3>
          <ul>
            {states.map((state) => (
              <li key={state._id}>
                {editingStateId === state._id ? (
                  <>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State Name"
                    />
                    <button onClick={() => handleUpdateState(state._id)}>Save</button>
                    <button onClick={() => setEditingStateId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {state.name}
                    <button onClick={() => {
                      setEditingStateId(state._id);
                      setStateName(state.name);
                    }}>Edit</button>
                    <button onClick={() => handleDeleteState(state._id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
        <Button onClick={handleButtonClick}>
            {showCountryForm ? 'Cancel' : 'Add Country'}
        </Button>
        <Button onClick={handleStateButtonClick}>
            {showCountryForm ? 'Cancel' : 'Add State'}
        </Button>
    
    </div>    
      {showCountryForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Country</h2>
              <button className="close-button" onClick={handleClose}>&times;</button>
            </div>
            <div className="modal-body">
              <CountryForm
                onSubmit={handleCountryFormSubmit}
                error={error}
              />
            </div>
          </div>
        </div>
      )}
      {showStateForm && (
        <div className="modal-overlay">
            <div className='modal-content'>
            <div className='modal-header'>
                <h2>Add State</h2>
                <button className='close-button' onClick={handleCloseState}>&times;</button>
                </div>
                <div className='modal-body'>
                    <StateForm
                        onSubmit={handleStateFormSubmit}
                        error={error}
                        countryId={selectedCountry?._id}
                    />
            </div>
            </div>
        </div>
    )}
    </>
  );
};

export default AdminPanel;
