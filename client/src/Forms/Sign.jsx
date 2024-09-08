import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Styles/Auth.module.css';
import {signUp} from '../services/AuthenticationService'

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(password!== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const userData ={
        name,
        email,
        password,
        isAdmin
      }
      const response=await signUp(userData);
  
      setMessage(response.message); 
      setError(''); 

    } catch (err) {
      setMessage('');
      console.log(err);
      setError(err.response.data.error);
      }
  };

  return (
    <div>
      <Header />
      <div className={styles.authPageWrapper}>
        <div className={styles.authContainer}>
          <h2 className={styles.authTitle}>Sign Up</h2>
          {error && <p className={styles.errorMessage}>{error}<br></br></p>}
          {message && <div className={styles.successMessage}>{message}<br></br></div>}

          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
            </div>

              <label>Select Role</label>
              <div className={styles.radioGroup}>
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="false"
                  checked={!isAdmin} // If isAdmin is false, this radio button will be checked
                  onChange={(e) => setIsAdmin(e.target.value === "true")}
                />
                <label htmlFor="user">User</label>

                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="true"
                  checked={isAdmin} // If isAdmin is true, this radio button will be checked
                  onChange={(e) => setIsAdmin(e.target.value === "true")}
                />
                <label htmlFor="admin">Admin</label>
              
            </div>


            <button type="submit" className={styles.authButton}>Sign In</button>

            <div className={styles.authLink}>

              <span>Already have an account? </span>
              <a href="/login">login</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
