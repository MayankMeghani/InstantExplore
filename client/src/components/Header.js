// src/Components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">InstantExplore</div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} MySite. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
