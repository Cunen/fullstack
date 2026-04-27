import { Product } from "./databaseController.js";

export const productViewController = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    if (product) {
      res.render("product", {
        product,
        page: "products",
        pageTitle: "Product",
      });
    } else {
      next();
    }
  });
};

export const productsViewController = (req, res) => {
  Product.find().then((products) => {
    res.render("products", {
      products,
      page: "products",
      pageTitle: "Products",
    });
  });
};

export const addProductViewController = (req, res) => {
  res.render("add-product", {
    page: "add-product",
    pageTitle: "Add Product",
  });
};

export const editProductViewController = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    if (product) {
      res.render("edit-product", {
        product,
        page: "edit-product",
        pageTitle: "Edit Product",
      });
    } else {
      next();
    }
  });
};

export const productAddController = (req, res) => {
  const { name, price, description, inventory } = req.body;
  const product = new Product({
    name,
    price: Number(price),
    description,
    inventory: Number(inventory),
  });
  product.save().then(() => {
    res.redirect("/view/products");
  });
};

export const productEditController = (req, res) => {
  const { name, price, description, inventory, productId } = req.body;

  Product.updateOne(
    { _id: productId },
    { name, price: Number(price), description, inventory: Number(inventory) }
  ).then(() => {
    res.redirect("/view/products");
  });
};

export const productDeleteController = (req, res) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId }).then(() => {
    res.redirect("/view/products");
  });
};
