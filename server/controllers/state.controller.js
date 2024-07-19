import State from "../models/State.js";
import Country from "../models/Country.js";

const getStates = async (req, res) => {
    const cities = await State.find();
    res.status(200).json(cities);
}

const getState = async (req, res) => {
    const state = await State.findById(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.status(200).json(state);

}

const createState = async (req, res) => {
    const { name, country } = req.body;

    const existingCountry = await Country.findById(country);
    if (!existingCountry) {
      return res.status(400).json({ message: 'Invalid country ID' });
    }
    const state = new State(req.body);
    await state.save();
    res.status(201).json(state);
}

const updateState = async (req, res) => {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.status(200).json(state);
}

const deleteState = async (req, res) => {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.status(204).json(state);
}
export {getStates,getState,createState, updateState, deleteState};