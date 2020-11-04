const knex = require("knex")({
  client: "pg",
  connection: {
    user: "postgres",
    password: "password",
    host: "localhost",
    database: "food_website",
  },
});

module.exports = knex;
