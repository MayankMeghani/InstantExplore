import React, { useState } from 'react';
import { Star, Image } from 'lucide-react';
import './Attraction.css';

const ImageGrid = ({ images }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedImages = showAll ? images : images.slice(0, 3);

  return (
    <div className="image-grid-container">
      <div className={`image-grid ${showAll ? 'show-all' : ''}`}>
        {displayedImages.map((image, index) => (
          <div 
            key={index} 
            className={`image-item ${index === 0 && !showAll ? 'large' : 'small'}`}
            style={{backgroundImage: `url(${image})`}}
          >
            {index === 2 && images.length > 3 && !showAll && (
              <div className="more-images-overlay">
                +{images.length - 2} more
              </div>
            )}
          </div>
        ))}
      </div>
      {images.length > 3 && (
        <button 
          className="view-all-images-btn"
          onClick={() => setShowAll(!showAll)}
        >
          <Image size={16} />
          {showAll ? 'Show Less' : 'View All Images'}
        </button>
      )}
    </div>
  );
};

const Attraction = ({ attraction }) => {
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

      {/* <div className="attraction-reviews">
        <h2>Reviews</h2>
        {attraction.reviews.map((review, index) => (
          <div key={index} className="review">
            <div className="review-header">
              <span className="reviewer-name">{review.userName}</span>
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
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Attraction;
