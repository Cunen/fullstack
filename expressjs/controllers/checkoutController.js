import { Product } from "../models/productModel.js";

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

export const checkoutController = (req, res) => {
  Product.getCart(req.loggedInUser.id).then((cartItems) => {
    Product.checkoutCartItems(cartItems, req.loggedInUser.id).then(() => {
      res.redirect("/view/products");
    });
  });
};
