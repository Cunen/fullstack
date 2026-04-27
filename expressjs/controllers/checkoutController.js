import { Product } from "../models/productModel.js";
import { mongodb } from "../utilities/database.js";

export const checkoutViewController = (req, res) => {
  Product.getCart(req.loggedInUser._id).then((items) => {
    const total = items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0
    );
    res.render("checkout", {
      items,
      total,
      page: "checkout",
      pageTitle: "Checkout",
    });
  });
};

export const orderViewController = async (req, res) => {
  try {
    const orders = mongodb.collection("orders");

    const userOrders = await orders
      .find({ userId: req.loggedInUser._id })
      .toArray();

    res.render("orders", {
      orders: userOrders,
      page: "orders",
      pageTitle: "Orders",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.redirect("/view/products");
  }
};

export const checkoutController = async (req, res) => {
  const user = req.loggedInUser;

  try {
    const items = await Product.getCart(user._id);

    // Create order with items
    const orders = mongodb.collection("orders");
    const insertedOrder = await orders.insertOne({
      userId: user._id,
      items: items.map((item) => item),
    });

    await Product.checkoutCartItems(insertedOrder.insertedId, user._id);

    res.redirect("/view/orders");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.redirect("/view/checkout");
  }
};
