import express from "express";

import { products } from "./api.js";

const viewRouter = express.Router();

viewRouter.get("/user", (req, res) => {
  res.render("pug/user");
});

viewRouter.get("/product", (req, res) => {
  res.render("pug/product", { products });
});

viewRouter.use("/", (req, res) => {
  res.render("pug/root");
});

export default viewRouter;
