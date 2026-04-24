import http from "http";
import express from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";

import apiRouter from "./routes/apiRouter.js";
import viewRouter from "./routes/viewRouter.js";

import { cssDir } from "./utilities/path.js";
import { rootViewController } from "./controllers/rootController.js";
import { sequelize } from "./utilities/database.js";

const app = express();

const server = http.createServer(app);

// Handlebars Template Engine
app.engine(
  "handlebars",
  engine({
    layoutsDir: "./views",
    defaultLayout: "./handlebars/base",
    extname: "handlebars",
    helpers: {
      eq: (a, b) => a === b, // Custom helper for comparisons
      classComp: (a, b, match, fallback) =>
        a === b ? match : (fallback ?? ""),
    },
  })
);

/** Pick template engine, should work interchangeably
 * Adjust template directory between handlebars, pug, and ejs as needed
 */
// app.set("view engine", "handlebars");
// app.set("view engine", "pug");
app.set("view engine", "ejs");

/** Template directory */
//app.set("views", "views/handlebars");
// app.set("views", "views/pug");
app.set("views", "views/ejs");

// Add parsing for HTML forms
app.use(bodyParser.urlencoded({ extended: false }));

// CSS directory is registered as a public directory
app.use(express.static(cssDir));

// Handle API routes
app.use("/api", apiRouter);

// Handle view routes (HTML pages)
app.use("/view", viewRouter);

// Fallback
app.use(rootViewController);

// Initialize Sequelize connection
sequelize
  .sync()
  .then(() => {
    server.listen(8081, () => {
      console.log("Server is running on http://localhost:8081");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// Listen on port 8081
