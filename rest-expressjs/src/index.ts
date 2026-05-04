import express from "express";
import productRouter from "./routes/product.routes.js";

const app = express();
const port = "3000";

app.use("/api/products", productRouter);

app.listen(port);
