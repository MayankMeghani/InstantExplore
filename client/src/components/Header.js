// src/Components/Header.js
import React from 'react';
import './Header.css';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src={logo} alt="InstantExplore Logo" className="logo-img" />
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
