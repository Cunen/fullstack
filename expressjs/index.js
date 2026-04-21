import http from "http";
import express from "express";
import bodyParser from "body-parser";

import apiRouter from "./routes/api.js";
import viewRouter from "./routes/views.js";

import { openHTMLTemplate } from "./modules/template.js";

const app = express();

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(apiRouter);

app.use(viewRouter);

// Fallback
app.use("/", (req, res) => openHTMLTemplate("404", res));

// Listen on port 8081
server.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
