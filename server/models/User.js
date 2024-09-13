import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type: Boolean,
    default: false,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  likedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], 
  unlikedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const User = mongoose.model('User', userSchema);
export default User;
