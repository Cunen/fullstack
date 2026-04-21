import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

// Listen on port 8081
server.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
