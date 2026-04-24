import { Product } from "../models/productModel.js";

export const cartViewController = (req, res) => {
  // Alternative way to fetch user cart items with Sequelize associations
  req.loggedInUser.getSeq_cart_items().then(() => {
    // console.log("Cart items for user:", cartItems);
  });

  Product.getCartProducts(req.loggedInUser.id).then((products) => {
    res.render("cart", {
      products,
      page: "cart",
      pageTitle: "Cart",
    });
  });
};

export const cartAddController = (req, res) => {
  const { seqProductId, count } = req.body;
  Product.addToCart(seqProductId, req.loggedInUser.id, count).then(() => {
    res.redirect("/view/cart");
  });
};

export const cartEditController = (req, res) => {
  const { id, count } = req.body;
  Product.editCartCount(id, count).then(() => {
    res.redirect("/view/cart");
  });
};

export const cartRemoveController = (req, res) => {
  const { id } = req.body;
  Product.removeFromCart(id).then(() => {
    res.redirect("/view/cart");
  });
};
