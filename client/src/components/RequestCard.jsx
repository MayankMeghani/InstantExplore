import React, { useState } from 'react';
import './Styles/RequestCard.css';
import { useUser } from '../hooks/userContext';
import AttractionForm from '../Forms/AttractionForm'; // Assuming this is the form component to add attraction
import {createAttraction} from '../services/attractionService';
const RequestCard = ({ request, onRemoveRequest, onUpdateRequest }) => {
  const { _id, name, description, images, location, city, categories, status } = request;
  const { user } = useUser();
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [showAttractionForm, setShowAttractionForm] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState(null);
  const openOverlay = (index) => {
    setCurrentImageIndex(index);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const openModifyModal = () => {
    setShowModifyModal(true);
  };

  const closeModifyModal = () => {
    setShowModifyModal(false);
  };

  const handleModifySubmit = async () => {
    if (updatedStatus === 'Approved' && showAttractionForm) {
      return;
    }
    await onUpdateRequest(request, updatedStatus);
    closeModifyModal();
  };

  const handleAddAttractionSubmit = async (attractionData) => {
    try{
    await createAttraction(attractionData,user.token);

    setUpdatedStatus('Approved');
    await onUpdateRequest(request, 'Approved');

    setShowAttractionForm(false);
    closeModifyModal();
  }
    catch(error){
      console.error('Error creating attraction:', error);
      setFormErrorMessage(error.response?.data?.message);
    }
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
        {user && user.isAdmin && <p>Requested by: {request.user.name}</p>}
      </div>
      <p>Location: {location}</p>
      <p>City: {city}</p>
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
              alt={`request ${index + 1}`}
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
                  alt={`request ${currentImageIndex + 1}`}
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
      
      {user && !user.isAdmin && (
      <button className='card-button' onClick={() => onRemoveRequest(request._id)}>
        Remove Request
      </button>
      )}
      {user && user.isAdmin && (
        <>
          <button className='card-button' onClick={openModifyModal}>
            Modify Request
          </button>

          {showModifyModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Modify Request Status</h2>
                  <button className="close-button" style={{ backgroundColor: 'white', border: 'none', fontSize: '1.5rem', color: 'black' }}
                    onClick={closeModifyModal}>
                    &times;
                  </button>
                </div>
                <label>
                  <input
                    type="radio"
                    value="Approved"
                    onChange={(e) => {
                      setUpdatedStatus(e.target.value);
                      setShowAttractionForm(true); 
                    }}
                  />
                  Approve
                </label>
                <label>
                  <input
                    type="radio"
                    value="Rejected"
                    onChange={(e) => {
                      setUpdatedStatus(e.target.value);
                      setShowAttractionForm(false); 
                    }}
                  />
                  Reject
                </label>
                <br></br>
                {showAttractionForm && (
                  <AttractionForm
                  initialData={((({ _id, ...rest }) => rest)(request))}  
                  onSubmit={handleAddAttractionSubmit}
                  mode='add'
                  error= {formErrorMessage}
                  />
                )}
                {!showAttractionForm &&
                <button onClick={handleModifySubmit}>
                  Submit
                </button>
                }
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestCard;
