import { Sequelize } from "sequelize";
import {
  mysqlDb,
  SeqCart,
  SeqProduct,
  sequelize,
} from "../utilities/database.js";

const dataSource = "sequelize"; // 'mysql' or 'sequelize'

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
      // Sequelize version
      await SeqProduct.create({
        id: this.id,
        name: this.name,
        price: this.price,
        description: this.description,
        inventory: this.inventory,
      });

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
      // Sequelize version
      await SeqProduct.update(
        { name, price, description, inventory },
        { where: { id } }
      );

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
      // Sequelize version
      await SeqProduct.destroy({ where: { id } });

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
      // Sequelize version
      const seq_products = await SeqProduct.findAll();

      // MySQL version:
      const [mysql_products] = await mysqlDb.execute("SELECT * FROM products");

      return dataSource === "sequelize" ? seq_products : mysql_products;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getById(id) {
    try {
      // Sequelize version
      const seq_product = await SeqProduct.findOne({ where: { id } });

      // MySQL version
      const [[mysql_product]] = await mysqlDb.execute(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );

      return dataSource === "sequelize" ? seq_product : mysql_product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Shopping Cart
  static async addToCart(productId, count = 1) {
    try {
      // Sequelize version
      await SeqCart.create({ productId, count });

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
      // Sequelize version
      await SeqCart.update({ count }, { where: { productId } });

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
      // Sequelize version
      await SeqCart.destroy({ where: { productId } });

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
      // Sequelize version
      await SeqCart.destroy({ where: {}, truncate: true });

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
      // Sequelize version
      const seq_cart = await SeqCart.findAll();

      // MySQL version:
      const [mysql_cart] = await mysqlDb.execute("SELECT * FROM cart");

      return dataSource === "sequelize" ? seq_cart : mysql_cart;
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
        id: product.id,
        name: product.name,
        price: product.price,
        inventory: product.inventory,
        count: item.count,
      };
    });
  }

  // Checkout
  static async checkoutCartItems(cartProducts) {
    // Then clear those with 0 or less inventory, and clear the cart
    try {
      // First register updates for the products
      const updates = cartProducts.flatMap((item) => {
        // MySQL version
        const sql = mysqlDb.execute(
          "UPDATE products SET inventory = inventory - ? WHERE id = ?",
          [item.count, item.productId]
        );

        // Sequelize version
        const sequalize = SeqProduct.update(
          { inventory: sequelize.literal(`inventory - ${item.count}`) },
          { where: { id: item.productId } }
        );

        return [sql, sequalize];
      });

      await Promise.all(updates);

      // MySQL version
      await mysqlDb.execute("DELETE FROM products WHERE inventory <= 0");

      // Sequelize version
      await SeqProduct.destroy({
        where: { inventory: { [Sequelize.Op.lte]: 0 } },
      });

      // Finally, clear the cart
      return Product.clearCart();
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
