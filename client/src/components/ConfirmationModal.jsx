import React from 'react';
import './Styles/ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirm Action</h2>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="modal-button cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
