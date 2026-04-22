import express from "express";

import { products } from "./api.js";

const viewRouter = express.Router();

viewRouter.get("/user", (req, res) => {
  res.render("pug/user", { page: "user" });
});

viewRouter.get("/product", (req, res) => {
  res.render("pug/product", { products, page: "product" });
});

viewRouter.use("/", (req, res) => {
  res.render("pug/404", { page: "404" });
});

export default viewRouter;
