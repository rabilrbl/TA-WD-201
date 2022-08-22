const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    let overdue = [];

    all.forEach((item) => {
      if (item.dueDate < today) {
        overdue.push(item);
      }
    });
    return overdue;
  };

  const dueToday = () => {
    let dueToday = [];

    all.forEach((item) => {
      if (item.dueDate === today) {
        dueToday.push(item);
      }
    });
    return dueToday;
  };

  const dueLater = () => {
    let dueLater = [];

    all.forEach((item) => {
      if (item.dueDate > today) {
        dueLater.push(item);
      }
    });
    return dueLater;
  };

  const toDisplayableList = (list) => {
    const result = `${list
      .map(
        (item) =>
          (item.completed ? `[x] ${item.title}` : `[ ] ${item.title}`) +
          `${item.dueDate !== today ? ` ${item.dueDate}` : ""}`
      )
      .join("\n")}`;

    return result;
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

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

const todos = todoList();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var d = new Date();
const today = formattedDate(d);
const yesterday = formattedDate(new Date(d.setDate(d.getDate() - 1)));
const tomorrow = formattedDate(new Date(d.setDate(d.getDate() + 2)));

todos.add({ title: "Submit assignment", dueDate: yesterday, completed: false });
todos.add({ title: "Pay rent", dueDate: today, completed: true });
todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
todos.add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });

console.log("My Todo-list\n\n");

console.log("Overdue");
var overdues = todos.overdue();
var formattedOverdues = todos.toDisplayableList(overdues);
console.log(formattedOverdues);
console.log("\n\n");

console.log("Due Today");
let itemsDueToday = todos.dueToday();
let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday);
console.log(formattedItemsDueToday);
console.log("\n\n");

console.log("Due Later");
let itemsDueLater = todos.dueLater();
let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater);
console.log(formattedItemsDueLater);
console.log("\n\n");
