// src/Components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo.png';
import Search from './Search'; // Import the Search component

const Header = ({ showSearch }) => { // Add showSearch as a prop
  const location = useLocation();
  const isTransparent = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signin';

  return (
    <header className={`header ${isTransparent ? 'transparent' : 'solid'}`}>
      <Link to="/" className="header-logo">
        <img src={logo} alt="InstantExplore Logo" className="logo-img" />
        InstantExplore
      </Link>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/login">Log-in</Link>
        <Link to="/signin">Sign-in</Link>
      </nav>
      {showSearch && <Search />} {/* Conditionally render the Search component */}
      <button className="header-toggle">☰</button>
    </header>
  );
};

export default Header;
