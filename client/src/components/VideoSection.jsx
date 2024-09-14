import React, { useEffect, useState, useCallback } from 'react';
import './Styles/VideoSection.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/userContext';

const VideoSection = ({onLoad}) => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome to InstantExplore!');
  const { user } = useUser();  // Correctly destructure the user from useUser hook

  useEffect(() => {
    if (user && user.name) {
      setWelcomeMessage(`Welcome back, ${user.name}!`);
    } else {
      setWelcomeMessage('Welcome to InstantExplore!');
    }
  }, [user]);

  const handleRedirect = useCallback(() => {
    navigate('/trendings');
  }, [navigate]);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
    onLoad(true);
  }, [onLoad]);

  return (
    <div className="video-container">
      <video
        autoPlay
        muted
        loop
        className={`background-video ${isVideoLoaded ? 'loaded' : ''}`}
        onLoadedData={handleVideoLoad}
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/instantexplore.appspot.com/o/explore.mp4?alt=media&token=e105d156-c66a-4f8b-9ce4-8e2b19bc1403"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {isVideoLoaded &&
            <div className="overlay-content">
            <p>{welcomeMessage}</p>
            <h1>Explore the World</h1>
            <p>Your adventure starts here. Find the best experiences and activities.</p>
            <button onClick={handleRedirect}>Discover More</button>
          </div>
    }
    </div>
  );
};

export default VideoSection;