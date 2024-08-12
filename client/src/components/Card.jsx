import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel CSS
import './Card.css'; // Import the card CSS
const Card = ({ Id, images, title, description, onExploreClick, onRemoveClick, onUpdateClick }) => {
  return (
    <div className="card">
      <Carousel
        showThumbs={false} // Hide thumbnails
        infiniteLoop // Loop through the images
        autoPlay // Automatically transition between slides
        interval={5000} // Transition interval in milliseconds
        transitionTime={500} // Transition time in milliseconds
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`${title} ${index}`} className="card-image" />
          </div>
        ))}
      </Carousel>
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={() => onExploreClick(Id)}>Explore</button>     
        <button onClick={() => onUpdateClick(Id)} style={{ background: 'green', margin: '8px' }}>
          Update
        </button>
        <button onClick={() => onRemoveClick(Id)} style={{ background: 'red'}}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Card;
