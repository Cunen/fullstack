import { Cart, Order, Product } from "./databaseController.js";

export const checkoutViewController = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.loggedInUser._id }).populate(
    "items.productId"
  );

  const total = cart?.getTotal() || 0;

  return res.render("checkout", {
    cart,
    total,
    page: "checkout",
    pageTitle: "Checkout",
  });
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
