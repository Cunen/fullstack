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
import { validateProduct, validateRegister } from "./validators.js";

const apiRouter = express.Router();

// Create a validator chain for register POST route

apiRouter.post("/login", loginController);
apiRouter.post("/register", validateRegister, registerController);

apiRouter.post("/request-reset", requestResetController);
apiRouter.post("/password-reset", resetPasswordController);

apiRouter.post("/product", allowAuth, validateProduct, productAddController);
apiRouter.post(
  "/product/edit",
  allowAuth,
  validateProduct,
  productEditController
);
apiRouter.post("/product/delete", allowAuth, productDeleteController);

apiRouter.post("/cart/add", allowAuth, cartAddController);
apiRouter.post("/cart/edit", allowAuth, cartEditController);
apiRouter.post("/cart/remove", allowAuth, cartRemoveController);

apiRouter.post("/checkout", allowAuth, checkoutController);

export default apiRouter;
