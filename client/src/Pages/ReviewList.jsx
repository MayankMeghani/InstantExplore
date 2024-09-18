import React, { useState, useEffect } from "react";
import { getUserReviews } from "../services/userServices";  
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../Forms/ReviewForm";
import { createReview, updateReview, deleteReview } from "../services/reviewService";
import Header from "../components/Header";
import Search from "../components/Search";
import "./Styles/ReviewList.css";
import { useUser } from '../hooks/userContext';

const ReviewList = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  useEffect(() => {
    fetchReviews(user._id);
    setLoading(false);
  }, [user]);

  const handleClose = () => {
    setShowReviewForm(false);
    setLoading(false);
  };

  const handleModifyReview = (reviewId) => {
    const reviewToModify = reviews.find(review => review._id === reviewId);
    setReviewToEdit(reviewToModify);
    setShowReviewForm(true);
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      await deleteReview(reviewId, user.token);
      console.log(`Review with ID: ${reviewId} removed`);
      fetchReviews(user._id); 
    } catch (error) {
      console.error('Error removing review:', error);
    }
  };

  const handleSubmitReview = async (review) => {
    try {
      if (reviewToEdit) {
        const updatedReview = await updateReview(reviewToEdit._id, review, user.token);
        console.log('Review updated:', updatedReview);
      } else {
        console.log(review);
        const newReview = await createReview(review, user.token);
        console.log('New review created:', newReview);
      }
      setShowReviewForm(false);
      setReviewToEdit(null);
      fetchReviews(user._id); // Refetch reviews after submission
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
    const data = await getUserReviews(id);
    setReviews(data);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="list">
        <Header />
        <Search onSearch={handleSearch} />
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <ReviewCard
              Id={index}
              key={index}
              title={review.attraction.name}
              modifiable={true}
              review={review}
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
              attraction={reviewToEdit ? reviewToEdit.attraction._id : null}
              user={user._id}
              initialReview={reviewToEdit}
              onSubmit={handleSubmitReview}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewList;
