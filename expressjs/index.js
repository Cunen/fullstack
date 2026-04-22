import http from "http";
import express from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";

import apiRouter from "./routes/api.js";
import viewRouter from "./routes/views.js";

import { cssDir } from "./utilities/path.js";

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
app.use((req, res) => res.render("root", { page: "root", pageTitle: "Home" }));

// Listen on port 8081
server.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
