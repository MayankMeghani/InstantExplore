import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  images: [{
    type: String,
    required: [true, 'Please add photos'],
  }],
  location: {
    type: String,
    required: [true, 'Please add location'],
  },
  city: {
    type: String,
    ref: 'City',
    required: [true, 'Please add a city'],
  },
  categories: [{
    type: String,
    required: [false, 'Please add categories'],
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'], 
  }
});


const Request = mongoose.model('Request', requestSchema);
export default Request;
