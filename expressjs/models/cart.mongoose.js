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

cartSchema.statics.findOrCreateByUserId = async function (userId) {
  let cart = await this.findOne({ userId: userId });
  if (!cart) {
    cart = await this.create({ userId, items: [] });
  }
  return cart;
};

cartSchema.methods.addProduct = async function (productId, count) {
  const existingItem = this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingItem) existingItem.count += Number(count);
  else this.items.push({ productId, count: Number(count) });

  await this.save();

  return this;
};

cartSchema.methods.editProduct = async function (productId, count) {
  const existingItem = this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (!existingItem) return null;

  existingItem.count = Number(count);

  await this.save();

  return this;
};

cartSchema.methods.removeProduct = async function (productId) {
  const existingItem = this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (!existingItem) return null;

  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await this.save();

  return this;
};

cartSchema.methods.getTotal = function () {
  return this.items.reduce(
    (acc, item) => acc + item.productId.price * item.count,
    0
  );
};

const MongooseCart = model("cart", cartSchema);

export default MongooseCart;
