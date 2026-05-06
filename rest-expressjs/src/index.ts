import express from "express";
import bodyParser from "body-parser";
import multer from "multer";

import postRoutes from "./routes/post.routes.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { connectWithMongoose } from "./db/mongoose.controller.js";
import { publicDir } from "./utils/path.js";
import multerProvider from "./utils/multer.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const port = "3000";

app.use(bodyParser.json());

app.use(express.static(publicDir));

app.use(multerProvider);

// CORS Middleware
app.use(corsMiddleware);

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

connectWithMongoose()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
