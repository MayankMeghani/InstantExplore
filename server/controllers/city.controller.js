import City from "../models/City.js";
import State from "../models/State.js";
import Attraction from "../models/Attraction.js";
import { ObjectId } from 'mongodb';

const getCities = async (req, res) => {
  try {
    const cities = await City.find().populate('state', 'name');
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate('state', 'name');
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCityAttractions = async (req, res) => {
  try {
    const city = await City.findById(req.params.id)
      .populate('attractions');    

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.status(200).json(city.attractions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createCity = async (req, res) => {
  try {
    const { name, state, images } = req.body;

    // Check if the state exists
    const existingState = await State.findById(state);
    if (!existingState) {
      return res.status(400).json({ message: 'Invalid State ID' });
    }

    // Check if the city with the same name and state ID already exists
    const existingCity = await City.findOne({ name, state });
    if (existingCity) {
      return res.status(400).json({ message: 'City with the same name and state already exists' });
    }

    // Create the new city
    const city = new City({ name, state, images });
    await city.save();
    
    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateCity = async (req, res) => {
  try {
    const { name, state, image } = req.body;

    if (state) {
      const existingState = await State.findById(state);
      if (!existingState) {
        return res.status(400).json({ message: 'Invalid State ID' });
      }
    }

    const city = await City.findByIdAndUpdate(
      req.params.id,
      { name, state, image },
      { new: true }
    ).populate('state', 'name');

    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCity = async (req, res) => {
  try {
    // Find the city by ID
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Ensure all attraction IDs are valid ObjectId instances
    const attractionIds = city.attractions.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));

    // Delete all attractions associated with the city
    if (attractionIds.length > 0) {
      await Attraction.deleteMany({ _id: { $in: attractionIds } });
    }

    // Delete the city itself
    await City.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "City and associated attractions deleted successfully" });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ message: "An error occurred while deleting the city" });
  }

};


export { getCities, getCity, createCity, updateCity, deleteCity ,getCityAttractions };
