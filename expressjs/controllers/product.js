import { Product } from "../models/product.js";

export const productViewController = (req, res, next) => {
  const id = req.params.id;
  const product = Product.getById(id);

  if (product) {
    res.render("product", {
      product,
      page: "products",
      pageTitle: "Product",
    });
  } else {
    next();
  }
};

export const productsViewController = (req, res) => {
  res.render("products", {
    products: Product.getAll(),
    page: "products",
    pageTitle: "Products",
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
  const product = Product.getById(id);

  if (product) {
    res.render("edit-product", {
      product,
      page: "edit-product",
      pageTitle: "Edit Product",
    });
  } else {
    next();
  }
};

export const productAddController = (req, res) => {
  const { name, price, description, inventory } = req.body;
  const product = new Product(name, price, description, inventory);
  product.save();
  res.redirect("/view/products");
};

export const productEditController = (req, res) => {
  const { name, price, description, inventory } = req.body;

  const id = req.params.id;

  Product.update(id, name, price, description, inventory);

  res.redirect("/view/products");
};

export const productDeleteController = (req, res) => {
  const id = req.params.id;
  Product.delete(id);
  res.redirect("/view/products");
};

export const productGetController = (req, res) => {
  res.json(Product.getAll());
};
