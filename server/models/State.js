import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'please add a state'],
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Please add a country'],
    },
  });
  
  const State = mongoose.model('State', stateSchema);
  export default State;