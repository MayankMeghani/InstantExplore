import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/home.css';

function Home() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/cities');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleRedirect} className="redirect-button">
          Go to Cities
        </button>
      </header>
    </div>
  );
}

export default Home;
