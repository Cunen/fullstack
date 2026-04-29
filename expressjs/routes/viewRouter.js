import express from "express";

import {
  productViewController,
  addProductViewController,
  editProductViewController,
  productsViewController,
} from "../controllers/productController.js";
import {
  notFoundViewController,
  rootViewController,
} from "../controllers/rootController.js";
import { cartViewController } from "../controllers/cartController.js";
import {
  checkoutViewController,
  orderViewController,
} from "../controllers/checkoutController.js";
import {
  allowAuth,
  loginViewController,
  logoutViewController,
  registerViewController,
} from "../controllers/authController.js";

const viewRouter = express.Router();

viewRouter.get("/logout", logoutViewController);
viewRouter.get("/login", loginViewController);
viewRouter.get("/register", registerViewController);
viewRouter.get("/products", productsViewController);
viewRouter.get("/home", rootViewController);
viewRouter.get("/product/:id", productViewController);

viewRouter.get("/checkout", allowAuth, checkoutViewController);
viewRouter.get("/orders", allowAuth, orderViewController);
viewRouter.get("/cart", allowAuth, cartViewController);
viewRouter.get("/add-product", allowAuth, addProductViewController);
viewRouter.get("/edit-product/:id", allowAuth, editProductViewController);

viewRouter.use("/", notFoundViewController);

export default viewRouter;
