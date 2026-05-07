import type { Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "process";
import dotenv from "dotenv";

import { User } from "../db/mongoose.controller.js";
import { check, validationResult } from "express-validator";
import { runValidation } from "../utils/utils.js";
import { imagesDir } from "../utils/path.js";
import type { AuthRequest } from "../utils/types.js";

dotenv.config({ path: ".env.local" });

const secretKey = process.env.JWT_SECRET || "default_secret_key";

// GET /api/users
export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  try {
    const total = await User.countDocuments();
    const pages = Math.ceil(total / limit);
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      page,
      pages,
      limit,
      total,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// GET /api/users/:id
export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

// POST /api/users
export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  try {
    const errors = runValidation(req, res);
    if (errors) return res.status(400).json(errors);

    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hash });

    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user" });
  }
};

export const validateUser = [
  check("username")
    .isLength({ min: 5 })
    .withMessage("Title is required")
    .custom((value, { req }) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    }),
  check("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already in use");
        }
      });
    }),
  check("password").isLength({ min: 5 }).withMessage("Content is required"),
];

// POST /api/users/login
export const loginUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const logoutUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Since JWT is stateless, we can't invalidate the token on the server side.
  // The client should simply delete the token to "log out".
  return res.status(200).json({ message: "Logout successful" });
};
