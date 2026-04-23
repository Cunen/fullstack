import mysql from "mysql2";
import dotenv from "dotenv";
import process from "process";

dotenv.config({ path: ".env.local" });

const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;

const pool = mysql
  .createPool({
    host: "localhost",
    port: 3306,
    user,
    password,
    database: "expressjs",
  })
  .promise();

export default pool;
