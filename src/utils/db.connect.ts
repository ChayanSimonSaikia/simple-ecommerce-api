import mongoose from "mongoose";
import config from "config";

async function connectToMongo() {
  const uri = config.get<string>("mongodbUri");
  const dbName = config.get<string>("dbName");

  try {
    await mongoose.connect(uri, { dbName });
    console.log("Connected to mongoDB...");
  } catch (error) {
    console.log("Database connection failed...");
    process.exit(1);
  }
}

export default connectToMongo;
