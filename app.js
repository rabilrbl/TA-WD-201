const express = require("express");
const app = express();
// const { Todo } = require("./models");
// const bodyParser = require("body-parser");
const path = require("path");
// app.use(bodyParser.json());
app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.render("index"); // index refers to index.ejs
});

// app.get("/", function (request, response) {
//   response.send("Hello World");
// });

// app.get("/todos", async function (_request, response) {
//   console.log("Processing list of all Todos ...");
//   const todos = await Todo.findAll();
//   response.send(todos);
// });

// app.get("/todos/:id", async function (request, response) {
//   try {
//     const todo = await Todo.findByPk(request.params.id);
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

// app.post("/todos", async function (request, response) {
//   try {
//     const todo = await Todo.addTodo(request.body);
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

// app.put("/todos/:id/markAsCompleted", async function (request, response) {
//   const todo = await Todo.findByPk(request.params.id);
//   try {
//     const updatedTodo = await todo.markAsCompleted();
//     return response.json(updatedTodo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

// app.delete("/todos/:id", async function (request, response) {
//   console.log("We have to delete a Todo with ID: ", request.params.id);
//   const todo = await Todo.findByPk(request.params.id);
//   try {
//     await todo.destroy();
//     return response.json(true);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).send(false);
//   }
// });

module.exports = app;
