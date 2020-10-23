require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");

const cuisineList = require("./queryList/cuisineList");
const dietList = require("./queryList/dietList");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/cuisine", (req, res) => {
  res.render("selectCuisine");
});

app.get("/diet", (req, res) => {
  res.render("selectDiet");
});

//get api: https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&apiKey=4d571645da1d408a9d5b832c5bec6874&diet=vegetarian

//when user select cuisine, it will direct to listing all recipe pages
app.post("/cuisine", async (req, res) => {
  const country = req.body.cuisineName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&cuisine=${country}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  const recipes = result.results;
  const numOfRecipes = result.number;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Cuisine",
    specificType: country,
    numberOfRecipes: numOfRecipes,
    queryList: cuisineList,
  });
});

app.post("/diet", async (req, res) => {
  const diet = req.body.dietName;
  console.log(diet);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&diet=${diet}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  const recipes = result.results;
  const numOfRecipes = result.number;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Diet",
    specificType: diet,
    numberOfRecipes: numOfRecipes,
    queryList: dietList,
  });
});

app.listen(4000, () => {
  console.log("listening to 4000");
});
