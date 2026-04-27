import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  count: Number,
});

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  items: [cartItemSchema],
});

const Cart = model("cart", cartSchema);

export default Cart;
