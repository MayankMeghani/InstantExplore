import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useUser } from '../hooks/userContext';
import { updateLike } from '../services/reviewService';
const TrendingReviewCard = ({ index, review }) => {
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

    const handleLike = async () => {
        const newLikeStatus = liked === 'like' ? null : 'like';
        const prevLiked = liked;

        if (newLikeStatus === 'like') {
            setLikeCount(likeCount + 1);
            if (liked === 'unlike') setUnlikeCount(unlikeCount - 1); // Remove from unlikes if phreviously unliked
        } else {
            setLikeCount(likeCount - 1);
        }
        setLiked(newLikeStatus);

        try {
            await updateLike(review._id, newLikeStatus, user);
        } catch (error) {
            console.error("Error updating like status:", error);
            setLiked(prevLiked);
            setLikeCount(prevLiked === 'like' ? likeCount : likeCount - 1);
            if (liked === 'unlike') setUnlikeCount(unlikeCount + 1);
        }
    };

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
            await updateLike(review._id, newLikeStatus, user);
            
        } catch (error) {
            console.error("Error updating unlike status:", error);
            setLiked(prevLiked);
            setUnlikeCount(prevLiked === 'unlike' ? unlikeCount : unlikeCount - 1);
            if (liked === 'like') setLikeCount(likeCount + 1);
        }
    };





    return (
        <div key={index} className="review-card">
            <div className="review-header">
                <div className="user-info">
                    <span className="username">{review.user.name}</span>
                </div>
                <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? 'gold' : 'none'}
                            stroke={i < review.rating ? 'gold' : 'currentColor'}
                        />
                    ))}
                </div>
            </div>
            <div className="attraction-info">
                <h3 className="attraction-name">{review.attraction.name}</h3>
                <p className="attraction-location">{review.attraction.location}</p>
            </div>



            {review.images && review.images.length > 0 && (

                <div className={`image-grid grid-${Math.min(review.images.length, 3)}`}>
                    {
                        review.images.slice(0, 2).map((image, index) => (
                            <img
                                key={index}
                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                alt={`Review  ${index + 1}`}
                                className={`review-image ${review.images.length}`}

                                onClick={() => openOverlay(index)}
                            />
                        ))
                    }
                    {
                        review.images.length === 3 && (
                            <img
                                src={review.images[2]}
                                alt="View More"
                                className={`review-image ${review.images.length}`}
                            />
                        )
                    }
                    {
                        review.images.length > 3 && (
                            <div className="view-more-thumbnail" onClick={() => openOverlay(2)}>
                                <img
                                    src={review.images[2]}
                                    alt="View More"
                                    className={`review-image ${review.images.length}`}
                                />
                                <div className="view-more-overlay">
                                    <span>+{review.images.length - 2} More</span>
                                </div>
                            </div>
                        )
                    }
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

                </div>)
            }


            <p className="review-text">{review.text}</p>
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
        </div>);
}

export default TrendingReviewCard;