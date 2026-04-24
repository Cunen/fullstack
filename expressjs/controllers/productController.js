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
  console.log(req.loggedInUser);
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
  const product = new Product(name, price, description, inventory);
  product.save().then(() => {
    res.redirect("/view/products");
  });
};

export const productEditController = (req, res) => {
  const { name, price, description, inventory, seqProductId } = req.body;
  Product.update(seqProductId, name, price, description, inventory).then(() => {
    res.redirect("/view/products");
  });
};

export const productDeleteController = (req, res) => {
  const { seqProductId } = req.body;
  Product.delete(seqProductId).then(() => {
    res.redirect("/view/products");
  });
};
