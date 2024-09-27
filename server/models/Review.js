import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attraction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: [true, 'Please add photos'],
  }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  unlikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  // date: {
  //   type: Date,
  //   default: Date.now,
  // },
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;
