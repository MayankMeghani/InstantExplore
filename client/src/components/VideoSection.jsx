import React, { useEffect, useState } from 'react';
import './Styles/VideoSection.css';
import { useNavigate } from 'react-router-dom';

const VideoSection = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [welcomeMessage,setWelcomeMessage] = useState('Welcome to InstantExplore!');
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
    setWelcomeMessage(`Welcome back,${user.name}`);
    }
  },[])
  const handleRedirect = () => {
    navigate('/cities');
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className="video-container">
      {!isVideoLoaded && (
        <div className="placeholder-image">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/instantexplore.appspot.com/o/Background%2FScreenshot%20(27).png?alt=media&token=6e39dc98-10b0-4b1b-8e0b-50026b045cfd"
            alt="Placeholder"
          />
        </div>
      )}
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
      <div className="overlay-content">
        <p>{welcomeMessage}</p>
        <h1>Explore the World</h1>
        <p>Your adventure starts here. Find the best experiences and activities.</p>
        <button onClick={handleRedirect}>Discover More</button>
      </div>
    </div>
  );
};

export default VideoSection;
