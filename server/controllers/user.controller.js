import User from "../models/User.js";
import bcrypt from 'bcryptjs';

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
    const { name, email, password, isAdmin } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashedPassword, isAdmin });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error while saving the user:', error);

    res.status(500).json({ error: "Failed to register user" });
  }
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

const validateUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    res.status(200).json({ message: "User authenticated successfully" });
}

export {getUsers,getUser,createUser, updateUser, deleteUser,validateUser};