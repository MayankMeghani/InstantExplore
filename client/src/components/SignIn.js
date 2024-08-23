// src/Components/pages/SignIn.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './Auth.module.css';

const SignIn = () => {
  return (
    <div>
      <Header />
      <div className={styles.authPageWrapper}>
        <div className={styles.authContainer}>
          <h2 className={styles.authTitle}>Sign In</h2>
          <form className={styles.authForm}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className={styles.authButton}>Sign In</button>
            <div className={styles.authLink}>
              <span>New here? </span>
              <a href="/signup">Create an account</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
