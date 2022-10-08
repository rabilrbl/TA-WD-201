const Sequelize = require("sequelize");

const dotenv = require("dotenv");
dotenv.config();

const database = process.env.POSTGRES_DB;
const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const sequelize = new Sequelize(database, username, password, {
  host: "db",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });