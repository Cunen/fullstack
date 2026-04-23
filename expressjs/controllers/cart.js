import { Product } from "../models/product.js";

export const cartViewController = (req, res) => {
  res.render("cart", {
    products: Product.getCartProducts(),
    page: "cart",
    pageTitle: "Cart",
  });
};

export const cartAddController = (req, res) => {
  const id = req.params.id;
  const { count } = req.body;
  Product.addToCart(id, count);
  res.redirect("/view/cart");
};

export const cartEditController = (req, res) => {
  const id = req.params.id;
  const { count } = req.body;
  Product.editCartCount(id, count);
  res.redirect("/view/cart");
};

export const cartRemoveController = (req, res) => {
  const id = req.params.id;
  Product.removeFromCart(id);
  res.redirect("/view/cart");
};
