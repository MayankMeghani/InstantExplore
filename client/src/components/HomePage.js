// src/Components/pages/HomePage.js
import React from 'react';
import Header from '../Header';
import MainContent from '../MainContent';
import Footer from '../Footer';
import VideoSection from '../VideoSection';


const HomePage = () => {
  return (
    <div>
      <Header />
      {/* <MainContent /> */}
      <VideoSection />
      <Footer />
      
    </div>
  );
};

export default HomePage;
