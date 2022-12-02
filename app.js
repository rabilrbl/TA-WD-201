const express = require("express");
const app = express();
const { Todo } = require("./models/");
// const bodyParser = require("body-parser");
const path = require("path");
// app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  const todos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", {
      todos,
    });
  } else {
    response.json(todos);
  }
});

app.post("/todos", async (request, response) => {
  console.log(request.body);
  const todo = await Todo.addTodo({
    title: request.body.title.trim(),
    dueDate: request.body.dueDate,
    completed: false,
  });
  if (request.accepts("html")) {
    response.redirect("/");
  } else {
    response.json(todo);
  }
});

// app.get("/todos/:id", async function (request, response) {
//   try {
//     const todo = await Todo.findByPk(request.params.id);
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

app.post("/todos/:id/complete", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    request.accepts("html")
      ? response.redirect("/")
      : response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos/:id/delete", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    await todo.destroy();
    if (request.accepts("html")) {
      response.redirect("/");
    } else {
      response.json(todo);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
