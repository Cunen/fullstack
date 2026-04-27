import { mysqlDb } from "../../utilities/database.js";

/** Product / Cart handler implementation with MySQL */
export class Product {
  constructor(name, price, description, inventory) {
    this.id = Date.now().toString();
    this.name = name;
    this.price = price;
    this.description = description;
    this.inventory = inventory;
  }

  async save() {
    try {
      // MySQL version
      await mysqlDb.execute(
        "INSERT INTO products (id, name, price, description, inventory) VALUES (?, ?, ?, ?, ?)",
        [this.id, this.name, this.price, this.description, this.inventory]
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async update(id, name, price, description, inventory) {
    try {
      // MySQL version
      await mysqlDb.execute(
        "UPDATE products SET name = ?, price = ?, description = ?, inventory = ? WHERE id = ?",
        [name, price, description, inventory, id]
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async delete(id) {
    try {
      // MySQL version
      await mysqlDb.execute("DELETE FROM products WHERE id = ?", [id]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async getAll() {
    try {
      // MySQL version:
      const [products] = await mysqlDb.execute("SELECT * FROM products");

      return products;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getById(id) {
    try {
      // MySQL version
      const [[product]] = await mysqlDb.execute(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );

      return product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Shopping Cart
  static async addToCart(productId, count = 1) {
    try {
      // MySQL version
      await mysqlDb.execute(
        "INSERT INTO cart (productId, count) VALUES (?, ?)",
        [Number(productId), Number(count)]
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async editCartCount(productId, count) {
    if (count <= 0) {
      return Product.removeFromCart(productId);
    }

    try {
      // MySQL version
      await mysqlDb.execute("UPDATE cart SET count = ? WHERE productId = ?", [
        Number(count),
        Number(productId),
      ]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async removeFromCart(productId) {
    try {
      // MySQL version
      await mysqlDb.execute("DELETE FROM cart WHERE productId = ?", [
        Number(productId),
      ]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async clearCart() {
    try {
      // MySQL version
      await mysqlDb.execute("DELETE FROM cart WHERE productId >= 0");

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async getCart() {
    try {
      // MySQL version:
      const [cart] = await mysqlDb.execute("SELECT * FROM cart");

      return cart;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getCartProducts() {
    const products = await Product.getAll();
    const cart = await Product.getCart();
    return cart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      // NOTE: Spread operator doesn't work with Sequelize instances
      return {
        id: item.id,
        count: item.count,
        seqUserId: item.seqUserId,
        productId: item.id,
        name: product.name,
        price: product.price,
        inventory: product.inventory,
      };
    });
  }

  // Checkout
  static async checkoutCartItems(cartProducts) {
    // Then clear those with 0 or less inventory, and clear the cart
    try {
      // First register updates for the products
      const updates = cartProducts.map((item) => {
        // MySQL version
        return mysqlDb.execute(
          "UPDATE products SET inventory = inventory - ? WHERE id = ?",
          [item.count, item.productId]
        );
      });

      await Promise.all(updates);

      // MySQL version
      await mysqlDb.execute("DELETE FROM products WHERE inventory <= 0");

      // Finally, clear the cart
      return Product.clearCart();
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
