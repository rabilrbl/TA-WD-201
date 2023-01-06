const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const { Users, Todo } = require("./models");
const passport = require("passport"); // authentication
const connectEnsureLogin = require("connect-ensure-login"); //authorization
const session = require("express-session"); // session middleware for cookie support
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const process = require("process");

const saltRounds = 10;

const flash = require("connect-flash");

app.use(cookieParser("secret"));

app.use(cors());
app.set("view engine", "ejs");
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.use(csurf({ cookie: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hour
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      try {
        Users.findOne({ where: { email: username } })
          .then(async function (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid credentials" });
            }
          })
          .catch(() => {
            return done(null, false, { message: "Invalid credentials" });
          });
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.use(flash());

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.serializeUser(function (user, done) {
  console.log("Serializing user in session: ", user.id);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Users.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  // Check if user is logged in
  if (request.user && request.accepts("html")) {
    return response.redirect("/todos");
  }
  return request.accepts("html")
    ? response.render("index", { csrfToken: request.csrfToken() })
    : response.json({
        message: "Welcome to the Todo API",
      });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const loggedInUserId = request.user.id;
    const overdueTodos = await Todo.overdue(loggedInUserId);
    const dueTodayTodos = await Todo.dueToday(loggedInUserId);
    const dueLaterTodos = await Todo.dueLater(loggedInUserId);
    const completedTodos = await Todo.completedTodos(loggedInUserId);
    request.accepts("html")
      ? response.render("todos", {
          overdueTodos,
          dueTodayTodos,
          dueLaterTodos,
          completedTodos,
          user: request.user,
          csrfToken: request.csrfToken(),
        })
      : response.json({
          overdueTodos,
          dueTodayTodos,
          dueLaterTodos,
          completedTodos,
        });
  }
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const title = request.body.title.trim();
    const dueDate = request.body.dueDate;
    const completed = false;
    const userId = request.user.id;
    try {
      const todo = await Todo.addTodo({
        title,
        dueDate,
        completed,
        userId,
      })
        .then(() => {
          request.accepts("html")
            ? request.flash("success", "Todo added successfully") &&
              response.redirect("/todos")
            : response.json(todo);
        })
        .catch((error) => {
          request.accepts("html")
            ? request.flash("error", error.message) &&
              response.redirect("/todos")
            : response.status(400).json({ error: error.message });
        });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  }
);

app.get(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      const completeStatus = request.body.completed;
      const updatedTodo = await todo.setCompletionStatus(
        completeStatus,
        request.user.id
      );
      response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      await Todo.remove(todo.id, request.user.id);
      response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get(
  "/signup",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/todos" }),
  (request, response) => {
    response.render("signup", { csrfToken: request.csrfToken() });
  }
);

app.post(
  "/users",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/todos" }),
  async function (request, response) {
    const firstName = request.body.firstName.trim();
    const lastName = request.body.lastName.trim();
    const email = request.body.email.trim();
    const password = await bcrypt.hash(request.body.password, saltRounds);
    const notUniqueEmail = await Users.isEmailExist(email);
    if (notUniqueEmail) {
      return request.accepts("html")
        ? request.flash(
            "error",
            "You already have an account associated with this email"
          ) && response.redirect("/signup")
        : response.status(422).json({
            error: "You already have an account associated with this email",
          });
    }
    await Users.create({
      firstName,
      lastName,
      email,
      password,
    })
      .then((user) => {
        // Initialize session after successful signup
        request.login(user, function (err) {
          if (err) {
            return response.status(500).json({ error: err.message });
          }
          return request.accepts("html")
            ? response.redirect("/todos") &&
                request.flash("success", "User created successfully")
            : response.json({
                id: user.id,
                message: "User created successfully",
              });
        });
      })
      .catch((error) => {
        console.log(error);
        return request.accepts("html")
          ? request.flash("error", error.message) &&
              response.redirect("/signup")
          : response.status(422).json({ error: error.message });
      });
  }
);

app.get(
  "/login",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/todos" }),
  (request, response) => {
    response.render("login", { csrfToken: request.csrfToken() }); // it refers to login.ejs in views folder
  }
);

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);

app.get(
  "/signout",
  connectEnsureLogin.ensureLoggedIn(),
  function (request, response, next) {
    request.logout(function (err) {
      if (err) {
        return next(err);
      }
      request.flash("success", "You have been logged out");
      response.redirect("/login");
    });
  }
);

module.exports = app;
