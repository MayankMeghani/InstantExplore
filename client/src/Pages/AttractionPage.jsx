import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Attraction from '../components/Attraction';
import { getAttraction } from '../services/attractionService';
import { useUser } from '../hooks/userContext';
import CircularProgress from '@mui/material/CircularProgress'; 

const AttractionPage = () => {
  const { attractionId } = useParams(); // Get the attraction ID from the URL
  const [attractionData, setAttractionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Memoized function to fetch attraction data
  const fetchAttraction = useCallback(async () => {
    setLoading(true); // Reset loading state
    try {
      const data = await getAttraction(attractionId);
      setAttractionData(data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [attractionId]); // Dependency array ensures it updates if attractionId changes

  // Effect to fetch attraction data on mount
  useEffect(() => {
    fetchAttraction();
  }, [fetchAttraction]); // Use fetchAttraction here

  // Handle user state
  const userInfo = user
    ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "Admin" : "User",
        token: user.token,
      }
    : { role: null };

  if (loading) return <div className='loader'><CircularProgress /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Attraction 
      initialAttraction={attractionData} 
      user={userInfo} 
      onRefresh={fetchAttraction} // Pass refresh function
    />
  );
};

export default AttractionPage;
