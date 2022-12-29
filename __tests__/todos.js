/* eslint-disable no-undef */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
const { Todo } = require("../models/");

let server, agent, _csrf;

const fetchCSRFToken = async () => {
  // Get csrf token from home page
  let response = await agent.get("/signup").set("Accept", "text/html");
  const csrfToken = response.text.match(/name="_csrf" value="(.*)"/)[1];
  response = await agent.post("/users").send({
    firstName: "Test",
    lastName: "User",
    email: "test@user.in",
    password: "Test@1234535345",
    _csrf: csrfToken,
  });
  expect(response.statusCode).toEqual(302);
  // Scrap csrf token from meta tag
  return csrfToken;
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server, { keepAlive: true });

    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    [
      {
        title: "First Todo",
        completed: false,
        dueDate: new Date(today.getTime() - 2 * oneDay).toLocaleDateString(
          "en-CA"
        ),
      },
      {
        title: "Second Todo",
        completed: false,
        dueDate: new Date().toLocaleDateString("en-CA"),
      },
      {
        title: "Third Todo",
        completed: false,
        dueDate: new Date(today.getTime() + 2 * oneDay).toLocaleDateString(
          "en-CA"
        ),
      },
    ].forEach(async (todo) => {
      await Todo.addTodo(todo);
    });
    _csrf = await fetchCSRFToken();
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("should create a new todo", async () => {
    const res = await agent.post("/todos").send({
      title: "Test Todo",
      dueDate: new Date(),
      _csrf,
    });
    expect(res.statusCode).toEqual(302);
  });

  it("should get all todos", async () => {
    const res = await agent.get("/todos").set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    // get json response from res
    const jsonRes = JSON.parse(res.text);
    const overdueTodos = jsonRes.overdueTodos;
    const dueTodayTodos = jsonRes.dueTodayTodos;
    const dueLaterTodos = jsonRes.dueLaterTodos;
    const completedTodos = jsonRes.completedTodos;
    expect(overdueTodos.length).toEqual(1);
    expect(dueTodayTodos.length).toEqual(2);
    expect(dueLaterTodos.length).toEqual(1);
    expect(completedTodos.length).toEqual(0);
  });

  it("should mark a todo as completed", async () => {
    const res = await agent.put("/todos/1").send({
      completed: true,
      _csrf,
    });
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).completed).toEqual(true);
  });

  it("should mark a todo as uncomplete", async () => {
    const res = await agent.put("/todos/1").send({
      completed: false,
      _csrf,
    });
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).completed).toEqual(false);
  });

  it("should delete a todo", async () => {
    const res = await agent.delete("/todos/1").send({
      _csrf,
    });
    expect(res.statusCode).toEqual(200);
  });
});
