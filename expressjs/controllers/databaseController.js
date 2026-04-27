import dotenv from "dotenv";
import process from "process";
import mongoose from "mongoose";

import MongooseUser from "../models/user.mongoose.js";
import MongooseProduct from "../models/product.mongoose.js";
import MongooseCart from "../models/cart.mongoose.js";
import MongooseOrder from "../models/order.mongoose.js";

dotenv.config({ path: ".env.local" });

/** MongoDB Connection
 * Database: node-learning
 * Username: MONGO_USERNAME from .env.local
 * Password: MONGO_PASSWORD from .env.local
 */
const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ac-aokgvtf-shard-00-00.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-01.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-02.dqcpedh.mongodb.net:27017/?ssl=true&replicaSet=atlas-5if7zx-shard-0&authSource=admin&appName=node-learning`;
// SRV connection string broken in NODE 24+?
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@node-learning.dqcpedh.mongodb.net/?appName=node-learning`;

const connectWithMongoose = async () => {
  try {
    return mongoose.connect(uri, {
      dbName: "express-db",
    });
  } catch (error) {
    console.error("Error connecting to MongoDB with Mongoose:", error);
    throw error;
  }
};

export { connectWithMongoose };
export {
  MongooseUser as User,
  MongooseProduct as Product,
  MongooseCart as Cart,
  MongooseOrder as Order,
};
