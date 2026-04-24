import mysql from "mysql2";
import dotenv from "dotenv";
import process from "process";
import { Sequelize } from "sequelize";
import { getSequelizeModels } from "../models/sequelizeModel.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import { STATUS_CODES } from "http";

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
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@node-learning.dqcpedh.mongodb.net/?appName=node-learning`;
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
};
