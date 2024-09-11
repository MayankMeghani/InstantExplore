import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VideoSection from '../components/VideoSection';
const HomePage = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <VideoSection/>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;