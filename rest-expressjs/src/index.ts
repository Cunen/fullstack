import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import postRoutes from "./routes/post.routes.ts";
import { corsMiddleware } from "./middleware/cors.middleware.ts";
import { connectWithMongoose } from "./db/mongoose.controller.ts";
import { logsDir, publicDir } from "./utils/path.ts";
import multerProvider from "./utils/multer.ts";
import userRoutes from "./routes/user.routes.ts";
import { initializeSocket } from "./utils/socket.ts";
import { schema } from "./graphql/schema.ts";
import { resolvers } from "./graphql/resolvers.ts";
import {
  graphqlAuthMiddleware,
  graphqlOptionsMiddleware,
} from "./middleware/graphql.middleware.ts";

dotenv.config({ path: ".env" });

// Created with: openssl req -nodes -new -x509 -keyout server.key -out server.cert
// const privateKey = fs.readFileSync(path.join(certDir, "server.key"), "utf8");
// const certificate = fs.readFileSync(path.join(certDir, "server.cert"), "utf8");

const logStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());

// Use compression when env is production
if (process.env.NODE_ENV === "production") {
  app.use(compression());
}

// Logging
app.use(morgan("combined", { stream: logStream }));

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
    /*
    const server = https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    */
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    initializeSocket(server);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
