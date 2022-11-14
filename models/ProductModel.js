import db from "../config/Database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const Product = db.define(
  "products",
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Product;

(async () => {
  await db.sync();
})();
