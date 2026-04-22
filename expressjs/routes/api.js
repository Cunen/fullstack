import express from "express";

import {
  productAddController,
  productEditController,
  productGetController,
} from "../controllers/product.js";

const apiRouter = express.Router();

apiRouter.post("/product", productAddController);

apiRouter.post("/product/:id", productEditController);

apiRouter.get("/products", productGetController);

export default apiRouter;
