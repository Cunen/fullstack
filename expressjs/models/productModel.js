import pool from "../utilities/database.js";

export class Product {
  constructor(name, price, description, inventory) {
    this.id = Date.now().toString();
    this.name = name;
    this.price = price;
    this.description = description;
    this.inventory = inventory;
  }

  async save() {
    return pool
      .execute(
        "INSERT INTO products (id, name, price, description, inventory) VALUES (?, ?, ?, ?, ?)",
        [this.id, this.name, this.price, this.description, this.inventory]
      )
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  static async update(id, name, price, description, inventory) {
    return pool
      .execute(
        "UPDATE products SET name = ?, price = ?, description = ?, inventory = ? WHERE id = ?",
        [name, price, description, inventory, id]
      )
      .then(() => true)
      .catch(() => false);
  }

  static async delete(id) {
    return pool
      .execute("DELETE FROM products WHERE id = ?", [id])
      .then(() => true)
      .catch(() => false);
  }

  static async getAll() {
    return pool
      .execute("SELECT * FROM products")
      .then(([result]) => result)
      .catch(() => []);
  }

  static async getById(id) {
    return pool
      .execute("SELECT * FROM products WHERE id = ?", [id])
      .then(([[result]]) => result)
      .catch(() => []);
  }

  // Shopping Cart
  static async addToCart(productId, count = 1) {
    return pool
      .execute("INSERT INTO cart (productId, count) VALUES (?, ?)", [
        Number(productId),
        Number(count),
      ])
      .then(() => true)
      .catch(() => false);
  }

  static async editCartCount(productId, count) {
    if (count <= 0) {
      return Product.removeFromCart(productId);
    }

    return pool
      .execute("UPDATE cart SET count = ? WHERE productId = ?", [
        Number(count),
        Number(productId),
      ])
      .then(() => true)
      .catch(() => false);
  }

  static async removeFromCart(productId) {
    return pool
      .execute("DELETE FROM cart WHERE productId = ?", [Number(productId)])
      .then(() => true)
      .catch(() => false);
  }

  static async clearCart() {
    return pool
      .execute("DELETE FROM cart")
      .then(() => true)
      .catch(() => false);
  }

  static async getCart() {
    return pool
      .execute("SELECT * FROM cart")
      .then(([result]) => result)
      .catch(() => []);
  }

  static async getCartProducts() {
    return Product.getAll().then((products) => {
      return Product.getCart().then((cart) => {
        return cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return { ...product, count: item.count };
        });
      });
    });
  }

  // Checkout
  static async checkoutCartItems(cartProducts) {
    const updates = cartProducts.map((item) => {
      return pool.execute(
        "UPDATE products SET inventory = inventory - ? WHERE id = ?",
        [item.count, item.productId]
      );
    });

    return Promise.all(updates).then(() => {
      return pool
        .execute("DELETE FROM products WHERE inventory <= 0")
        .then(() => {
          return Product.clearCart();
        })
        .catch((e) => {
          console.error(e);
          return false;
        });
    });
  }
}
