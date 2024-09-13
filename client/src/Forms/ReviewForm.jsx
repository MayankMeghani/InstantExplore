import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { storage } from '../api/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ReviewForm = ({ attraction, user, initialReview, onSubmit, error }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]); // State to hold uploaded images
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]); // For image previews
  const [loading, setLoading] = useState(false); // Loading state for image upload

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setReviewText(initialReview.text);
      if (initialReview.images) {
        setImages(initialReview.images);
        setImagePreviewUrls(initialReview.images); // Assuming initialReview.images contains URLs of existing images
      }
    }
  }, [initialReview]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      attraction,
      user,
      rating,
      text: reviewText,
      images, // Pass images as part of the review data
    };
    if (initialReview) {
      reviewData._id = initialReview._id;
    }
    onSubmit(reviewData);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true); // Set loading state to true during image upload

    const uploadedImages = [];
    const previewUrls = [];

    for (const file of files) {
      try {
        const storageRef = ref(storage, 'Attractions/' + file.name);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        uploadedImages.push(downloadUrl);
        previewUrls.push(URL.createObjectURL(file)); // Create preview URLs
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setImages(uploadedImages);
    setImagePreviewUrls(previewUrls);
    setLoading(false); // Set loading state back to false after upload
  };

  return (
    <div className="review-form-overlay">
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="rating-input">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={24}
              fill={i < rating ? 'gold' : 'none'}
              stroke={i < rating ? 'gold' : 'currentColor'}
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

        {/* Image Upload Field */}
        <div className="image-upload">
          <label htmlFor="image-input">Upload Images:</label>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={loading} // Disable input during upload
          />
        </div>

        {/* Display image previews */}
        {imagePreviewUrls.length > 0 && (
          <div className="image-previews">
            {imagePreviewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                style={{ width: '100px', margin: '5px' }}
              />
            ))}
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : initialReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
