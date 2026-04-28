import express from "express";

import {
  authController,
  loginController,
  loginViewController,
  logoutViewController,
  registerController,
  registerViewController,
} from "../controllers/authController.js";
import { productsViewController } from "../controllers/productController.js";
import { rootViewController } from "../controllers/rootController.js";

const authRouter = express.Router();

authRouter.post("/api/login", loginController);
authRouter.post("/api/register", registerController);

authRouter.use("/view/logout", logoutViewController);
authRouter.get("/view/login", loginViewController);
authRouter.get("/view/register", registerViewController);
authRouter.get("/view/products", productsViewController);
authRouter.get("/view/home", rootViewController);

authRouter.use("/", authController);

export default authRouter;
