import dotenv from "dotenv";
import process from "process";
import session from "express-session";
import mongoSession from "connect-mongodb-session";

import { MONGODB_CONNECTION_STRING } from "../controllers/databaseController.js";

dotenv.config({ path: ".env.local" });

const Session = mongoSession(session);

const store = new Session({
  uri: MONGODB_CONNECTION_STRING,
  collection: "sessions",
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
});

export default sessionMiddleware;
