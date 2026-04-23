import { Product } from "../models/productModel.js";

export const checkoutViewController = (req, res) => {
  const products = Product.getCartProducts();
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
