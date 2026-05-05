import express from "express";

import { createPost, getPosts } from "../controllers/post.controller.js";

const postRoutes = express.Router();

postRoutes.get("/", getPosts);
postRoutes.post("/", createPost);

export default postRoutes;
