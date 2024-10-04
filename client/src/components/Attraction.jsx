import React, { useState } from 'react';
import './Styles/Attraction.css';
import ReviewForm from '../Forms/ReviewForm.jsx';
import { createReview, updateReview, deleteReview } from '../services/reviewService.js';
import ImageGrid from './ImageGrid.jsx';
import './Styles/Modal.css';
import ReviewCard from './ReviewCard.jsx';
import { Star } from 'lucide-react';

const Attraction = ({ initialAttraction, user }) => {
  const [attraction, setAttraction] = useState(initialAttraction);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [formError, setFormError] = useState(null);
  const [sortBy, setSortBy] = useState('mostLikes');

  const handleClose = () => {
    setShowReviewForm(false);
  };

  const handleSubmitReview = async (review) => {
    try {
      let updatedAttraction;

      if (reviewToEdit) {
        const updatedReview = await updateReview(reviewToEdit._id, review, user.token);
        updatedAttraction = {
          ...attraction,
          reviews: attraction.reviews.map(r => (r._id === updatedReview._id ? updatedReview : r)),
        };
      } else {
        const newReview = await createReview(review, user.token);
        updatedAttraction = {
          ...attraction,
          reviews: [...attraction.reviews, newReview],
        };
      }

      setAttraction(updatedAttraction);
      setShowReviewForm(false);
      setReviewToEdit(null);
      setFormError(null);
    } catch (error) {
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
      const updatedAttraction = {
        ...attraction,
        reviews: attraction.reviews.filter(review => review._id !== reviewId),
      };
      setAttraction(updatedAttraction);
    } catch (error) {
      console.error('Error removing review:', error);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedReviews = [...attraction.reviews].sort((a, b) => {
    if (sortBy === 'mostLikes') {
      return b.likedBy.length - a.likedBy.length;
    } else if (sortBy === 'mostUnlikes') {
      return b.unlikedBy.length - a.unlikedBy.length;
    }
    return 0;
  });

  return (
    <div className="attraction-container">
      <br/><br/><br/>
      <div className="attraction-header">
      <h1 className="attraction-name">{attraction.name}</h1>
      {attraction.rating > 0 &&(
        <>  <div className="rating">
                <span>{attraction.rating.toFixed(1)}</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < attraction.rating ? "gold" : "none"}
                    stroke={i < attraction.rating ? "gold" : "currentColor"}
                  />
                ))}
              </div>
              </>
      )}
    </div> 
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

        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
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
