
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage';
import CityList from './Pages/CityList';
import AttractionList from './Pages/AttractionList';
import AttractionPage from './Pages/AttractionPage';
import Login from './Forms/LogIn';
import SignUp from './Forms/Sign';
import ReviewList from './Pages/ReviewList';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cities" element={<CityList />} />
        <Route path="/cities/:cityId/attractions" element={<AttractionList />} />
        <Route path="/cities/:cityId/attractions/:attractionId" element={<AttractionPage/>} />
        <Route path="/Reviews" element={<ReviewList />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
