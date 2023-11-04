import mongoose from "mongoose";

export async function connectToMongoDB() {
  try {
    await mongoose.connect(String(process.env.MONGODB_URL));

    console.log("MongoDB connection successful");
  } catch (error) {
    console.log(error);
  }
}
