import { validationResult } from "express-validator";
import { Product } from "./databaseController.js";
import redirectWithNotification from "../utilities/notification.js";

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

export const productAddController = async (req, res, next) => {
  const { name, price, description, inventory } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return redirectWithNotification(
        req,
        res,
        "/view/add-product",
        "error",
        "Validation failed",
        errors.array(),
        { name, price, description, inventory }
      );
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      inventory: Number(inventory),
    });

    await product.save();

    return res.redirect("/view/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
};

export const productEditController = async (req, res) => {
  const { name, price, description, inventory, productId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return redirectWithNotification(
      req,
      res,
      "/view/edit-product/" + productId,
      "error",
      "Validation failed",
      errors.array(),
      { name, price, description, inventory }
    );
  }

  await Product.updateOne(
    { _id: productId },
    { name, price: Number(price), description, inventory: Number(inventory) }
  );

  return res.redirect("/view/products");
};

export const productDeleteController = (req, res) => {
  const { productId } = req.body;
  Product.findByIdAndDelete(productId).then(() => {
    res.redirect("/view/products");
  });
};
