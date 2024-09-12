import React, { useState, useEffect } from 'react';
import CountryForm from './CountryForm';  
import { getCountries,createCountry } from '../services/stateService';
import { useUser } from '../hooks/userContext';
const StateForm = ({ onSubmit, onCancel ,error}) => {
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [message, setMessage] = useState(null);
  const {user} = useUser();
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response);
    } catch (error) {
      console.log('Error fetching countries:', error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: stateName, country });
  };

  const handleAddCountry = () => {
    setShowCountryForm(true);
  };

  const handleCountryFormSubmit = async (newCountry) => {
    try {
      setMessage(null);
      const response = await createCountry(newCountry,user.token);
      setMessage("New Country added successfully");
      setCountries([...countries, response]);
      setCountry(response._id);
      setShowCountryForm(false);
    } catch (error) {
      console.error('Error adding new country:', error);
      setFormError(error.response?.data?.message);
    }
  };

  return (
    <>      
     {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>} 
     {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="stateName">State Name:</label>
        <input
          type="text"
          id="stateName"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="">Select a country</option>
          {countries.map((countryOption) => (
            <option key={countryOption._id} value={countryOption._id}>
              {countryOption.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddCountry}>Add New Country</button>
      </div>
      <button type="submit">Add State</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
      {showCountryForm && (
        <CountryForm onSubmit={handleCountryFormSubmit} onCancel={() => setShowCountryForm(false)} error={formError}/>
      )}
    </>
  );
};

export default StateForm;