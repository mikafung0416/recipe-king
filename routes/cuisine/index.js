const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("selectCuisine");
});

//when user select cuisine, it will direct to listing all recipe pages
router.post("/", async (req, res) => {
  const country = req.body.cuisineName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${country}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  //how to add the api and insert into db
  // const dataIwant = {
  //   recipeId,
  //   user_added_recipe_Id,
  //   user_id,
  //   recipe_name,
  //   recipe_instruction,
  //   recipe_image,
  //   cuisines,
  //   diets,
  //   types,
  // };
  let myData = [];

  // console.log(result);
  const recipes = result.results;
  const numOfRecipes = result.number;
  // console.log(recipes);
  myData = [...recipes];
  console.log(myData);

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Cuisine",
    specificType: country,
    numberOfRecipes: numOfRecipes,
    queryList: cuisineList,
    otherBroadType1: "Diet",
    otherBroadType1List: dietList,
    otherBroadType2: "Type",
    otherBroadType2List: typeList,
  });
});

router.post("/:cuisineName", async (req, res) => {
  const cuisineName = req.params.cuisineName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${cuisineName}&number=50`;
  const response = await fetch(url);
  const result = await response.json();
  console.log("It is in cuisine/:cuisineName route");
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
    otherBroadType1: "Diet",
    otherBroadType1List: dietList,
    otherBroadType2: "Type",
    otherBroadType2List: typeList,
  });
});

//Range bar for numbre of recipes of cuisine
router.post("/:cuisineName/number", async (req, res) => {
  const cuisineName = req.params.cuisineName;
  const numOfRecipes = req.body.numberOfRecipes;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${cuisineName}&number=${numOfRecipes}`;
  const response = await fetch(url);
  const result = await response.json();
  console.log("It is in cuisine/:cuisineName/number route");
  console.log(result);
  const recipes = result.results;

  //It should be render all information in grid
  res.render("display", {
    recipes: recipes,
    broadType: "Cuisine",
    specificType: cuisineName,
    numberOfRecipes: numOfRecipes,
    queryList: cuisineList,
    otherBroadType1: "Diet",
    otherBroadType1List: dietList,
    otherBroadType2: "Type",
    otherBroadType2List: typeList,
  });
});

module.exports = router;
