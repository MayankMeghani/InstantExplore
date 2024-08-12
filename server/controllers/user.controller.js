import User from "../models/User.js";

const getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
}

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);

}

const createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
}

const updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
}

const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(204).json({message: "User deleted successfully" });
}
export {getUsers,getUser,createUser, updateUser, deleteUser};