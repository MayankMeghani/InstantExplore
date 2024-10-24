import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import Review from "../models/Review.js";
import jwt from 'jsonwebtoken';
import Request from "../models/Request.js";
import { sendVerificationEmail } from "../utills/mailer.js";

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

    const existingUser = await User.findOne({ email, isProfileComplete: true });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with a complete profile' });
    }    

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashedPassword, isAdmin, isVerified: false});
    await user.save();
    sendVerificationEmail(email, user._id);
  
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
    res.status(200).json({ user: { _id: user.id,name: user.name, email: user.email, isAdmin:user.isAdmin }, message: "User authenticated successfully" });
}

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  if(!user.isVerified) return res.status(400).json({ message: "Please verify email through verification link."});

  const token = jwt.sign({ _id: user.id,name: user.name, email: user.email, isAdmin:user.isAdmin }, 'yourSecretKey', { expiresIn: '1h' });

  res.json({ message: "User authenticated successfully",  token });
};


const getReviews = async (req, res) => {
  const userId = req.params.userId; 
  try {
    const reviews = await Review.find({ user: userId })
    .populate({ path: 'attraction', select: 'name' })
    .populate({path: 'user'}); // Populate only the name field of the attraction
    if (!reviews) {
      return res.status(404).json({ message: "Reviews not found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
};


const isValidToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    
    return res.status(200).json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const getRequests = async (req, res) => {
  const userId = req.params.userId; 
  try {
    const requests = await Request.find({ user: userId })
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching requests" });
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


export {verifyEmail,getUsers,getUser,createUser, updateUser, deleteUser,validateUser,getReviews,getRequests,login,isValidToken};