/* eslint-disable no-undef */
const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });

  test("Should get all todos", async () => {
    const todos = await db.Todo.findAll();
    expect(todos.length).toBeGreaterThan(0);
  });

  test("Should mark todo as complete", async () => {
    // Fetch last todo
    const todo = await db.Todo.findOne({
      order: [["id", "DESC"]],
    });
    // Mark todo as complete
    await db.Todo.markAsComplete(todo.id);
    // Expect todo to be marked as complete
    const updatedTodo = await db.Todo.findOne({
      where: {
        id: todo.id,
      },
    });
    expect(updatedTodo.completed).toBe(true);
  });

  test("Should get overdue todos", async () => {
    const todoItemsCount = await db.Todo.count();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    // Add a new todo with due date in the past
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: yesterday,
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
    const overdueTodos = await db.Todo.overdue();
    expect(overdueTodos.length).toBe(1);
  });

  test("Should get due today todos", async () => {
    const todoItemsCount = await db.Todo.count();
    // Add a new todo with due date as today
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
    const dueTodayTodos = await db.Todo.dueToday();
    expect(dueTodayTodos.length).toBe(2);
  });

  test("Should get due later todos", async () => {
    const todoItemsCount = await db.Todo.count();
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    // Add a new todo with due date in the future
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: tomorrow,
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
    const dueLaterTodos = await db.Todo.dueLater();
    expect(dueLaterTodos.length).toBe(1);
  });
});
