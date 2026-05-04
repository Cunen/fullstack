import { validationResult } from "express-validator";
import fs from "fs";
import PDFKit from "pdfkit";

import { Product } from "./databaseController.js";
import redirectWithNotification from "../utilities/notification.js";
import path from "path";
import { imagesDir } from "../utilities/path.js";

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

export const productsViewController = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .skip((page - 1) * 2)
      .limit(2);

    return res.render("products", {
      products,
      page: "products",
      pageTitle: "Products",
      totalPages: Math.ceil(totalProducts / 2),
      currentPage: page,
    });
  } catch (err) {
    console.log(error);
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
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
  const image = req.file;

  try {
    const errors = validationResult(req);

    const errArray = !errors.isEmpty() ? errors.array() : [];

    if (!image) {
      errArray.push({ msg: "Image upload failed", param: "image" });
    }

    if (errArray.length > 0) {
      return redirectWithNotification(
        req,
        res,
        "/view/add-product",
        "error",
        "Validation failed",
        errArray,
        { name, price, description, inventory }
      );
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      inventory: Number(inventory),
      image: image.filename,
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

export const productDeleteController = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) throw new Error("Product not found");

    await fs.unlink(path.join(imagesDir, product.image), (err) => {
      if (err) throw new Error("Failed to delete image");
      return;
    });

    return res.redirect("/view/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
};

export const productDeleteAsyncController = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) throw new Error("Product not found");

    await fs.unlink(path.join(imagesDir, product.image), (err) => {
      if (err) throw new Error("Failed to delete image");
      return;
    });

    return res
      .status(200)
      .json({ message: "Product deleted successfully", productId });
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "Failed to delete product", productId });
  }
};

export const downloadProductImageController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found");

    const stream = fs.createReadStream(
      path.join(imagesDir + "/" + product.image)
    );

    const ext = path.extname(product.image).toLowerCase();
    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    };

    // Redirect back to where we came from
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${product.image}"`
    );

    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");

    return stream.pipe(res);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
};

export const downloadProductPdfController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="product-${productId}.pdf"`
    );

    const PdfDoc = new PDFKit();
    PdfDoc.pipe(fs.createWriteStream("product.pdf"));
    PdfDoc.pipe(res);

    PdfDoc.fontSize(20).text(product.name, { underline: true });
    PdfDoc.moveDown();
    PdfDoc.fontSize(14).text(`Price: $${product.price.toFixed(2)}`);
    PdfDoc.moveDown();
    PdfDoc.text(`Description: ${product.description}`);
    PdfDoc.moveDown();
    PdfDoc.text(`Inventory: ${product.inventory}`);

    PdfDoc.end();
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
};
