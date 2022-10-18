// eslint-disable-next-line no-undef
const argv = require("minimist")(process.argv.slice(2));
const db = require("./models/index");

const deleteTodo = async (id) => {
  try {
    await db.Todo.deleteTask(id);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  const { id } = argv;
  if (!id) {
    throw new Error(
      "id is required. \nSample command: node deleteTodo.js --id=2 "
    );
  }
  if (!Number.isInteger(id)) {
    throw new Error("The id needs to be an integer");
  }
  await deleteTodo(id);
  await db.Todo.showList();
})();
