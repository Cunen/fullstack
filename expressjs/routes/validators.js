import { check } from "express-validator";

import { User } from "../controllers/databaseController.js";

export const validateRegister = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (email) => {
      // Check if the email is already in use
      const user = await User.findOne({ email });
      if (user) return Promise.reject("Email is already in use");
      return Promise.resolve();
    })
    .withMessage("Email is already in use"),
  check("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  check("username")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long")
    .custom(async (username) => {
      // Check if the username is already in use
      const user = await User.findOne({ username });
      if (user) return Promise.reject("Username is already in use");
      return Promise.resolve();
    }),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value) => value !== "password")
    .withMessage("Password can't be password"),
  check("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const validateProduct = [
  check("name").notEmpty().withMessage("Product name is required"),
  check("price")
    .notEmpty()
    .isNumeric()
    .withMessage("Product price is required and must be a number"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required"),
  check("inventory")
    .notEmpty()
    .isNumeric()
    .withMessage("Product inventory is required and must be a number"),
];
