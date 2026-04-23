import { Product } from "../models/productModel.js";

export const checkoutViewController = (req, res) => {
  res.render("checkout", {
    products: Product.getCartProducts(),
    page: "checkout",
    pageTitle: "Checkout",
  });
};

export const checkoutController = (req, res) => {
  const { products } = req.body;

  const productsList = products.split(";").map((item) => {
    const [productId, count] = item.split(" ");
    return { productId, count };
  });

  Product.checkoutCartItems(productsList);

  res.redirect("/view/products");
};
