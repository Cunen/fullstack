import Stripe from "stripe";
import dotenv from "dotenv";
import process from "process";

import { Cart, Order, Product } from "./databaseController.js";

dotenv.config({ path: ".env.local" });

const stripeSk = process.env.STRIPE_SK;
const stripe = new Stripe(stripeSk);

export const checkoutViewController = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.loggedInUser._id }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.redirect("/view/cart");
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productId.name,
          description: item.productId.description || "No description",
        },
        unit_amount: Math.round(item.productId.price * 100), // Convert to cents
      },
      quantity: item.count,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${req.protocol}://${req.get("host")}/view/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/view/checkout`,
    });

    const total = cart.getTotal() || 0;

    return res.render("checkout", {
      cart,
      total,
      page: "checkout",
      pageTitle: "Checkout",
      stripeSessionId: session?.id || "404",
      stripePublicKey: process.env.STRIPE_PK,
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
};

export const orderViewController = async (req, res) => {
  const orders = await Order.find({ userId: req.loggedInUser._id }).populate(
    "items.productId"
  );

  return res.render("orders", {
    orders: orders || [],
    page: "orders",
    pageTitle: "Orders",
  });
};

export const checkoutController = async (req, res) => {
  const user = req.loggedInUser;

  const cart = await Cart.findOne({ userId: user._id }).populate(
    "items.productId"
  );

  if (!cart) {
    return res.redirect("/view/checkout");
  }

  const total = cart.items.reduce(
    (acc, item) => acc + item.productId.price * item.count,
    0
  );

  const order = new Order({
    userId: user._id,
    total,
    items: cart.items.map((item) => ({
      productId: item.productId._id,
      count: item.count,
    })),
  });

  await order.save();

  const productUpdates = cart.items.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.productId._id },
        update: { $inc: { inventory: -item.count } },
      },
    };
  });
  await Product.bulkWrite(productUpdates);

  // Delete the cart after creating the order
  await Cart.deleteOne({ userId: user._id });

  res.redirect("/view/orders");
};
