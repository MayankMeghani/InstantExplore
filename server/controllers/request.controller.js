import Attraction from "../models/Attraction.js";
import Request from "../models/Request.js";
import User from "../models/User.js";

const getRequests = async (req, res) => {
    try {
        const requests = await Request.find({});
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAttraction = async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id)
        .populate({
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'name' 
          } 
        });
        if (!attraction) return res.status(404).json({ message: "Attraction not found" });
        await attraction.calculateAverageRating();
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(404).json({ message: "Attraction not found" });
    }
}

const createRequest = async (req, res) => {
    try {
    const user= req.body.user;
    const existingUser = await User.findById(user._id);
      if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
      }

      const request = new Request(req.body);
      await request.save();
    
      existingUser.requests.push(request._id);
      await existingUser.save();
    
      res.status(201).json(request);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

const updateRequest = async (req, res) => {
    const {request} = req.body;
    try {
        const updatedRequest = await Request.findByIdAndUpdate(
            request._id,
            request,
            { new: true }
        );
        res.json(updatedRequest);
    } catch (error) {
        res.status(404).json({ message: "Request not found" });
    }
}

const deleteRequest = async (req, res) => {
    try {
        const  {id}  = req.params;
        const { user } = req.body;  
        const request = await Request.findByIdAndDelete(id);
      

        const nUser = await User.findByIdAndUpdate(user._id, { $pull: { requests: id }});
        await nUser.save(); 
        res.status(204).json();
    }
    catch(error){
        res.status(500).json({ message: error.message });

        }
};


export { getRequests, getAttraction, createRequest, updateRequest, deleteRequest };