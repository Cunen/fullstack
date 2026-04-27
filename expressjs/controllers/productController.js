import { Product } from "../models/productModel.js";

export const productViewController = (req, res, next) => {
  const id = req.params.id;

  Product.getById(id).then((product) => {
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
  Product.getAll().then((products) => {
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
  Product.getById(id).then((product) => {
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
  const product = new Product(
    name,
    Number(price),
    description,
    Number(inventory)
  );
  product.save().then(() => {
    res.redirect("/view/products");
  });
};

export const productEditController = (req, res) => {
  const { name, price, description, inventory, productId } = req.body;
  Product.update(
    productId,
    name,
    Number(price),
    description,
    Number(inventory)
  ).then(() => {
    res.redirect("/view/products");
  });
};

export const productDeleteController = (req, res) => {
  const { productId } = req.body;
  Product.delete(productId).then(() => {
    res.redirect("/view/products");
  });
};
