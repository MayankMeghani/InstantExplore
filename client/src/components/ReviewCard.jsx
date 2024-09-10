import React from 'react';
import "./Styles/ReviewCard.css";
import { Star } from 'lucide-react';

const ReviewCard = ({ Id, title, review, modifiable,handleModifyReview,handleRemoveReview })=>{   
  return(
            <div key={Id} className="review">
            <div className="review-header">
             
              <span className="reviewer-name">{title}</span>
              <span className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.rating ? "gold" : "none"}
                    stroke={i < review.rating ? "gold" : "currentColor"}
                  />
                ))}
              </span>
            </div>
            <p className="review-text">{review.text}</p>
            { modifiable&& (
              <>
              <button 
              className="modify-review-btn" 
              onClick={() => handleModifyReview(review._id)} >
              Modify
            </button>
            <button 
              className="remove-review-btn" 
              onClick={() => handleRemoveReview(review._id)}>
              Remove
            </button>
              </>
            )}
          </div>
          );
}

export default ReviewCard;