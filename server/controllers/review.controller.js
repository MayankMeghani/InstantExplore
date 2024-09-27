import Review from "../models/Review.js";
import Attraction from "../models/Attraction.js";
import User from "../models/User.js";

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}) .populate({
          path: 'attraction', 
          select: 'name location'
      }).populate('user','name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReview = async(req, res) =>{
    try {
        const review = await Review.findById(req.params.id).populate('attraction','name');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createReview = async (req, res) => {
    try {
      
      const existingAttraction = await Attraction.findById(req.body.attraction);
      if (!existingAttraction) {
        return res.status(400).json({ message: 'Invalid attraction ID' });
      }
  
      const existingUser = await User.findById(req.body.user);
      if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const existingReview = await Review.findOne({ user: req.body.user, attraction: req.body.attraction });
      if (existingReview) {
        return res.status(400).json({ message: 'User has already reviewed this attraction' });
      }
  
      const newReview = new Review(req.body);
      await newReview.save();
  
      existingAttraction.reviews.push(newReview._id);
      await existingAttraction.calculateAverageRating();
      await existingAttraction.save();
  
      existingUser.reviews.push(newReview._id);
      await existingUser.save();
  
      res.status(201).json(newReview);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const updateReview = async(req, res) => {
    try{
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!review) return res.status(404).json({ message: 'Review not found' });
        const attraction = await Attraction.findById(review.attraction);
        await attraction.calculateAverageRating();
        await attraction.save(); 
        res.status(200).json(review);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
};

const removeReview = async(req, res)=>{
    try{
        const review = await Review.findByIdAndDelete(req.params.id);
        if(!review) return res.status(404).json({ message: 'Review not found' });
        const attraction = await Attraction.findByIdAndUpdate(review.attraction, { $pull: { reviews: req.params.id }});
        await attraction.calculateAverageRating();
        await attraction.save(); 
        res.status(204).json();
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const addLike = async (req, res) => {
    
    const reviewId = req.params.id;
    const {userId,likeStatus} = req.body;
  
    const review = await Review.findById(reviewId);
    const user = await User.findById(userId);
  
    // Check if user has already liked the review
    if (review.likedBy.includes(userId)) {
      // Unlike the review
      review.likedBy.pull(userId);
      user.likedReviews.pull(reviewId);
    } else {
      review.likedBy.push(userId);
      user.likedReviews.push(reviewId);
  
      // If previously unliked, remove unlike
      review.unlikedBy.pull(userId);
      user.unlikedReviews.pull(reviewId);
    }
  
    if (likeStatus === 'like') {
        review.likedBy.addToSet(userId); // Add user to likedBy if not already present
        review.unlikedBy.pull(userId);   // Remove user from unlikedBy if present
        user.likedReviews.addToSet(reviewId); // Add review to likedReviews if not already present
        user.unlikedReviews.pull(reviewId); // Remove review from unlikedReviews if present
      } else if (likeStatus === 'unlike') {
        review.unlikedBy.addToSet(userId); // Add user to unlikedBy if not already present
        review.likedBy.pull(userId);       // Remove user from likedBy if present
        user.unlikedReviews.addToSet(reviewId); // Add review to unlikedReviews if not already present
        user.likedReviews.pull(reviewId); // Remove review from likedReviews if present
      } else {
        review.likedBy.pull(userId);
        review.unlikedBy.pull(userId);
        user.likedReviews.pull(reviewId);
        user.unlikedReviews.pull(reviewId);
      }

    await review.save();
    await user.save();

    res.status(200).json({message: 'Success', likeCount: review.likedBy.length });
  };
  

export {getReviews,getReview,createReview,updateReview,removeReview,addLike} 