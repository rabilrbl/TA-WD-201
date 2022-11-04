"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdue = await Todo.overdue();
      const overdueList = overdue
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(overdueList);
      console.log("\n");

      console.log("Due Today");
      const dueToday = await Todo.dueToday();
      const dueTodayList = dueToday
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(dueTodayList);
      console.log("\n");

      console.log("Due Later");
      const dueLater = await Todo.dueLater();
      const dueLaterList = dueLater
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(dueLaterList);
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static async markAsComplete(id) {
      return await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    static async deleteTask(id) {
      return await Todo.destroy({
        where: {
          id: id,
        },
      });
    }

    static associate(models) {
      // define association here
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const dueDateText =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${dueDateText}`.trim();
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
