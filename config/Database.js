import { Sequelize } from "sequelize";

const db = new Sequelize("fullstack_image", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
