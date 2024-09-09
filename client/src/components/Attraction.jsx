import React, {useState } from 'react';
import './Styles/Attraction.css';
import ReviewForm from '../Forms/ReviewForm.jsx';
import { createReview, updateReview, deleteReview } from '../services/attractionService';
import ImageGrid from './ImageGrid.jsx';
import './Styles/Modal.css';
import ReviewCard from './ReviewCard.jsx';

const Attraction = ({ attraction, user }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  const handleClose = () => {
    setShowReviewForm(false); 
  };

  const handleSubmitReview = async (review) => {
    try {
      if (reviewToEdit) {
        const updatedReview = await updateReview(reviewToEdit._id, review);
        console.log('Review updated:', updatedReview);
      } else {
        console.log(review);
        const newReview = await createReview(review);
        console.log('New review created:', newReview);
      }
      setShowReviewForm(false);
      setReviewToEdit(null);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleModifyReview = (reviewId) => {
    const reviewToModify = attraction.reviews.find(review => review._id === reviewId);
    setReviewToEdit(reviewToModify);
    setShowReviewForm(true);
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      console.log(`Review with ID: ${reviewId} removed`);
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
        {user && user.role==="User" &&( <button className="write-review-btn" onClick={() => {
          setReviewToEdit(null);
          setShowReviewForm(true);
        }}>
          Write a Review
        </button>
        )}
        {attraction.reviews.map((review, index) => (
          <ReviewCard Id={index} title={review.user.name} review={review} modifiable={(user.role==="Admin")} handleModifyReview={handleModifyReview} handleRemoveReview={handleRemoveReview}/>
        ))}
      </div>

      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
            <h3>{reviewToEdit === null ? 'Write a Review' : 'Edit Review'}</h3>
            <button className="close-button" onClick={handleClose}>&times;</button>
            </div>
            <div className="modal-body"></div>
        <ReviewForm
          attraction={attraction._id}
          user={user._id}
          initialReview={reviewToEdit}
          onSubmit={handleSubmitReview}
        />
         </div>
          </div>
      )}
    </div>
  );
};

export default Attraction;