import React, { useState } from 'react';

const CountryForm = ({ onSubmit, onCancel,error }) => {
  const [countryName, setCountryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: countryName });
  };

  return (
    <>
    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}   
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="countryName">Country Name:</label>
        <input
          type="text"
          id="countryName"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Country</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
    </>
  );
};

export default CountryForm;