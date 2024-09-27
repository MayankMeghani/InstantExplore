import React, { useState, useEffect } from 'react';
import './Styles/ReviewCard.css';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'; // Icons for like/unlike
import { updateLike } from '../services/reviewService';
import { useUser } from '../hooks/userContext';

const ReviewCard = ({ Id, title, review, modifiable, handleModifyReview, handleRemoveReview }) => {
  const [showOverlay, setShowOverlay] = useState(false); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [liked, setLiked] = useState(null); 
  const [likeCount, setLikeCount] = useState(review.likedBy.length); 
  const [unlikeCount, setUnlikeCount] = useState(review.unlikedBy.length); 
  const { user } = useUser(); 

  useEffect(() => {
    if (user) {
      if (review.likedBy.includes(user._id)) {
        setLiked('like');
      } else if (review.unlikedBy.includes(user._id)) {
        setLiked('unlike');
      } else {
        setLiked(null);
      }
    }
  }, [user, review.likedBy, review.unlikedBy]);

    const openOverlay = (index) => {
      setCurrentImageIndex(index);
      setShowOverlay(true);
    };
  
    // Function to close the image overlay
    const closeOverlay = () => {
      setShowOverlay(false);
    };

  // Handle like action
  const handleLike = async () => {
    const newLikeStatus = liked === 'like' ? null : 'like';
    const prevLiked = liked; // Save previous like state to revert if API fails

    // Optimistically update the UI
    if (newLikeStatus === 'like') {
      setLikeCount(likeCount + 1);
      if (liked === 'unlike') setUnlikeCount(unlikeCount - 1); // Remove from unlikes if previously unliked
    } else {
      setLikeCount(likeCount - 1);
    }
    setLiked(newLikeStatus);

    try {
      // Call the updateLike method from reviewService with reviewId, like status, and user info
      await updateLike(review._id, newLikeStatus, user);
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert the like status if the API call fails
      setLiked(prevLiked);
      setLikeCount(prevLiked === 'like' ? likeCount : likeCount - 1);
      if (liked === 'unlike') setUnlikeCount(unlikeCount + 1);
    }
  };

  // Handle unlike action
  const handleUnlike = async () => {
    const newLikeStatus = liked === 'unlike' ? null : 'unlike';
    const prevLiked = liked; // Save previous like state to revert if API fails

    // Optimistically update the UI
    if (newLikeStatus === 'unlike') {
      setUnlikeCount(unlikeCount + 1);
      if (liked === 'like') setLikeCount(likeCount - 1); // Remove from likes if previously liked
    } else {
      setUnlikeCount(unlikeCount - 1);
    }
    setLiked(newLikeStatus);

    try {
      // Call the updateLike method from reviewService with reviewId, unlike status, and user info
      await updateLike(review._id, newLikeStatus, user);
    } catch (error) {
      console.error("Error updating unlike status:", error);
      // Revert the like status if the API call fails
      setLiked(prevLiked);
      setUnlikeCount(prevLiked === 'unlike' ? unlikeCount : unlikeCount - 1);
      if (liked === 'like') setLikeCount(likeCount + 1);
    }
  };

  return (
    <div key={Id} className="review">
      <div className="review-header">
        <span className="reviewer-name">{title}</span>
        <span className="review-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < review.rating ? 'gold' : 'none'}
              stroke={i < review.rating ? 'gold' : 'currentColor'}
            />
          ))}
        </span>
      </div>
      <p className="review-text">{review.text}</p>

      {review.images && review.images.length > 0 && (
        <div className="review-images">
          {review.images.slice(0, 2).map((image, index) => (
            <img
              key={index}
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt={`Review  ${index + 1}`}
              className="review-thumbnail"
              onClick={() => openOverlay(index)}
            />
          ))}

          {review.images.length > 2 && (
            <div className="view-more-thumbnail" onClick={() => openOverlay(2)}>
              <img
                src={review.images[2]}
                alt="View More"
                className="review-thumbnail"
              />
              <div className="view-more-overlay">
                <span>+{review.images.length - 2} More</span>
              </div>
            </div>
          )}

          {showOverlay && (
            <div className="image-overlay">
              <span className="close-overlay" onClick={closeOverlay}>
                &times;
              </span>
              <div className="overlay-content">
                <img
                  src={review.images[currentImageIndex]}
                  alt={`Review  ${currentImageIndex + 1}`}
                  className="overlay-image"
                />
                <div className="overlay-thumbnails">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`overlay-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="review-actions">
        {user && !user.isAdmin && review.user?._id !== user._id ? (
          <>
            <button
              className={`like-btn ${liked === 'like' ? 'active' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp size={16} /> {likeCount} Likes
            </button>
            <button
              className={`unlike-btn ${liked === 'unlike' ? 'active' : ''}`}
              onClick={handleUnlike}
            >
              <ThumbsDown size={16} /> {unlikeCount} Unlikes
            </button>
          </>
        ) : (
          <>
            <span className="like-count"><ThumbsUp size={16} /> {likeCount} Like</span>
            <span className="unlike-count"><ThumbsDown size={16} /> {unlikeCount} Unlike</span>
          </>
        )}
      </div>

      {modifiable && (
  <>
    <button
      className="modify-review-btn"
      onClick={() => handleModifyReview(review._id)}
    >
      Modify
    </button>
    <button
      className="remove-review-btn"
      onClick={() => handleRemoveReview(review._id)}
    >
      Remove
    </button>
  </>
)}
    </div>
  );
};

export default ReviewCard;
