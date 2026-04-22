import express from "express";

import {
  productViewController,
  productsViewController,
  checkoutViewController,
  cartViewController,
  addProductViewController,
  editProductViewController,
} from "../controllers/product.js";
import { notFoundViewController } from "../controllers/root.js";

const viewRouter = express.Router();

viewRouter.get("/product/:id", productViewController);
viewRouter.get("/products", productsViewController);
viewRouter.get("/checkout", checkoutViewController);
viewRouter.get("/cart", cartViewController);
viewRouter.get("/add-product", addProductViewController);
viewRouter.get("/edit-product/:id", editProductViewController);
viewRouter.use("/", notFoundViewController);

export default viewRouter;
