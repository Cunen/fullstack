import express from "express";

import { openHTMLTemplate } from "../utilities/template.js";

const viewRouter = express.Router();

viewRouter.get("/user", (req, res) => {
  openHTMLTemplate("user", res);
});

viewRouter.get("/product", (req, res) => {
  openHTMLTemplate("product", res);
});

viewRouter.use("/", (req, res) => {
  openHTMLTemplate("404", res);
});

export default viewRouter;
