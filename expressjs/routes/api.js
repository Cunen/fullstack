import express from "express";

const apiRouter = express.Router();

const products = [];

apiRouter.post("/user", (req, res) => {
  console.log(req.body);
  res.redirect("/view/user");
});

apiRouter.post("/product", (req, res) => {
  const product = req.body;
  products.push(product);
  res.redirect("/view/product");
});

apiRouter.get("/products", (req, res) => {
  res.json(products);
});

export default apiRouter;

export { products };