
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import CityList from './components/CityList';
import AttractionList from './components/AttractionList';
import AttractionPage from './components/AttractionPage';
import SighIn from './components/SignIn';
import Login from './components/LogIn';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cities" element={<CityList />} />
        <Route path="/cities/:cityId/attractions" element={<AttractionList />} />
        <Route path="/cities/:cityId/attractions/:attractionId" element={<AttractionPage/>} />
        <Route path="/signin" element={<SighIn />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
