import express from "express";

import {
  productViewController,
  productsViewController,
  addProductViewController,
  editProductViewController,
} from "../controllers/productController.js";
import { notFoundViewController } from "../controllers/rootController.js";
import { cartViewController } from "../controllers/cartController.js";
import {
  checkoutViewController,
  orderViewController,
} from "../controllers/checkoutController.js";

const viewRouter = express.Router();

viewRouter.get("/product/:id", productViewController);
viewRouter.get("/products", productsViewController);
viewRouter.get("/checkout", checkoutViewController);
viewRouter.get("/orders", orderViewController);
viewRouter.get("/cart", cartViewController);
viewRouter.get("/add-product", addProductViewController);
viewRouter.get("/edit-product/:id", editProductViewController);
viewRouter.use("/", notFoundViewController);

export default viewRouter;
