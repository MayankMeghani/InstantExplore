import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const ReviewForm = ({ attraction, user,initialReview, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setReviewText(initialReview.text);
    }
  }, [initialReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reviewData = {
      attraction,
      user,
      rating,
      text: reviewText,
    };
    if (initialReview) {
      reviewData._id = initialReview._id;
    }
    onSubmit(reviewData);
  };

  return (
    <div className="review-form-overlay">
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="rating-input">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={24}
              fill={i < rating ? "gold" : "none"}
              stroke={i < rating ? "gold" : "currentColor"}
              onClick={() => setRating(i + 1)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <div className="form-buttons">
          <button type="submit">
            {initialReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;