import express from "express";

import { products } from "./api.js";

const viewRouter = express.Router();

viewRouter.get("/user", (req, res) => {
  res.render("user", { page: "user", pageTitle: "Add User" });
});

viewRouter.get("/product", (req, res) => {
  res.render("product", {
    products,
    page: "product",
    pageTitle: "Add Product",
  });
});

viewRouter.use("/", (req, res) => {
  res.render("404", { page: "404", pageTitle: "Page Not Found" });
});

export default viewRouter;
