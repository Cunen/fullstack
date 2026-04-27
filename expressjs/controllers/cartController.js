import { Cart } from "../utilities/database.js";

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

  const cart = await Cart.findOne({ userId: req.loggedInUser._id });

  if (cart) {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) existingItem.count += Number(count);
    else cart.items.push({ productId, count: Number(count) });

    await cart.save();
  } else {
    await Cart.create({
      userId: req.loggedInUser._id,
      items: [{ productId, count: Number(count) }],
    });
  }

  res.redirect("/view/cart");
};

export const cartEditController = async (req, res) => {
  const { productId, count } = req.body;

  const cart = await Cart.findOne({ userId: req.loggedInUser._id });

  if (!cart) return res.redirect("/view/cart");

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (!existingItem) return res.redirect("/view/cart");

  existingItem.count = Number(count);

  await cart.save();

  res.redirect("/view/cart");
};

export const cartRemoveController = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId: req.loggedInUser._id });

  if (!cart) return res.redirect("/view/cart");

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (!existingItem) return res.redirect("/view/cart");

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await cart.save();

  res.redirect("/view/cart");
};
