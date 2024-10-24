import React, { useState } from 'react';
import Footer from '../components/Footer';
import styles from './Styles/Auth.module.css';
import { logIn } from '../services/AuthenticationService';
import { useNavigate, useLocation  } from 'react-router-dom';
import { useUser } from '../hooks/userContext';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const location = useLocation();


  React.useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email,
        password
      };
      const response = await logIn(userData);
      setError('');    
      setMessage(response.message); 
      
      // Store the token in local storage
      localStorage.setItem('token', response.token);
      
      // Update the user context
      updateUser();

      // Optionally redirect based on role
      navigate('/'); // Adjust based on user role if necessary

      // Reset form fields after successful login
      setEmail('');
      setPassword('');

    } catch (err) {
      setMessage('');
      console.log(err);
      setError(err.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div>
      <div className={styles.authPageWrapper}>
        <div className={styles.authContainer}>
          <h2 className={styles.authTitle}>Log In</h2>
          {error && <p className={styles.errorMessage}>{error}<br /></p>}
          {message && <div className={styles.successMessage}>{message}<br /></div>}
          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} // Added value for controlled component
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} // Added value for controlled component
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className={styles.authButton}>Log In</button>
            <div className={styles.authLink}>
              <span>New here? </span>
              <a href="/signup">Want to Create Account</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LogIn;
