require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("selectCuisine");
});

//get api: https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&apiKey=4d571645da1d408a9d5b832c5bec6874&diet=vegetarian

//when user select cuisine, it will direct to listing all recipe pages
app.post("/cuisine", async (req, res) => {
  const country = req.body.cuisineName;
  console.log(country);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&cuisine=${country}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  const recipes = result.results;
  const numOfRecipes = result.number;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    cuisine: country,
    numberOfRecipes: numOfRecipes,
  });
});

app.get("/cuisine", async (req, res) => {
  const url = `https://api.spoonacular.com/recipes/${716426}/information?apiKey=4d571645da1d408a9d5b832c5bec6874`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  //It should be render all information in grid
  res.send(result);
});

app.listen(4000, () => {
  console.log("listening to 4000");
});
