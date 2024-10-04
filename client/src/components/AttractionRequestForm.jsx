// AttractionRequestForm.jsx
import React, { useState } from 'react';
import { sendAttractionRequest } from '../services/attractionService'; // Create this in services

const AttractionRequestForm = () => {
  const [attractionName, setAttractionName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await sendAttractionRequest({ name: attractionName, description });
      setSuccess('Attraction request submitted successfully.');
      setAttractionName('');
      setDescription('');
    } catch (error) {
      setError('Error submitting attraction request. Please try again.');
    }
  };

  return (
    <div>
      <h2>Submit an Attraction Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Attraction Name:</label>
          <input
            type="text"
            value={attractionName}
            onChange={(e) => setAttractionName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Request</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default AttractionRequestForm;
