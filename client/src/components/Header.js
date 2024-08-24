// src/Components/Header.js
import React from 'react';
import './Styles/Header.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src={'https://firebasestorage.googleapis.com/v0/b/instantexplore.appspot.com/o/Background%2Flogo.png?alt=media&token=884161e5-0fa3-4211-ac55-e7fec6d12581'} alt="InstantExplore Logo" className="logo-img" />
        InstantExplore
      </Link>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/login">Log-in</Link> {/* Link to Log-In page */}
        <Link to="/signin">Sign-in</Link> {/* Link to Sign-In page */}
      </nav>
      <button className="header-toggle">☰</button>
    </header>
  );
};

export default Header;
