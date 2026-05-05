import express from "express";

import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

const postRoutes = express.Router();

postRoutes.get("/", getPosts);
postRoutes.get("/:id", getPosts);
postRoutes.post("/", createPost);
postRoutes.patch("/:id", updatePost);
postRoutes.delete("/:id", deletePost);

export default postRoutes;
