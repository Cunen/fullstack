import { Cart } from "./databaseController.js";

export const cartViewController = (req, res) => {
  Cart.findOne({ userId: req.loggedInUser._id })
    .populate("items.productId")
    .then((cart) => {
      res.render("cart", {
        cart,
        page: "cart",
        pageTitle: "Cart",
      });
    });
};

export const cartAddController = async (req, res) => {
  const { productId, count } = req.body;

  const cart = await Cart.findOrCreateByUserId(req.loggedInUser._id);

  await cart.addProduct(productId, count);

  res.redirect("/view/cart");
};

export const cartEditController = async (req, res) => {
  const { productId, count } = req.body;

  const cart = await Cart.findOne({ userId: req.loggedInUser._id });

  if (!cart) return res.redirect("/view/cart");

  await cart.editProduct(productId, count);

  res.redirect("/view/cart");
};

export const cartRemoveController = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId: req.loggedInUser._id });

  if (!cart) return res.redirect("/view/cart");

  await cart.removeProduct(productId);

  res.redirect("/view/cart");
};
