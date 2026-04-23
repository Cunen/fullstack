import fs from "fs";

export class Product {
  constructor(name, price, description, inventory) {
    this.id = Date.now().toString();
    this.name = name;
    this.price = price;
    this.description = description;
    this.inventory = inventory;
  }

  save() {
    const products = Product.getAll();
    products.push(this);
    fs.writeFileSync("data/products.json", JSON.stringify(products, null, 2));
  }

  static update(id, name, price, description, inventory) {
    const allProducts = Product.getAll().filter((product) => product.id !== id);
    allProducts.push(new Product(name, price, description, inventory));
    fs.writeFileSync(
      "data/products.json",
      JSON.stringify(allProducts, null, 2)
    );
  }

  static delete(id) {
    const allProducts = Product.getAll().filter((product) => product.id !== id);
    console.log(allProducts);
    fs.writeFileSync(
      "data/products.json",
      JSON.stringify(allProducts, null, 2)
    );
  }

  static getAll() {
    const data = fs.readFileSync("data/products.json", "utf-8");
    return JSON.parse(data);
  }

  static getById(id) {
    const products = Product.getAll();
    return products.find((product) => product.id === id) ?? null;
  }

  // Shopping Cart
  static addToCart(productId, count = 1) {
    const cart = Product.getCart();
    cart.push({ productId, count });
    fs.writeFileSync("data/cart.json", JSON.stringify(cart, null, 2));
  }

  static editCartCount(productId, count) {
    const cart = Product.getCart();

    if (count <= 0) {
      Product.removeFromCart(productId);
      return;
    }

    const item = cart.find((item) => item.productId === productId);
    if (item) {
      item.count = count;
      fs.writeFileSync("data/cart.json", JSON.stringify(cart, null, 2));
    }
  }

  static removeFromCart(productId) {
    const cart = Product.getCart().filter(
      (item) => item.productId !== productId
    );
    fs.writeFileSync("data/cart.json", JSON.stringify(cart, null, 2));
  }

  static getCart() {
    const data = fs.readFileSync("data/cart.json", "utf-8");
    return JSON.parse(data);
  }

  static getCartProducts() {
    const products = Product.getAll();
    const cart = Product.getCart();

    return cart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...product,
        count: item.count,
      };
    });
  }
}
