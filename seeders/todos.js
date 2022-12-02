const { Todo } = require("../models");

module.exports = {
  seedTodo: async () => {
    const todo = await Todo.create({
      title: "Learn Sequelize",
      dueDate: "2020-10-10",
      completed: false,
    });
    console.log("Todo seeded: ", todo.title);
  },
};
