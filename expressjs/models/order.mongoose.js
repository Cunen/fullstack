import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  count: Number,
});

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  total: { type: Number, required: true },
  items: [orderItemSchema],
});

const MongooseOrder = model("order", orderSchema);

export default MongooseOrder;
