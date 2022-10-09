const todoList = () => {
  let all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const d = new Date().toISOString().split("T")[0];
    return all.filter((item) => item.dueDate < d);
  };

  const dueToday = () => {
    const d = new Date().toISOString().split("T")[0];
    return all.filter((item) => item.dueDate === d);
  };

  const dueLater = () => {
    const d = new Date().toISOString().split("T")[0];
    return all.filter((item) => item.dueDate > d);
  };

  const toDisplayableList = (list) => {
    const d = new Date().toISOString().split("T")[0];
    return `${list
      .map(
        (item) =>
          (item.completed ? `[x] ${item.title}` : `[ ] ${item.title}`) +
          `${item.dueDate !== d ? ` ${item.dueDate}` : ""}`
      )
      .join("\n")}`;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
