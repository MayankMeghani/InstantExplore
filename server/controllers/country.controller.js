import Country from "../models/Country.js";
import State from "../models/State.js";
import City from "../models/City.js";
import Attraction from "../models/Attraction.js";

const getCountries = async (req, res) => {
    const countries = await Country.find();
    if(!countries)res.status(404);
    res.status(200).json(countries);
}

const getCountry = async (req, res) => {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ message: "country not found" });
    res.status(200).json(country);

}
const createCountry = async (req, res) => {
    try {
      const { name } = req.body;
  
      // Check if a country with the same name already exists
      const existingCountry = await Country.findOne({ name });
      if (existingCountry) {
        return res.status(400).json({ message: 'Country with this name already exists' });
      }
  
      // Create a new Country document
      const country = new Country(req.body);
  
      // Save the new country
      await country.save();
      res.status(201).json(country);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: error.message });
    }
  };
  

const updateCountry = async (req, res) => {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!country) return res.status(404).json({ message: "Country not found" });
    res.status(200).json(country);
}

const deleteCountry = async (req, res) => {
    const countryId = req.params.id;
    
    const states = await State.find({ country: countryId });
    
    // Loop through each state and remove dependent cities and attractions
    for (let state of states) {
      // Find cities in the state
      const cities = await City.find({ state: state._id });
      
      for (let city of cities) {
        // Delete all attractions related to the city
        await Attraction.deleteMany({ _id: { $in: city.attractions } });
        
        // Delete the city
        await City.findByIdAndDelete(city._id);
      }
      
      // Delete the state
      await State.findByIdAndDelete(state._id);
    }
    
    // Finally, delete the country
    await Country.findByIdAndDelete(countryId);

    res.status(204).json({message: "Country deleted successfully" });
}

const getCountryStates = async (req, res) => {
  const id = req.params.id;
  const states = await State.find({ country: id });
  if (!states || states.length === 0) {
    return res.status(404).json({ message: "No states found for this country." });
  }

  // Return the list of states
  res.status(200).json(states);

}


export {getCountries,getCountry,createCountry, updateCountry, deleteCountry ,getCountryStates};