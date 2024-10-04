import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress'; 
import Footer from '../components/Footer';
import VideoSection from '../components/VideoSection';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  const handleVideoLoad = () => {
    setLoading(false);
  };

  return (
    <div className="app-container">
      {loading  && <div className='loader'><CircularProgress /></div>} 

      <main className="main-content">
        <VideoSection onLoad={handleVideoLoad} />
      </main>

      {!loading && <Footer />}
    </div>
  );
};

export default HomePage;
