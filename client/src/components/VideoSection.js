// src/Components/VideoSection.js
import React from 'react';
import './Styles/VideoSection.css';
import { useNavigate } from 'react-router-dom';

const VideoSection = () => {
  
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/cities');
  };

  return (
    <div className="video-container">
      <video autoPlay muted loop className="background-video">
        <source src={'https://firebasestorage.googleapis.com/v0/b/instantexplore.appspot.com/o/explore.mp4?alt=media&token=e105d156-c66a-4f8b-9ce4-8e2b19bc1403'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay-content">
        <h1>Explore the World</h1>
        <p>Your adventure starts here. Find the best experiences and activities.</p>
        <button onClick={handleRedirect} >Discover More</button>
      </div>
    </div>
  );
};

export default VideoSection;
