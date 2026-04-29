import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csrf from "csurf";

import apiRouter from "./routes/apiRouter.js";
import viewRouter from "./routes/viewRouter.js";

import { cssDir } from "./utilities/path.js";
import { rootViewController } from "./controllers/rootController.js";
import { connectWithMongoose } from "./controllers/databaseController.js";
import sessionMiddleware from "./utilities/session.js";
import { authMiddleware } from "./controllers/authController.js";

const app = express();

const server = http.createServer(app);

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views/ejs");

app.use(sessionMiddleware);

// Add parsing for HTML forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(csrfProtection);

// CSS directory is registered as a public directory
app.use(express.static(cssDir));

// Add logged in user information to all views and requests
app.use(authMiddleware);

// Handle API routes
app.use("/api", apiRouter);

// Handle view routes (HTML pages)
app.use("/view", viewRouter);

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
