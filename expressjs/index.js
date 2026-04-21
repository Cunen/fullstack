import http from "http";
import express from "express";

import { viewHandler } from "./modules/views.js";
import { apiHandler } from "./modules/api.js";
import { rootHandler } from "./modules/root.js";

const app = express();

const server = http.createServer(app);

app.use("/api", apiHandler);

app.use("/view", viewHandler);

app.use("/", rootHandler);

// Listen on port 8081
server.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
