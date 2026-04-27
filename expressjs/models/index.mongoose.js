import User from "./user.mongoose.js";
import Product from "./product.mongoose.js";
import Cart from "./cart.mongoose.js";
import Order from "./order.mongoose.js";

export const loadModels = () => {
  return {
    User,
    Product,
    Cart,
    Order,
  };
};
