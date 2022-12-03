const express = require("express");
const app = express();
const { Todo } = require("./models/");
const path = require("path");
const cors = require("cors");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secret"));

app.use(cors());
app.set("view engine", "ejs");
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.use(csurf({ cookie: true }));

app.get("/", async (request, response) => {
  const overdueTodos = await Todo.overdue();
  const dueTodayTodos = await Todo.dueToday();
  const dueLaterTodos = await Todo.dueLater();
  const completedTodos = await Todo.completedTodos();
  request.accepts("html")
    ? response.render("index", {
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
        csrfToken: request.csrfToken(),
      })
    : response.json({
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
      });
});

app.post("/todos", async (request, response) => {
  console.log(request.body);
  const todo = await Todo.addTodo({
    title: request.body.title.trim(),
    dueDate: request.body.dueDate,
    completed: false,
  });
  request.accepts("html") ? response.redirect("/") : response.json(todo);
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const completeStatus = request.body.completed;
    const updatedTodo = await todo.setCompletionStatus(completeStatus);
    response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    await todo.destroy();
    response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
