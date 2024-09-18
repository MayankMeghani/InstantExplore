import React, { useState } from 'react';
import { Image } from 'lucide-react';

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
              style={{ backgroundImage: `url(${image})` }}
            >
              {index === 2 && images.length > 3 && !showAll && (
                <div className="more-images-overlay">
                  +{images.length - 3} more
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
  
export default ImageGrid;