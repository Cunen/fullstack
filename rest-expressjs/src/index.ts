import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";

import postRoutes from "./routes/post.routes.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { connectWithMongoose } from "./db/mongoose.controller.js";
import { publicDir } from "./utils/path.js";
import multerProvider from "./utils/multer.js";
import userRoutes from "./routes/user.routes.js";
import { initializeSocket } from "./utils/socket.js";
import { schema } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import {
  graphqlAuthMiddleware,
  graphqlOptionsMiddleware,
} from "./middleware/graphql.middleware.js";

const app = express();
const port = "3000";

app.use(bodyParser.json());

app.use(express.static(publicDir));

app.use(multerProvider);

// CORS Middleware
app.use(corsMiddleware);

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.use("/graphql", graphqlOptionsMiddleware, graphqlAuthMiddleware);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn: (err) => {
      return {
        message: err.message,
        status: 500,
      };
    },
  })
);

connectWithMongoose()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    initializeSocket(server);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
