import { Sequelize } from "sequelize";
import {
  mysqlDb,
  SeqCartItems,
  SeqProduct,
  sequelize,
} from "../../utilities/database.js";

/** Product / Cart handler implementation with Sequelize */
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
      await SeqProduct.create({
        id: this.id,
        name: this.name,
        price: this.price,
        description: this.description,
        inventory: this.inventory,
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async update(id, name, price, description, inventory) {
    try {
      await SeqProduct.update(
        { name, price, description, inventory },
        { where: { id } }
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async delete(id) {
    try {
      await SeqProduct.destroy({ where: { id } });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async getAll() {
    try {
      const products = await SeqProduct.findAll();
      return products;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getById(id) {
    try {
      const product = await SeqProduct.findOne({ where: { id } });
      return product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Shopping Cart
  static async addToCart(productId, seqUserId, count = 1) {
    try {
      // Sequelize version
      await SeqCartItems.create({ productId, seqUserId, count });
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
      await SeqCartItems.update({ count }, { where: { id } });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async removeFromCart(id) {
    try {
      await SeqCartItems.destroy({ where: { id } });
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
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async getCart(seqUserId) {
    try {
      const cart = await SeqCartItems.findAll({ where: { seqUserId } });
      return cart;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getCartProducts(seqUserId) {
    const products = await Product.getAll();
    const cart = await Product.getCart(seqUserId);
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
  static async checkoutCartItems(cartProducts, seqUserId) {
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
      return Product.clearCart(seqUserId);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
