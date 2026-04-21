import express from "express";

const apiRouter = express.Router();

apiRouter.post("/api/user", (req, res) => {
  console.log(req.body);
  res.redirect("/view/user");
});

apiRouter.post("/api/product", (req, res) => {
  console.log(req.body);
  res.redirect("/view/product");
});

export default apiRouter;
