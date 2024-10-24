import React, { useState, useEffect, useCallback } from 'react';
import { getReviews, deleteReview } from '../services/reviewService';
import './Styles/TrendingReviewPage.css';
import TrendingReviewCard from '../components/TrendingReviewCard';
import { useUser } from '../hooks/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationModal from '../components/ConfirmationModal';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar for notifications

const TrendingReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('mostLikes');
  const { user } = useUser();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state for notifications
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReviews(); // Fetch all reviews
      let filteredReviews = [];

      if (filterBy === 'likedByMe') {
        filteredReviews = data.filter(review => review.likedBy.includes(user._id));
      } else if (filterBy === 'unlikedByMe') {
        filteredReviews = data.filter(review => review.unlikedBy.includes(user._id));
      } else {
        filteredReviews = data;
      }

      if (sortBy === 'mostLikes') {
        filteredReviews.sort((a, b) => b.likedBy.length - a.likedBy.length);
      } else if (sortBy === 'mostUnlikes') {
        filteredReviews.sort((a, b) => b.unlikedBy.length - a.unlikedBy.length);
      }

      setReviews(filteredReviews);
    } catch (error) {
      setErrorMessage('Error fetching reviews'); // Set error message
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, filterBy, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRemoveReview = (reviewId) => {
    setReviewIdToDelete(reviewId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (reviewIdToDelete) {
      try {
        await deleteReview(reviewIdToDelete, user.token);
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewIdToDelete)); // Remove from state
        setSnackbarOpen(true); // Open Snackbar notification
      } catch (error) {
        console.error('Error removing review:', error);
        setErrorMessage('Error removing review'); // Set error message
      }
    }
    cancelDeleteReview();
  };

  const cancelDeleteReview = () => {
    setShowConfirmDelete(false);
    setReviewIdToDelete(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setSortBy('mostLikes');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <div className="trending-reviews">
        <h2>Trending Reviews</h2>
        <div className="filter-sort-container">
          <div className="filter-options">
            <h3>Select a filter:</h3>
            <button
              className={filterBy === 'all' ? 'active' : ''}
              onClick={() => handleFilterChange('all')}
            >
              All Reviews
            </button>
            <button
              className={filterBy === 'likedByMe' ? 'active' : ''}
              onClick={() => handleFilterChange('likedByMe')}
              disabled={!user || user.isAdmin}
            >
              Liked by Me
            </button>
            <button
              disabled={!user || user.isAdmin}
              className={filterBy === 'unlikedByMe' ? 'active' : ''}
              onClick={() => handleFilterChange('unlikedByMe')}
            >
              Unliked by Me
            </button>
          </div>

          <div className="sort-options">
            <h3>Sort results:</h3>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="sort-dropdown"
            >
              <option value="mostLikes">Most Likes</option>
              <option value="mostUnlikes">Most Unlikes</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className='loader'><CircularProgress /></div>
        ) : (
          <div className="reviews-container">
            {reviews.length === 0 ? (
              <div>No reviews found</div>
            ) : (
              reviews.map((review) => (
                <TrendingReviewCard key={review._id} review={review} handleRemoveReview={handleRemoveReview} />
              ))
            )}
          </div>
        )}
      </div>

      {showConfirmDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this review?"
          onConfirm={confirmDelete}
          onCancel={cancelDeleteReview}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Review deleted successfully"
        autoHideDuration={3000}
      />

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
};

export default TrendingReviewPage;
