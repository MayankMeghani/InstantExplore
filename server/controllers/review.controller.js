import Review from "../models/Review.js";
import Attraction from "../models/Attraction.js";
import User from "../models/User.js";

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('attraction','name');
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
      console.log(req.body);
      
      // Check if the attraction exists
      const existingAttraction = await Attraction.findById(req.body.attraction);
      if (!existingAttraction) {
        return res.status(400).json({ message: 'Invalid attraction ID' });
      }
  
      // Check if the user exists
      const existingUser = await User.findById(req.body.user);
      if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if the user has already reviewed the attraction
      const existingReview = await Review.findOne({ user: req.body.user, attraction: req.body.attraction });
      if (existingReview) {
        return res.status(400).json({ message: 'User has already reviewed this attraction' });
      }
  
      // Create a new review
      const newReview = new Review(req.body);
      await newReview.save();
  
      // Add the review to the attraction's reviews array and recalculate rating
      existingAttraction.reviews.push(newReview._id);
      await existingAttraction.calculateAverageRating();
      await existingAttraction.save();
  
      // Add the review to the user's reviews array
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

export {getReviews,getReview,createReview,updateReview,removeReview} 