import express from "express";
import type { Request, Response, NextFunction } from "express";
import {
  getProducts,
  postProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", postProducts);

export default router;
