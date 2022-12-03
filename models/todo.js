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
    }

    static getTodos() {
      return this.findAll({
        order: [["dueDate", "ASC"]],
      });
    }

    static async addTodo({ title, dueDate, completed }) {
      return await this.create({
        title: title,
        dueDate: dueDate,
        completed: completed,
      });
    }

    static async overdue() {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueLater() {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async completedTodos() {
      return await this.findAll({
        where: {
          completed: true,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    setCompletionStatus(completeStatus) {
      return this.update({
        completed: completeStatus,
      });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
