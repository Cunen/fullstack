import { mongodb } from "../utilities/database.js";
import { ObjectId } from "mongodb";

/** Product / Cart handler implementation with Sequelize */
export class Product {
  constructor(name, price, description, inventory) {
    this.id = Date.now().toString();
    this.name = name;
    this.price = price;
    this.description = description;
    this.inventory = inventory;
  }

  async save() {
    try {
      const products = mongodb.collection("products");
      const product = await products.insertOne({
        name: this.name,
        price: this.price,
        description: this.description,
        inventory: this.inventory,
      });
      return product;
    } catch (e) {
      console.error("Error creating MongoDB product:", e);
      return null;
    }
  }

  static async update(id, name, price, description, inventory) {
    try {
      const products = mongodb.collection("products");
      const product = await products.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, price, description, inventory } }
      );
      return product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async delete(id) {
    try {
      const products = mongodb.collection("products");
      const product = await products.deleteOne({ _id: new ObjectId(id) });
      return product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async getAll() {
    try {
      const collection = mongodb.collection("products");
      const products = await collection.find().toArray();
      return products;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getById(id) {
    try {
      const products = mongodb.collection("products");
      const product = await products.findOne({ _id: new ObjectId(id) });
      return product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Shopping Cart
  static async addToCart(productId, userId, count = 1) {
    try {
      const cart = mongodb.collection("cart_items");
      const item = await cart.insertOne({
        productId: new ObjectId(productId),
        userId: new ObjectId(userId),
        count,
      });
      return item;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async editCartCount(id, count) {
    if (count <= 0) {
      return Product.removeFromCart(id);
    }

    try {
      const cart = mongodb.collection("cart_items");
      const item = await cart.updateOne(
        { _id: new ObjectId(id) },
        { $set: { count } }
      );
      return item;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async removeFromCart(id) {
    try {
      const cart = mongodb.collection("cart_items");
      const item = await cart.deleteOne({ _id: new ObjectId(id) });
      return item;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async clearCart(userId) {
    try {
      const cart = mongodb.collection("cart_items");
      const items = await cart.deleteMany({ userId: new ObjectId(userId) });
      return items;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async getCart(userId) {
    try {
      const cart = mongodb.collection("cart_items");
      const items = await cart
        .aggregate([
          { $match: { userId: new ObjectId(userId) } },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$product",
          },
        ])
        .toArray();
      return items;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // Checkout
  static async checkoutCartItems(orderId, userId) {
    try {
      const products = mongodb.collection("products");
      const orders = mongodb.collection("orders");

      // Get ordered products
      const order = await orders.findOne({ _id: new ObjectId(orderId) });

      const ops = order.items.map((item) => ({
        updateOne: {
          filter: { _id: new ObjectId(item.productId) },
          update: { $inc: { inventory: -item.count } },
        },
      }));

      await products.bulkWrite(ops);

      await products.deleteMany({ inventory: { $lte: 0 } });

      return Product.clearCart(userId);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
