import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './hooks/userContext'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage';
import CityList from './Pages/CityList';
import AttractionList from './Pages/AttractionList';
import AttractionPage from './Pages/AttractionPage';
import ReviewList from './Pages/ReviewList';
import Login from './Forms/LogIn';
import SignUp from './Forms/SignUp';
import AdminPanel from './Pages/AdminPanel';
import TrendingReviewPage from './Pages/TrendingReviewPage';
import RequestList from './Pages/RequestList';
import Header from './components/Header';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
      <Header /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cities" element={<CityList />} />
          <Route path="/cities/:cityId/attractions" element={<AttractionList />} />
          <Route path="/cities/:cityId/attractions/:attractionId" element={<AttractionPage />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/Panel" element={<AdminPanel />} />
          <Route path="/trendings" element={<TrendingReviewPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
