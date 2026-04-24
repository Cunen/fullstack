import { Sequelize } from "sequelize";
import {
  mysqlDb,
  SeqCartItems,
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
  static async addToCart(seqProductId, seqUserId, count = 1) {
    try {
      // Sequelize version
      await SeqCartItems.create({ seqProductId, seqUserId, count });

      // MySQL version
      await mysqlDb.execute(
        "INSERT INTO cart (seqProductId, count) VALUES (?, ?)",
        [Number(seqProductId), Number(count)]
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async editCartCount(id, count) {
    if (count <= 0) {
      return Product.removeFromCart(id);
    }

    try {
      // Sequelize version
      await SeqCartItems.update({ count }, { where: { id } });

      // MySQL version
      await mysqlDb.execute(
        "UPDATE cart SET count = ? WHERE seqProductId = ?",
        [Number(count), Number(id)]
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async removeFromCart(id) {
    try {
      // Sequelize version
      await SeqCartItems.destroy({ where: { id } });

      // MySQL version
      await mysqlDb.execute("DELETE FROM cart WHERE seqProductId = ?", [
        Number(id),
      ]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async clearCart(seqUserId) {
    try {
      // Sequelize version
      await SeqCartItems.destroy({ where: { seqUserId }, truncate: true });

      // MySQL version
      await mysqlDb.execute("DELETE FROM cart WHERE seqProductId >= 0");

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async getCart(seqUserId) {
    try {
      // Sequelize version
      const seq_cart = await SeqCartItems.findAll({ where: { seqUserId } });

      // MySQL version:
      const [mysql_cart] = await mysqlDb.execute("SELECT * FROM cart");

      return dataSource === "sequelize" ? seq_cart : mysql_cart;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getCartProducts(seqUserId) {
    const products = await Product.getAll();
    const cart = await Product.getCart(seqUserId);
    return cart.map((item) => {
      const product = products.find((p) => p.id === item.seqProductId);
      // NOTE: Spread operator doesn't work with Sequelize instances
      return {
        id: item.id,
        count: item.count,
        seqUserId: item.seqUserId,
        seqProductId: item.id,
        name: product.name,
        price: product.price,
        inventory: product.inventory,
      };
    });
  }

  // Checkout
  static async checkoutCartItems(cartProducts, seqUserId) {
    // Then clear those with 0 or less inventory, and clear the cart
    try {
      // First register updates for the products
      const updates = cartProducts.flatMap((item) => {
        // MySQL version
        const sql = mysqlDb.execute(
          "UPDATE products SET inventory = inventory - ? WHERE id = ?",
          [item.count, item.seqProductId]
        );

        // Sequelize version
        const sequalize = SeqProduct.update(
          { inventory: sequelize.literal(`inventory - ${item.count}`) },
          { where: { id: item.seqProductId } }
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
      return Product.clearCart(seqUserId);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
