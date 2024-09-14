import React, { useState, useEffect } from 'react';
import { getReviews } from '../services/reviewService';
import './Styles/TrendingReviewPage.css';
import TrendingReviewCard from '../components/TrendingReviewCard';
import Header from '../components/Header';
import { useUser } from '../hooks/userContext';

const TrendingReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('mostLikes');
  const { user } = useUser(); 
  
  
  useEffect(() => {
    fetchReviews();
    const fetchReviews = async () => {
      setLoading(true);
      const filteredReviews = await fetchAndFilterReviews(sortBy, filterBy);
      setReviews(filteredReviews);
      setLoading(false);
    };
  }, [filterBy, sortBy ]);
  

  const fetchAndFilterReviews = async (sortBy, filterBy) => {
    const data = await getReviews(); // Fetch all reviews
  
    let filteredReviews = [];
  
    // Filter based on 'likedByMe' or 'unlikedByMe'
    if (filterBy === 'likedByMe') {
      filteredReviews = data.filter(review => review.likedBy.includes(user._id));
    } else if (filterBy === 'unlikedByMe') {
      filteredReviews = data.filter(review => review.unlikedBy.includes(user._id));
    } else {
      filteredReviews = data;
    }
  
    // Apply sorting based on 'mostLikes' or 'mostUnlikes'
    if (sortBy === 'mostLikes') {
      filteredReviews.sort((a, b) => b.likedBy.length - a.likedBy.length);
    } else if (sortBy === 'mostUnlikes') {
      filteredReviews.sort((a, b) => b.unlikedBy.length - a.unlikedBy.length);
    }
  
    return filteredReviews;
  };
  

  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setSortBy('mostLikes'); 
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <>
      <Header />
      <div className="trending-reviews">
        <h2>Trending Reviews</h2>
        <div className="filter-sort-container">
          <div className="filter-options">
            <h3>Select a filter:</h3>
            <button
              className={filterBy === 'all' ? 'active' : ''}
              onClick={() => handleFilterChange('all')}
            >
              All Reviews
            </button>
            <button
              className={filterBy === 'likedByMe' ? 'active' : ''}
              onClick={() => handleFilterChange('likedByMe')}
              disabled={!user || user.isAdmin}
            >
              Liked by Me
            </button>
            <button
              disabled={!user || user.isAdmin}
              className={filterBy === 'unlikedByMe' ? 'active' : ''}
              onClick={() => handleFilterChange('unlikedByMe')}
            >
              Unliked by Me
            </button>
            </div>
          
          <div className="sort-options">
            <h3>Sort results:</h3>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="sort-dropdown"
            >
              <option value="mostLikes">Most Likes</option>
              <option value="mostUnlikes">Most Unlikes</option>
              {/* <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highestRated">Highest Rated</option>
              <option value="lowestRated">Lowest Rated</option> */}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="reviews-container">
            {reviews.length===0?(
              <div>No reviews found</div>
            ):(
              reviews.map((review, index) => (
                <TrendingReviewCard key={index} index={index} review={review} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TrendingReviewPage;
