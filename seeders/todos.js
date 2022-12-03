const { Todo } = require("../models");

const TODOS = [
  {
    title: "Buy milk",
    dueDate: new Date("2020-01-01"),
    completed: false,
  },
  {
    title: "Buy eggs",
    dueDate: new Date(),
    completed: false,
  },
  {
    title: "Buy bread",
    // TOmorrow
    dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    completed: false,
  },
];

module.exports = {
  seedTodo: async () => {
    await Todo.bulkCreate(TODOS);
  },
};
