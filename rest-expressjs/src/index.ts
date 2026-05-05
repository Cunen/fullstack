import express from "express";
import bodyParser from "body-parser";

import postRoutes from "./routes/post.routes.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";

const app = express();
const port = "3000";

app.use(bodyParser.json());

// CORS Middleware
app.use(corsMiddleware);

app.use("/api/posts", postRoutes);

app.listen(port);
