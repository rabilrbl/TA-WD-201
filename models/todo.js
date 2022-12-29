"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.Users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }

    static getTodos() {
      return this.findAll({
        order: [["dueDate", "ASC"]],
      });
    }

    static async addTodo({ title, dueDate, completed, userId }) {
      return await this.create({
        title: title,
        dueDate: dueDate,
        completed: completed,
        userId: userId,
      });
    }

    static async overdue(userId) {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          completed: false,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday(userId) {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
          completed: false,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueLater(userId) {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          completed: false,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async remove(id, userId) {
      return await this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    static async completedTodos(userId) {
      return await this.findAll({
        where: {
          completed: true,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    setCompletionStatus(completeStatus, userId) {
      return this.update(
        {
          completed: completeStatus,
        },
        {
          where: {
            userId,
          },
        }
      );
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      dueDate: DataTypes.DATEONLY,
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
