import { Sequelize } from "sequelize";

export const getSequelizeModels = (sequelize) => {
  const SeqProduct = sequelize.define("seq_products", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    inventory: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  const SeqUser = sequelize.define("seq_users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  const SeqCartItems = sequelize.define("seq_cart_items", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  const SeqOrders = sequelize.define("seq_orders", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
  });

  const SeqOrderItems = sequelize.define("seq_order_items", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  // Cart Item Associations
  SeqCartItems.belongsTo(SeqUser, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SeqUser.hasMany(SeqCartItems);

  SeqCartItems.belongsTo(SeqProduct, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SeqProduct.hasMany(SeqCartItems);

  // Order Associations
  SeqOrders.belongsTo(SeqUser, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SeqUser.hasMany(SeqOrders);

  // Order Item Associations
  SeqOrderItems.belongsTo(SeqOrders, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SeqOrders.hasMany(SeqOrderItems);

  SeqOrderItems.belongsTo(SeqProduct, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SeqProduct.hasMany(SeqOrderItems);

  SeqOrderItems.belongsTo(SeqUser, { through: SeqOrders });

  return { SeqProduct, SeqCartItems, SeqUser, SeqOrders, SeqOrderItems };
};
