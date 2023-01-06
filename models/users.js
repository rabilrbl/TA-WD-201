"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Todo, {
        foreignKey: "userId",
      });
    }

    static async isEmailExist(email) {
      const user = await this.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        return true;
      }
      return false;
    }

    async create(data) {
      // Check if email already exists
      const user = await this.findOne({
        where: {
          email: data.email,
        },
      });
      if (user) {
        throw new Error("Email already exists");
      }
      return super.create(data);
    }
  }
  Users.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notNull: true,
          notEmpty: true,
        },
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
