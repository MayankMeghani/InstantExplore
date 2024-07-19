import Country from "../models/Country.js";

const getCountries = async (req, res) => {
    const cities = await Country.find();
    res.status(200).json(cities);
}

const getCountry = async (req, res) => {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ message: "country not found" });
    res.status(200).json(country);

}

const createCountry = async (req, res) => {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json(country);
}

const updateCountry = async (req, res) => {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!country) return res.status(404).json({ message: "Country not found" });
    res.status(200).json(country);
}

const deleteCountry = async (req, res) => {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ message: "Country not found" });
    
    res.status(204).json({message: "Country deleted successfully" });
}
export {getCountries,getCountry,createCountry, updateCountry, deleteCountry};