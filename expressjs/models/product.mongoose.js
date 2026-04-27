import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  inventory: { type: Number, required: true },
});

const MongooseProduct = model("product", productSchema);

export default MongooseProduct;
