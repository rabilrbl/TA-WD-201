const todoList = require('../todo');

const { add, markAsComplete, all } = todoList();

describe('Todo List test suite', () => {
  test("Add new todo", () => {
    const todoCount = all.length;
    add({
      title: "My new todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-IN")
    });
    expect(all.length).toBe(todoCount + 1);
  });

  test("Make todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  })
});