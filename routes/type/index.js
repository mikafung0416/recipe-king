const express = require("express");
const fetch = require("node-fetch");
const typeList = require("../../queryList/typeList");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("selectType");
});

router.post("/", async (req, res) => {
  const type = req.body.typeName;
  console.log(type);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&type=${type}&number=50`;
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

router.post("/:typeName", async (req, res) => {
  const typeName = req.params.typeName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&type=${typeName}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log("It is in type/typeName route");
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
  });
});

//Range bar for numbre of recipes of type
router.post("/:typeName/number", async (req, res) => {
  const typeName = req.params.typeName;
  const numOfRecipes = req.body.numberOfRecipes;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&type=${typeName}&number=${numOfRecipes}`;
  const response = await fetch(url);
  const result = await response.json();
  console.log("It is in type/:typeName/number route");
  console.log(result);
  const recipes = result.results;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Type",
    specificType: typeName,
    numberOfRecipes: numOfRecipes,
    queryList: typeList,
  });
});

module.exports = router;
