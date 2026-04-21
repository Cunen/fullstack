import express from "express";

import { openHTMLTemplate } from "../modules/template.js";

const viewRouter = express.Router();

viewRouter.get("/view/user", (req, res) => {
  openHTMLTemplate("user", res);
});

viewRouter.get("/view/product", (req, res) => {
  openHTMLTemplate("product", res);
});

export default viewRouter;
