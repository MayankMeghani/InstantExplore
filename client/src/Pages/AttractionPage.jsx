import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're passing the ID via URL params
import Attraction from '../components/Attraction';
import { getAttraction } from '../services/attractionService';
import Header from '../components/Header';
const AttractionPage = () => {
  const { attractionId } = useParams(); // Get the attraction ID from the URL
  const [attractionData, setAttractionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const data = await getAttraction(attractionId);
        console.log('Fetched attraction:', data); 
        setAttractionData(data);
        
        const user = JSON.parse(sessionStorage.getItem('user'));
        if(user){
        setUser(
          {
            _id:user._id,
            name:user.name,
            email:user.email,
            role:(user.isAdmin)?"Admin":"User"
          }
        )
        }else{
        setUser({
          role:null
        });
  
      }
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

  return(
    <>
    <Header/>
    <Attraction attraction={attractionData} user={user} />
    
    </>
  );
};

export default AttractionPage;
