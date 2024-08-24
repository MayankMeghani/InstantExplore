import Attraction from "../models/Attraction.js";
import City from "../models/City.js";

const getAttractions = async (req, res) => {
    try {
        const attractions = await Attraction.find({});
       for(const attraction in attractions){
        await attraction.calculateAverageRating();
        await attraction.save();
       }
        res.status(200).json(attractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAttraction = async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id).populate({
            path: 'reviews',
          });
        if (!attraction) return res.status(404).json({ message: "Attraction not found" });
        await attraction.calculateAverageRating();
        await attraction.save();
        res.status(200).json(attraction);
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
    cityData.attractions.push(attraction._id);
    await cityData.save();  
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
        const { id } = req.params;

        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ message: "Attraction not found" });
        }

        const reviews = attraction.reviews;
        for (const reviewId of reviews) {
            await Review.findByIdAndDelete(reviewId);
        }

        const cityId = attraction.city.toString();

        await Attraction.findByIdAndDelete(id);

        
        await City.findByIdAndUpdate(
            cityId,
            { $pull: { attractions: id } } // Remove the attraction ID from the array
        );

        res.status(200).json({ message: "Attraction deleted successfully and removed from the city" });
    } catch (error) {
        console.error("Error deleting attraction:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export { getAttractions, getAttraction, createAttraction, updateAttraction, deleteAttraction };