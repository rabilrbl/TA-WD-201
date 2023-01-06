/* eslint-disable no-undef */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
const { Todo } = require("../models/");

let server, agent, _csrf;

const fetchCSRFToken = async (agent, email = "test@user.in") => {
  // Get csrf token from home page
  let response = await agent.get("/signup").set("Accept", "text/html");
  const csrfToken = response.text.match(/name="_csrf" value="(.*)"/)[1];
  response = await agent
    .post("/users")
    .send({
      firstName: "Test",
      lastName: "User",
      email,
      password: "Test@1234535345",
      _csrf: csrfToken,
    })
    .set("Accept", "application/json");
  expect(response.statusCode).toEqual(200);
  return {
    csrfToken,
    userId: JSON.parse(response.text).id,
  };
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server, { keepAlive: true });

    const init = await fetchCSRFToken(agent);
    _csrf = init.csrfToken;
    userId = init.userId;

    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    [
      {
        title: "First Todo",
        completed: false,
        dueDate: new Date(today.getTime() - 2 * oneDay).toLocaleDateString(
          "en-CA"
        ),
        userId,
      },
      {
        title: "Second Todo",
        completed: false,
        dueDate: new Date().toLocaleDateString("en-CA"),
        userId,
      },
      {
        title: "Third Todo",
        completed: false,
        dueDate: new Date(today.getTime() + 2 * oneDay).toLocaleDateString(
          "en-CA"
        ),
        userId,
      },
    ].forEach(async (todo) => {
      await Todo.addTodo(todo);
    });
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
    expect(jsonRes.overdueTodos.length).toEqual(1);
    expect(jsonRes.dueTodayTodos.length).toEqual(2);
    expect(jsonRes.dueLaterTodos.length).toEqual(1);
    expect(jsonRes.completedTodos.length).toEqual(0);
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

  it("should not create a todo with empty title", async () => {
    const res = await agent
      .post("/todos")
      .send({
        title: "",
        dueDate: new Date(),
        completed: false,
        userId,
        _csrf,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(400);
  });

  it("should not create a todo with empty dueDate", async () => {
    const res = await agent
      .post("/todos")
      .send({
        title: "Test Todo",
        dueDate: "",
        completed: false,
        userId,
        _csrf,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(400);
  });

  it("should not create a todo with empty userId", async () => {
    const res = await agent
      .post("/todos")
      .send({
        title: "Test Todo",
        dueDate: new Date(),
        completed: false,
        userId: "",
        _csrf,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(400);
  });

  // Add tests to verify userA cannot update or delete userB's todo
  it("should not update todo of another user", async () => {
    const agent2 = request.agent(server);
    const init2 = await fetchCSRFToken(agent2, "user2@test.in");

    const _csrf2 = init2._csrf;

    let res2 = await agent2.put("/todos/1").send({
      completed: true,
      _csrf: _csrf2,
    });

    expect(res2.statusCode).toEqual(403);

    res2 = await agent2.delete("/todos/1").send({
      _csrf: _csrf2,
    });

    expect(res2.statusCode).toEqual(403);
  });

  it("test for sessions", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  it("should not create user with empty firstName", async () => {
    const res = await agent
      .post("/users")
      .send({
        firstName: "",
        lastName: "User",
        email: "example@ex.in",
        password: "dsfsf",
        _csrf,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(422);
  });

  it("should not create user with empty email", async () => {
    const res = await agent
      .post("/users")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "",
        password: "dsfsf",
        _csrf,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(422);
  });
});
