import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Required by the assignment: define the Users model using sequelize.define().
export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (typeof value !== "string" || value.length <= 6) {
            throw new Error("Password must be longer than 6 characters.");
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user"
    }
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      // Required by the assignment: custom name check in beforeCreate.
      beforeCreate(user) {
        if (typeof user.name !== "string" || user.name.trim().length <= 2) {
          throw new Error("Name must be longer than 2 characters.");
        }
      }
    }
  }
);
