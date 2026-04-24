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

  const SeqCart = sequelize.define("seq_cart", {
    productId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      references: {
        model: SeqProduct,
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return { SeqProduct, SeqCart };
};
