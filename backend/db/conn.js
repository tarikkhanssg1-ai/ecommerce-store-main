import mongoose from "mongoose";

const Connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL );
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error while connecting to database", error);
    } 
}

export default Connection;