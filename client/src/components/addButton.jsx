import React from 'react';
import './Styles/addButton.css';

const Button = ({ onClick, children, type = "button" }) => {
  return (
    <button type={type} onClick={onClick} className="button">
      {children}
    </button>
  );
};

export default Button;
