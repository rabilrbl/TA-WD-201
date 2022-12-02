const { Todo } = require("../models");

module.exports = {
  seedTodo: async () => {
    await Todo.create({
      title: "Learn Express",
      dueDate: "2020-10-10",
      completed: true,
    });
  },
};
