import express from "express";

import {
  productAddController,
  productDeleteController,
  productEditController,
  productGetController,
} from "../controllers/product.js";
import {
  cartAddController,
  cartEditController,
  cartRemoveController,
} from "../controllers/cart.js";

const apiRouter = express.Router();

apiRouter.post("/product", productAddController);
apiRouter.post("/product/:id", productEditController);
apiRouter.post("/product/delete/:id", productDeleteController);

apiRouter.post("/cart/add/:id", cartAddController);
apiRouter.post("/cart/edit/:id", cartEditController);
apiRouter.post("/cart/remove/:id", cartRemoveController);

apiRouter.get("/products", productGetController);

export default apiRouter;
