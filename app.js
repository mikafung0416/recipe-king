require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");

const cuisineList = require("./queryList/cuisineList");
const dietList = require("./queryList/dietList");
const typeList = require("./queryList/typeList");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/cuisine", (req, res) => {
  res.render("selectCuisine");
});

app.get("/diet", (req, res) => {
  res.render("selectDiet");
});

app.get("/type", (req, res) => {
  res.render("selectType");
});

//get api: https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&apiKey=4d571645da1d408a9d5b832c5bec6874&diet=vegetarian

//when user select cuisine, it will direct to listing all recipe pages
app.post("/cuisine", async (req, res) => {
  const country = req.body.cuisineName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&cuisine=${country}&number=50`;
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
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&diet=${diet}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  const recipes = result.results;
  const numOfRecipes = result.number;
  console.log(recipes);

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Diet",
    specificType: diet,
    numberOfRecipes: numOfRecipes,
    queryList: dietList,
  });
});

app.post("/type", async (req, res) => {
  const type = req.body.typeName;
  console.log(type);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&type=${type}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  const recipes = result.results;
  const numOfRecipes = result.number;
  console.log(recipes);

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Type",
    specificType: type,
    numberOfRecipes: numOfRecipes,
    queryList: typeList,
  });
});

app.post("/diet/:dietName", async (req, res) => {
  const dietName = req.params.dietName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&diet=${dietName}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  const recipes = result.results;
  const numOfRecipes = result.number;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Diet",
    specificType: dietName,
    numberOfRecipes: numOfRecipes,
    queryList: dietList,
  });
});

app.post("/cuisine/:cuisineName", async (req, res) => {
  const cuisineName = req.params.cuisineName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&cuisine=${cuisineName}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  const recipes = result.results;
  const numOfRecipes = result.number;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Cuisine",
    specificType: cuisineName,
    numberOfRecipes: numOfRecipes,
    queryList: cuisineList,
    apiKey: process.env.API_KEY
  });
});

app.post("/type/:typeName", async (req, res) => {
  const typeName = req.params.typeName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&type=${typeName}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  const recipes = result.results;
  const numOfRecipes = result.number;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Type",
    specificType: typeName,
    numberOfRecipes: numOfRecipes,
    queryList: typeList,
    apiKey: process.env.API_KEY
  });
});

app.listen(4000, () => {
  console.log("listening to 4000");
});
