import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "assignment5_sequelize",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);
