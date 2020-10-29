const express = require("express");
const fetch = require("node-fetch");
const dietList = require("../../queryList/dietList");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("selectDiet");
});

router.post("/", async (req, res) => {
  const diet = req.body.dietName;
  console.log(diet);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&diet=${diet}&number=50`;
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

router.post("/:dietName", async (req, res) => {
  const dietName = req.params.dietName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&diet=${dietName}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log("It is in diet/:dietName route");
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

module.exports = router;
