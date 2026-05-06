import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  loginUser,
  validateUser,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);

userRoutes.post("/", validateUser, createUser);
userRoutes.post("/login", loginUser);

export default userRoutes;
