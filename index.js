const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Second Item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with ID : ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countItems = async () => {
    try {
      const totalCount = await Todo.count();
      console.log(`Found ${totalCount} items in the table!`);
    } catch (error) {
      console.error(error);
    }
  };

(async () => {
  await countItems();
})();
