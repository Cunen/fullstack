import { Product } from "../models/productModel.js";
import { SeqOrderItems, SeqProduct } from "../utilities/database.js";

export const checkoutViewController = (req, res) => {
  Product.getCartProducts(req.loggedInUser.id).then((products) => {
    const total = products.reduce(
      (acc, product) => acc + product.price * product.count,
      0
    );
    res.render("checkout", {
      products,
      total,
      page: "checkout",
      pageTitle: "Checkout",
    });
  });
};

export const orderViewController = async (req, res) => {
  try {
    const orders = await req.loggedInUser.getSeq_orders({
      include: [
        {
          model: SeqOrderItems,
          include: [SeqProduct],
        },
      ],
    });

    res.render("orders", {
      orders,
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
    // Works through association
    const cartItems = await user.getSeq_cart_items();
    const order = await user.createSeq_order();
    const addOrderItems = cartItems.map((item) => {
      return order.createSeq_order_item({
        count: item.count,
        seqProductId: item.seqProductId,
        seqUserId: user.id,
      });
    });

    await Promise.all(addOrderItems);

    await Product.checkoutCartItems(cartItems, req.loggedInUser.id);

    res.redirect("/view/products");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.redirect("/view/checkout");
  }
};
