import express from "express";
import bodyParser from "body-parser";

import postRoutes from "./routes/post.routes.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { connectWithMongoose } from "./db/mongoose.controller.js";

const app = express();
const port = "3000";

app.use(bodyParser.json());

// CORS Middleware
app.use(corsMiddleware);

app.use("/api/posts", postRoutes);

connectWithMongoose()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
