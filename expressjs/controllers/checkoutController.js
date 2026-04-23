import { Product } from "../models/productModel.js";

export const checkoutViewController = (req, res) => {
  res.render("checkout", {
    products: Product.getCartProducts(),
    page: "checkout",
    pageTitle: "Checkout",
  });
};
