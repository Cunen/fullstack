import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/apiRouter.js";
import unauthenticatedRouter from "./routes/unauthenticatedRouter.js";
import authenticatedRouter from "./routes/authenticatedRouter.js";

import { cssDir } from "./utilities/path.js";
import { rootViewController } from "./controllers/rootController.js";
import { connectWithMongoose } from "./controllers/databaseController.js";
import sessionMiddleware from "./utilities/session.js";

const app = express();

const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", "views/ejs");

app.use(sessionMiddleware);

// Add parsing for HTML forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// CSS directory is registered as a public directory
app.use(express.static(cssDir));

// Authorization middleware
app.use(unauthenticatedRouter);

// Handle API routes
app.use("/api", apiRouter);

// Handle view routes (HTML pages)
app.use("/view", authenticatedRouter);

// Fallback
app.use(rootViewController);

// Connect to MongoDB with Mongoose
connectWithMongoose()
  .then(() => {
    server.listen(8081, () => {
      console.log("Server is running on http://localhost:8081");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
