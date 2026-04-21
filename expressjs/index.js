import http from "http";
import express from "express";

import { viewHandler } from "./modules/views.js";
import { apiHandler } from "./modules/api.js";

const app = express();

const server = http.createServer(app);

app.use(apiHandler);

app.use(viewHandler);

// Listen on port 8081
server.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
