// Card.js
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Styles/Card.css';
import { Star } from 'lucide-react';

const Card = ({ Id, images, title, description, rating, onExploreClick, onRemoveClick, onUpdateClick, isAdmin }) => {
  return (
    <div className="card">
      <Carousel
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={5000}
        transitionTime={500}
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`${title} ${index}`} className="card-image" />
          </div>
        ))}
      </Carousel>
      <div className="card-content">
        <h2>{title}</h2>
        {rating > 0 && (
          <div className="rating">
            <span>{rating.toFixed(1)}</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? "gold" : "none"}
                stroke={i < rating ? "gold" : "currentColor"}
              />
            ))}
          </div>
        )}
        <p>{description}</p>
        <button onClick={() => onExploreClick(Id)}>Explore</button>
        {isAdmin && (
          <>
            <button onClick={() => onUpdateClick(Id)} style={{ background: 'darkslategray', margin: '8px' }}>
              Update
            </button>
            <button onClick={() => onRemoveClick(Id)} style={{ background: 'darkslategray' }}>
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;