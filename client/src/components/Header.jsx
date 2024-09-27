import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Styles/Header.css';
import { useUser } from '../hooks/userContext';
import { logOut } from '../services/AuthenticationService';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user, updateUser } = useUser(); 

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();  // Assuming logOut is an async function
      updateUser();  // Update the user context
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [updateUser, navigate]);

  return (
    <header className={`header ${isHomePage ? 'home' : ''}`}>
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/instantexplore.appspot.com/o/Background%2Flogo.png?alt=media&token=3546f92a-27a7-47a0-baa6-530f7788a7cb"
            alt="InstantExplore Logo"
            className="logo-img"
          />
          InstantExplore
        </Link>
  
        <Link to="/" className={`nav-link ${isHomePage ? 'active' : ''}`}>
          Home
        </Link>

        <Link to="/cities" className="nav-link">
              Cities
        </Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">
              Log-in
            </Link>
            <Link to="/signup" className="nav-link">
              Sign-Up
            </Link>
          </>
        ) : (
          <>
            {!user.isAdmin && (
              <>
              <Link to="/reviews" className="nav-link">
                My Reviews
              </Link>

              <Link to="/requests" className="nav-link">
              Suggestions
            </Link>
            </>
            )}

            {user.isAdmin && (
              <>
              <Link to="/requests" className="nav-link">
                Requests
              </Link>

              <Link to="/panel" className="nav-link">
                Admin Dashboard
              </Link>
              </>
            )}
            <button onClick={handleLogout} className="nav-link logout-button">
              Log-out
            </button>
          </>
        )}
      </div>
    </header>
  );
  
};

export default Header;