/* eslint-disable no-undef */
const todoList = require("../todo");

const { add, markAsComplete, all, overdue, dueToday, dueLater } = todoList();

describe("Todo List test suite", () => {
  test("Add new todo", () => {
    const todoCount = all.length;
    add({
      title: "My new todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
    expect(all.length).toBe(todoCount + 1);
  });

  test("Make todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("checks retrieval of overdue items", () => {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];
    add({
      title: "Overdue todo",
      completed: false,
      dueDate: yesterday,
    });
    const overdueItems = overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].completed).toBe(false);
  });

  test("check retrieval of due today items", () => {
    const today = new Date().toISOString().split("T")[0];
    add({
      title: "Due today todo",
      completed: false,
      dueDate: today,
    });
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(2);
  });

  test("check retrieval of due later items", () => {
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .split("T")[0];
    add({
      title: "Due later todo",
      completed: false,
      dueDate: tomorrow,
    });
    const dueLaterItems = dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].completed).toBe(false);
  });
});
