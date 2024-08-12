import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a city name'],
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: [true, 'Please add a state'],
  },  images: [{
    type: String, 
  }],
  attractions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attraction', 
    }
  ],
});

const City = mongoose.model('City', citySchema);
export default City;
