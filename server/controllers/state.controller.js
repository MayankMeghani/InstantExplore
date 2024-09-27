import State from "../models/State.js";
import Country from "../models/Country.js";
import City from "../models/City.js";
import Attraction from "../models/Attraction.js";

const getStates = async (req, res) => {
    const cities = await State.find().populate('country');
    res.status(200).json(cities);
}

const getState = async (req, res) => {
    const state = await State.findById(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.status(200).json(state);

}

const createState = async (req, res) => {
    try {
      const { name, country } = req.body;
  
      // Check if the country exists
      const existingCountry = await Country.findById(country);
      if (!existingCountry) {
        return res.status(400).json({ message: 'Invalid country ID' });
      }
  
      // Check if the state with the same name and country already exists
      const existingState = await State.findOne({ name: name, country: country });
      if (existingState) {
        return res.status(400).json({ message: 'State with this name already exists in the selected country' });
      }
  
      // Create new state
      const state = new State({ name, country });
      await state.save();
      res.status(201).json(state);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const updateState = async (req, res) => {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.status(200).json(state);
}

const deleteState = async (req, res) => {
    const stateId = req.params.id;

    const cities = await City.find({ state: stateId });
    
    for (let city of cities) {
      // Delete all attractions related to the city
      await Attraction.deleteMany({ _id: { $in: city.attractions } });
      
      // Delete the city
      await City.findByIdAndDelete(city._id);
    }
    
    // Finally, delete the state
    await State.findByIdAndDelete(stateId);
    res.status(204).json("State and all dependent cities and attractions deleted.");
  }
export {getStates,getState,createState, updateState, deleteState};