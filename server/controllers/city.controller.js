import City from "../models/City.js";
import State from "../models/State.js";

const getCities = async (req, res) => {
    const cities = await City.find();
    res.status(200).json(cities);
}

const getCity = async (req, res) => {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(200).json(city);

}

const createCity = async (req, res) => {
    const { name, state } = req.body;

    const existingstate = await State.findById(state);
    if (!existingstate) {
      return res.status(400).json({ message: 'Invalid State ID' });
    }
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
}

const updateCity = async (req, res) => {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(200).json(city);
}

const deleteCity = async (req, res) => {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(204).send();
}
export {getCities,getCity,createCity, updateCity, deleteCity};