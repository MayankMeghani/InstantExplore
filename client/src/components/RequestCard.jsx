import React,{useState} from 'react';
import './Styles/RequestCard.css'; 

const RequestCard = ({ request,onRemoveRequest }) => {
  const { _id, name, description, images, location, city, categories, status } = request;
  
  const [showOverlay, setShowOverlay] = useState(false); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  
  const openOverlay = (index) => {
    setCurrentImageIndex(index);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div key={_id} className="request-card">
      
      <div className="modal-header">
      <h3>{name}</h3>
      </div>
      <p>Location:{location}</p>
      <p>City:{city}</p>
      <p>Category: {categories.map((cat, index) => (
        <span key={index} className="category-item">
          {cat}
        </span>
       ))}</p>
      <p>Description: {description}</p>
      <p className='status'>Status: <span className={`${getStatusClass(status)}`}>{status}</span></p>
      {images && images.length > 0 && (
        <div className="request-images">
          {images.slice(0, 2).map((image, index) => (
            <img
              key={index}
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt={`request  ${index + 1}`}
              className="request-thumbnail"
              onClick={() => openOverlay(index)}
            />
          ))}

          {images.length > 2 && (
            <div className="view-more-thumbnail" onClick={() => openOverlay(2)}>
              <img
                src={images[2]}
                alt="View More"
                className="request-thumbnail"
              />
              <div className="view-more-overlay">
                <span>+{images.length - 2} More</span>
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
                  src={images[currentImageIndex]}
                  alt={`request  ${currentImageIndex + 1}`}
                  className="overlay-image"
                />
                <div className="overlay-thumbnails">
                  {images.map((image, index) => (
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
      <button onClick={() => onRemoveRequest(request._id)}>
        Remove Request
      </button>
      <button onClick={() => onRemoveRequest(request._id)}>
        Modify Request
      </button>

      </div>
  ); 
};

export default RequestCard;
