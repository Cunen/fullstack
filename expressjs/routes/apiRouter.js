import express from "express";

import {
  productAddController,
  productDeleteController,
  productEditController,
} from "../controllers/productController.js";
import {
  cartAddController,
  cartEditController,
  cartRemoveController,
} from "../controllers/cartController.js";
import { checkoutController } from "../controllers/checkoutController.js";
import {
  allowAuth,
  loginController,
  registerController,
  requestResetController,
  resetPasswordController,
} from "../controllers/authController.js";
import { check } from "express-validator";
import { User } from "../controllers/databaseController.js";

const apiRouter = express.Router();

// Create a validator chain for register POST route
const registerValidationChain = [
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

apiRouter.post("/login", loginController);
apiRouter.post("/register", registerValidationChain, registerController);

apiRouter.post("/request-reset", requestResetController);
apiRouter.post("/password-reset", resetPasswordController);

apiRouter.post("/product", allowAuth, productAddController);
apiRouter.post("/product/edit", allowAuth, productEditController);
apiRouter.post("/product/delete", allowAuth, productDeleteController);

apiRouter.post("/cart/add", allowAuth, cartAddController);
apiRouter.post("/cart/edit", allowAuth, cartEditController);
apiRouter.post("/cart/remove", allowAuth, cartRemoveController);

apiRouter.post("/checkout", allowAuth, checkoutController);

export default apiRouter;
