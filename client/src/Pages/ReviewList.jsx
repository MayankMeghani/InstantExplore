import React, { useState, useEffect } from "react";
import { getUserReviews } from "../services/userServices";  
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../Forms/ReviewForm";
import { createReview, updateReview, deleteReview } from "../services/reviewService";
import Search from "../components/Search";
import ConfirmationModal from "../components/ConfirmationModal"; // Import the Confirmation Modal
import "./Styles/ReviewList.css";
import { useUser } from '../hooks/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from "../hooks/snackbarContext";  

const ReviewList = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for confirmation modal
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null); // Store the ID of the review to delete
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();  

  useEffect(() => {
    if (user) {
      fetchReviews(user._id);
    }
  }, [user]);

  const handleClose = () => {
    setShowReviewForm(false);
    setReviewToEdit(null);
  };

  const handleModifyReview = (reviewId) => {
    const reviewToModify = reviews.find(review => review._id === reviewId);
    setReviewToEdit(reviewToModify);
    setShowReviewForm(true);
  };

  // Open the confirmation modal
  const handleRemoveReview = (reviewId) => {
    setReviewIdToDelete(reviewId);
    setShowConfirmDelete(true);
  };

  // Confirm deletion of the review
  const confirmDeleteReview = async () => {
    try {
      await deleteReview(reviewIdToDelete, user.token);
      console.log(`Review with ID: ${reviewIdToDelete} removed`);
      showSnackbar('Review removed successfully!');
      fetchReviews(user._id); 
    } catch (error) {
      console.error('Error removing review:', error);
    } finally {
      setShowConfirmDelete(false); // Close the confirmation modal
      setReviewIdToDelete(null); // Clear the review ID
    }
  };

  // Cancel deletion
  const cancelDeleteReview = () => {
    setShowConfirmDelete(false);
    setReviewIdToDelete(null);
  };

  const handleSubmitReview = async (review) => {
    try {
      if (reviewToEdit) {
        const updatedReview = await updateReview(reviewToEdit._id, review, user.token);
        showSnackbar('Review updated successfully!');
        console.log('Review updated:', updatedReview);
      } else {
        const newReview = await createReview(review, user.token);
        console.log('New review created:', newReview);
        showSnackbar('Review created successfully!');
      }
      setShowReviewForm(false);
      fetchReviews(user._id);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredReviews = reviews.filter(review =>
    review.attraction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchReviews = async (id) => {
    setLoading(true);
    try {
      const data = await getUserReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) return <div className='loader'><CircularProgress /></div>;

  return (
    <>
      <div className="list">
        <Search onSearch={handleSearch} />
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review._id} // Use unique ID for key
              title={review.attraction.name}
              modifiable={true}
              review={review}
              handleModifyReview={handleModifyReview}
              handleRemoveReview={handleRemoveReview} // Pass the handler
            />
          ))
        ) : (
          <div>No reviews found.</div>
        )}
      </div>

      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{reviewToEdit === null ? 'Write a Review' : 'Edit Review'}</h3>
              <button className="close-button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <ReviewForm
              attraction={reviewToEdit ? reviewToEdit.attraction._id : null}
              user={user._id}
              initialReview={reviewToEdit}
              onSubmit={handleSubmitReview}
            />
          </div>
        </div>
      )}

      {showConfirmDelete &&
      <ConfirmationModal
        message="Are you sure you want to delete this review?"
        onConfirm={confirmDeleteReview}
        onCancel={cancelDeleteReview}
      />
      }
    </>
  );
};

export default ReviewList;
