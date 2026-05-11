import express from "express";

import {
  createPost,
  deletePost,
  getPosts,
  getPost,
  updatePost,
  validatePostData,
  createPostFromForm,
} from "../controllers/post.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const postRoutes = express.Router();

postRoutes.get("/", authMiddleware, getPosts);
postRoutes.get("/:id", authMiddleware, getPost);
postRoutes.post("/", authMiddleware, validatePostData, createPost);
postRoutes.post("/form", authMiddleware, validatePostData, createPostFromForm);
postRoutes.patch("/:id", authMiddleware, updatePost);
postRoutes.delete("/:id", authMiddleware, deletePost);

export default postRoutes;
