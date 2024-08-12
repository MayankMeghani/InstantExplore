import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're passing the ID via URL params
import Attraction from './Attraction';
import { getAttraction } from '../services/attractionService';

const AttractionPage = () => {
  const { attractionId } = useParams(); // Get the attraction ID from the URL
  const [attractionData, setAttractionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const data = await getAttraction(attractionId);
        console.log('Fetched attraction:', data); // Log the fetched attraction data for debugging purposes
        setAttractionData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [attractionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <Attraction attraction={attractionData} />;
};

export default AttractionPage;
