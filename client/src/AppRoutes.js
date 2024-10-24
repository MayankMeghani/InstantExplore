import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ReviewList from './Pages/ReviewList';
import RequestList from './Pages/RequestList';
import AdminPanel from './Pages/AdminPanel';
import HomePage from './Pages/homePage';
import CityList from './Pages/CityList';
import AttractionList from './Pages/AttractionList';
import AttractionPage from './Pages/AttractionPage';
import TrendingReviewPage from './Pages/TrendingReviewPage';
import Login from './Forms/LogIn';
import SignUp from './Forms/SignUp';
import NotFound from './components/NotFound';
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/cities" element={<CityList />} />
    <Route path="/cities/:cityId/attractions" element={<AttractionList />} />
    <Route path="/cities/:cityId/attractions/:attractionId" element={<AttractionPage />} />
    <Route path="/reviews" element={<ProtectedRoute><ReviewList /></ProtectedRoute>} />
    <Route path="/requests" element={<ProtectedRoute><RequestList /></ProtectedRoute>} />
    <Route path="/panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
    <Route path="/trendings" element={<TrendingReviewPage />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<NotFound />} /> 

  </Routes>
);

export default AppRoutes;
