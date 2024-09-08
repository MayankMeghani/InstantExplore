// src/Components/Search.jsx
import React, { useState } from 'react';
import './Styles/Search.css';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Call the onSearch function from props
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search cities..."
        value={searchTerm}
        onChange={handleChange}
      />
      {/* Remove search button if it's not needed */}
    </div>
  );
};

export default Search;
