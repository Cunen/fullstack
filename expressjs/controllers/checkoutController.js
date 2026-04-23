import { Product } from "../models/productModel.js";

export const checkoutViewController = (req, res) => {
  Product.getCartProducts().then((products) => {
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

export const checkoutController = (req, res) => {
  Product.getCart().then((cartItems) => {
    Product.checkoutCartItems(cartItems).then(() => {
      res.redirect("/view/products");
    });
  });
};
