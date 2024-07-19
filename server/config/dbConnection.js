import mongoose from'mongoose';
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.CONNECTION, {
        });
        console.log('MongoDB Connected...');
    }catch(err) {
        console.error(err.message);
        process.exit(1);  // Exit process with failure
    }

};
export default connectDB;