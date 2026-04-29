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
} from "../controllers/authController.js";

const apiRouter = express.Router();

apiRouter.post("/login", loginController);
apiRouter.post("/register", registerController);

apiRouter.post("/product", allowAuth, productAddController);
apiRouter.post("/product/edit", allowAuth, productEditController);
apiRouter.post("/product/delete", allowAuth, productDeleteController);

apiRouter.post("/cart/add", allowAuth, cartAddController);
apiRouter.post("/cart/edit", allowAuth, cartEditController);
apiRouter.post("/cart/remove", allowAuth, cartRemoveController);

apiRouter.post("/checkout", allowAuth, checkoutController);

export default apiRouter;
