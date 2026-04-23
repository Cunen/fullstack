import { Product } from "../models/productModel.js";

export const cartViewController = (req, res) => {
  res.render("cart", {
    products: Product.getCartProducts(),
    page: "cart",
    pageTitle: "Cart",
  });
};

export const cartAddController = (req, res) => {
  const { productId, count } = req.body;
  Product.addToCart(productId, count);
  res.redirect("/view/cart");
};

export const cartEditController = (req, res) => {
  const { productId, count } = req.body;
  Product.editCartCount(productId, count);
  res.redirect("/view/cart");
};

export const cartRemoveController = (req, res) => {
  const { productId } = req.body;
  Product.removeFromCart(productId);
  res.redirect("/view/cart");
};
