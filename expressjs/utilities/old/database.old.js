import mysql from "mysql2";
import dotenv from "dotenv";
import process from "process";
import { Sequelize } from "sequelize";
import { getSequelizeModels } from "../../models/old/sequelizeModel.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import { STATUS_CODES } from "http";
import mongoose from "mongoose";
import { loadModels } from "../../models/index.mongoose.js";

dotenv.config({ path: ".env.local" });

const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;

/** Classic connection pool with mysql2 */
const mysqlDb = mysql
  .createPool({
    host: "localhost",
    port: 3306,
    user,
    password,
    database: "expressjs",
  })
  .promise();

/** Connection through Sequelize */
const sequelize = new Sequelize("expressjs", user, password, {
  host: "localhost",
  dialect: "mysql",
});

const { SeqProduct, SeqCartItems, SeqUser, SeqOrders, SeqOrderItems } =
  getSequelizeModels(sequelize);

/** MongoDB Connection
 * Database: node-learning
 * Username: MONGO_USERNAME from .env.local
 * Password: MONGO_PASSWORD from .env.local
 */
const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ac-aokgvtf-shard-00-00.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-01.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-02.dqcpedh.mongodb.net:27017/?ssl=true&replicaSet=atlas-5if7zx-shard-0&authSource=admin&appName=node-learning`;
// SRV connection string broken in NODE 24+?
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@node-learning.dqcpedh.mongodb.net/?appName=node-learning`;
const mongo = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
/** MongoDB Database Instance */
let mongodb;
const connectToMongo = async () => {
  try {
    await mongo.connect();
    mongodb = mongo.db("express-db");
    return STATUS_CODES[200];
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return STATUS_CODES[500];
  }
};

const { User, Product, Cart, Order } = loadModels();
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
const shutdown = () => {
  mongo.close(false, () => {
    console.log("MongoDB connection closed.");
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGHUP", shutdown);

export {
  mysqlDb,
  sequelize,
  SeqProduct,
  SeqCartItems,
  SeqUser,
  SeqOrders,
  SeqOrderItems,
  mongodb,
  connectToMongo,
  connectWithMongoose,
};

export { User, Product, Cart, Order };
