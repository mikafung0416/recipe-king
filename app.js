//middleware paths
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");
const path = require("path");

// for passport
const session = require('express-session');
const setupPassport = require('./passport');

//the lists for SQL to use *maybe can drop now using knex*
const cuisineList = require("./queryList/cuisineList");
const dietList = require("./queryList/dietList");
const typeList = require("./queryList/typeList");

//routes for the pages
const cuisineRoute = require("./routes/cuisine");
const dietRoute = require("./routes/diet");
const typeRoute = require("./routes/type");
const recipeRoute = require("./routes/recipe");
const filterRoute = require("./routes/filter");
const addRoute = require("./routes/addRecipe");
const signInRoute = require("./routes/signIn");
const signUpRoute = require("./routes/signUp");
const signOutRoute = require("./routes/signOut");
const errorRoute = require("./routes/errorPage");
const profileRoute = require("./routes/profile")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// for passport
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true,
}));
setupPassport(app);

//allowing for the routes to be used 
app.use("/cuisine", cuisineRoute);
app.use("/diet", dietRoute);
app.use("/type", typeRoute);
app.use("/recipes/:id", recipeRoute);
app.use("/filter", filterRoute);
app.use("/add-recipe", addRoute);
app.use("/sign-in", signInRoute);
app.use("/sign-up", signUpRoute);
app.use("/sign-out", signOutRoute);
app.use("/error", errorRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index", {
    cuisineList: cuisineList,
    dietList: dietList,
    typeList: typeList,
    cuisine: "Cuisine",
    diet: "Diet",
    type: "Type",
  });
});

// app.get("/broadsearch", (req, res) => {
//   res.render("broadSearch");
// });

//get api: https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&apiKey=4d571645da1d408a9d5b832c5bec6874&diet=vegetarian

app.listen(4000, () => {
  console.log("listening to 4000");
});
