import React, { useState } from 'react';
import './Styles/Attraction.css';
import ReviewForm from '../Forms/ReviewForm.jsx';
import { createReview, updateReview, deleteReview } from '../services/reviewService.js';
import ImageGrid from './ImageGrid.jsx';
import './Styles/Modal.css';
import ReviewCard from './ReviewCard.jsx';

const Attraction = ({ initialAttraction, user }) => {
  const [attraction, setAttraction] = useState(initialAttraction); // State for attraction data
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleClose = () => {
    setShowReviewForm(false);
  };

  // Function to handle new review or update review
  const handleSubmitReview = async (review) => {
    try {
      let updatedAttraction;

      if (reviewToEdit) {
        const updatedReview = await updateReview(reviewToEdit._id, review, user.token);
        console.log('Review updated:', updatedReview);
        // Update the specific review in the attraction state
        updatedAttraction = {
          ...attraction,
          reviews: attraction.reviews.map(r => (r._id === updatedReview._id ? updatedReview : r)),
        };
      } else {
        const newReview = await createReview(review, user.token);
        console.log('New review created:', newReview);
        // Add new review to the attraction state
        updatedAttraction = {
          ...attraction,
          reviews: [...attraction.reviews, newReview],
        };
      }

      setAttraction(updatedAttraction); // Update the attraction with the new or updated review
      setShowReviewForm(false);
      setReviewToEdit(null);
      setFormError(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      setFormError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleModifyReview = (reviewId) => {
    const reviewToModify = attraction.reviews.find(review => review._id === reviewId);
    setReviewToEdit(reviewToModify);
    setShowReviewForm(true);
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      await deleteReview(reviewId, user.token);
      console.log(`Review with ID: ${reviewId} removed`);
      const updatedAttraction = {
        ...attraction,
        reviews: attraction.reviews.filter(review => review._id !== reviewId),
      };
      setAttraction(updatedAttraction); // Update the attraction with the deleted review
    } catch (error) {
      console.error('Error removing review:', error);
    }
  };

  return (
    <div className="attraction-container">
      <h1 className="attraction-name">{attraction.name}</h1>

      <ImageGrid images={attraction.images} />

      <div className="attraction-location">
        <h2>Location</h2>
        <p>{attraction.location}</p>
      </div>

      <div className="attraction-description">
        <h2>Description</h2>
        <p>{attraction.description}</p>
      </div>

      <div className="attraction-categories">
        <h2>Categories</h2>
        <div className="categories-list">
          {attraction.categories.map((cat, index) => (
            <span key={index} className="category-item">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="attraction-reviews">
        <h2>Reviews</h2>
        {user && user.role === "User" && (
          <button
            className="write-review-btn"
            onClick={() => {
              setReviewToEdit(null);
              setShowReviewForm(true);
            }}
          >
            Write a Review
          </button>
        )}
        {attraction.reviews.length > 0 ? (
          attraction.reviews.map((review, index) => (
            <ReviewCard
              key={index}
              Id={index}
              title={review.user.name}
              review={review}
              modifiable={user.role === "Admin"}
              handleModifyReview={handleModifyReview}
              handleRemoveReview={handleRemoveReview}
            />
          ))
        ) : (
          <div>No review found.</div>
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
            <div className="modal-body"></div>
            <ReviewForm
              attraction={attraction._id}
              user={user._id}
              initialReview={reviewToEdit}
              onSubmit={handleSubmitReview}
              error={formError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Attraction;
