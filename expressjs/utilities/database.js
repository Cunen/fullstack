import mysql from "mysql2";
import dotenv from "dotenv";
import process from "process";
import { Sequelize } from "sequelize";
import { getSequelizeModels } from "../models/sequelizeModel.js";

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

const { SeqProduct, SeqCart } = getSequelizeModels(sequelize);

export { mysqlDb, sequelize, SeqProduct, SeqCart };
