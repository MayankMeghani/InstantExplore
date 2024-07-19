import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a country name'],
  },
});

const Country = mongoose.model('Country', countrySchema);
export default Country;
