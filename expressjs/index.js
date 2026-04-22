import http from "http";
import express from "express";
import bodyParser from "body-parser";

import apiRouter from "./routes/api.js";
import viewRouter from "./routes/views.js";

import { openHTMLTemplate } from "./utilities/template.js";
import { cssDir } from "./utilities/path.js";

const app = express();

const server = http.createServer(app);

// Templating engine is set to Pug
app.set("view engine", "pug");
app.set("views", "views");

// Add parsing for HTML forms
app.use(bodyParser.urlencoded({ extended: false }));

// CSS directory is registered as a public directory
app.use(express.static(cssDir));

// Handle API routes
app.use("/api", apiRouter);

app.use("/view", viewRouter);

// Fallback
app.use((req, res) => openHTMLTemplate("root", res));

// Listen on port 8081
server.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
