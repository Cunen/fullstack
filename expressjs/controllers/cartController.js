import { Product } from "../models/productModel.js";

export const cartViewController = (req, res) => {
  Product.getCartProducts().then((products) => {
    res.render("cart", {
      products,
      page: "cart",
      pageTitle: "Cart",
    });
  });
};

export const cartAddController = (req, res) => {
  const { productId, count } = req.body;
  Product.addToCart(productId, count).then(() => {
    res.redirect("/view/cart");
  });
};

export const cartEditController = (req, res) => {
  const { productId, count } = req.body;
  Product.editCartCount(productId, count).then(() => {
    res.redirect("/view/cart");
  });
};

export const cartRemoveController = (req, res) => {
  const { productId } = req.body;
  Product.removeFromCart(productId).then(() => {
    res.redirect("/view/cart");
  });
};
