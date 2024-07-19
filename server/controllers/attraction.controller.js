import Attraction from "../models/Attraction.js";
import City from "../models/City.js";

const getAttractions = async (req, res) => {
    try {
        const attractions = await Attraction.find({});
        res.status(200).json(attractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAttraction = async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id);
    } catch (error) {
        res.status(404).json({ message: "Attraction not found" });
    }
}

const createAttraction = async (req, res) => {
    const { name, city } = req.body;
    const cityData = await City.findById(city);
    if (!cityData) return res.status(404).json({ message: "City not found" });
    const attraction = new Attraction(req.body);
    await attraction.save();
    res.status(201).json(attraction);
}

const updateAttraction = async (req, res) => {
    try {
        const updatedAttraction = await Attraction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedAttraction);
    } catch (error) {
        res.status(404).json({ message: "Attraction not found" });
    }
}

const deleteAttraction = async (req, res) => {
    try {
        await Attraction.findByIdAndDelete(req.params.id);
        res.json({ message: "Attraction deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Attraction not found" });
    }
}

export { getAttractions, getAttraction, createAttraction, updateAttraction, deleteAttraction };