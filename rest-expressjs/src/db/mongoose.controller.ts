import dotenv from "dotenv";
import process from "process";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = model("post", postSchema);
const User = model("user", userSchema);

dotenv.config({ path: ".env.local" });

/** MongoDB Connection
 * Database: node-learning
 * Username: MONGO_USERNAME from .env.local
 * Password: MONGO_PASSWORD from .env.local
 */
export const MONGODB_CONNECTION_STRING = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ac-aokgvtf-shard-00-00.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-01.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-02.dqcpedh.mongodb.net:27017/?ssl=true&replicaSet=atlas-5if7zx-shard-0&authSource=admin&appName=node-learning`;
// SRV connection string broken in NODE 24+?
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@node-learning.dqcpedh.mongodb.net/?appName=node-learning`;

const connectWithMongoose = async () => {
  try {
    return mongoose.connect(MONGODB_CONNECTION_STRING, {
      dbName: "ts-db",
    });
  } catch (error) {
    console.error("Error connecting to MongoDB with Mongoose:", error);
    throw error;
  }
};

export { connectWithMongoose };
export { Post, User };
