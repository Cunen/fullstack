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

const apiRouter = express.Router();

apiRouter.post("/product", productAddController);
apiRouter.post("/product/edit", productEditController);
apiRouter.post("/product/delete", productDeleteController);

apiRouter.post("/cart/add", cartAddController);
apiRouter.post("/cart/edit", cartEditController);
apiRouter.post("/cart/remove", cartRemoveController);

apiRouter.post("/checkout", checkoutController);

export default apiRouter;
