import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'Please add a city'],
  },
  categories: [{
    type: String,
    required: [false, 'Please add categories'],
  }],
  rating: {
    type: Number,
    required: [false, 'Please add a rating'],
  },
  schedule: {
    type: Map,
    of: new mongoose.Schema({
      openingHours: Date,
      closingHours: Date,
    }),
    required: [false, 'Please add a schedule'],
  },
});

const Attraction = mongoose.model('Attraction', attractionSchema);
export default Attraction;
