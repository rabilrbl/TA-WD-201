/* eslint-disable no-undef */
const todoList = require("../todo");

const { add, markAsComplete, all, overdue, dueToday, dueLater } = todoList();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var d = new Date();
const today = formattedDate(d);
const yesterday = formattedDate(new Date(d.setDate(d.getDate() - 1)));
const tomorrow = formattedDate(new Date(d.setDate(d.getDate() + 2)));

describe("Todo List test suite", () => {
  test("Add new todo", () => {
    const todoCount = all.length;
    add({
      title: "My new todo",
      completed: false,
      dueDate: today,
    });
    expect(all.length).toBe(todoCount + 1);
  });

  test("Make todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("checks retrieval of overdue items", () => {
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
    add({
      title: "Due today todo",
      completed: false,
      dueDate: today,
    });
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(2);
    expect(dueTodayItems[1].completed).toBe(false);
  });

  test("check retrieval of due later items", () => {
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
