import express from "express";

import {
  createUser,
  getUser,
  getUsers,
  loginUser,
  logoutUser,
  validateUser,
} from "../controllers/user.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", authMiddleware, getUser);

userRoutes.post("/", validateUser, createUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);

export default userRoutes;
