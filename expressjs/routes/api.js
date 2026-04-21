import express from "express";

const apiRouter = express.Router();

apiRouter.post("/user", (req, res) => {
  console.log(req.body);
  res.redirect("/view/user");
});

apiRouter.post("/product", (req, res) => {
  console.log(req.body);
  res.redirect("/view/product");
});

export default apiRouter;
