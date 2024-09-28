import React, { useState } from 'react';
import Footer from '../components/Footer';
import VideoSection from '../components/VideoSection';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  const handleVideoLoad = () => {
    setLoading(false); 
  };

  return (
    <div className="app-container">
      {loading && <div>Loading Home...</div>} 
      
      
      <main className="main-content">
        <VideoSection onLoad={handleVideoLoad} /> 
      </main>

      {!loading && <Footer />} 
    </div>
  );
};

export default HomePage;
