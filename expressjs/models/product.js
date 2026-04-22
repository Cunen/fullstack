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
    fs.writeFileSync("data/products.json", JSON.stringify(allProducts, null, 2));
  }

  static getAll() {
    const data = fs.readFileSync("data/products.json", "utf-8");
    return JSON.parse(data);
  }

  static getById(id) {
    const products = Product.getAll();
    return products.find((product) => product.id === id) ?? null;
  }
}
