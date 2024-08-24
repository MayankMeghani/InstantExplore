// src/Components/pages/LogIn.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './Auth.module.css';

const LogIn = () => {
  return (
    <div>
      <Header />
      <div className={styles.authPageWrapper}>
        <div className={styles.authContainer}>
          <h2 className={styles.authTitle}>Log In</h2>
          <form className={styles.authForm}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className={styles.authButton}>Log In</button>
            <div className={styles.authLink}>
              <span>Don't have an account? </span>
              <a href="/signin">Sign up</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LogIn;
