const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");

const africanCuisines = require("../../result/cuisine/african.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("selectCuisine");
});

//when user select cuisine, it will direct to listing all recipe pages
router.post("/", async (req, res) => {
  const country = req.body.cuisineName;

  const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

  console.log(countryCapitalized);

  //if database is not found , then render the api to user, and insert the information into db
  let cuisineData = await db
    .select("*")
    .from("cuisines")
    .where("name", "=", countryCapitalized);
  let cuisineId = cuisineData[0].cuisine_id; //get Thai cuisine ID = 23
  console.log(cuisineId); //this works

  let recipeCuisineData = await db
    .select("*")
    .from("recipe_cuisine")
    .where("cuisine_id", "=", cuisineId);
  console.log(recipeCuisineData);

  if (recipeCuisineData.length === 0) {
    //1. call the api
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY6}&cuisine=${country}&number=2`;
    let response = await fetch(url);
    let result = await response.json();
    let recipes = result.results;
    let numOfRecipes = result.number;
    console.log(recipes);

    //2. insert the api stuff into db
    //2a. get every recipe id
    recipes.forEach(async (recipe) => {
      let recipeID = recipe.id;

      await db
        .insert({ recipe_id: recipeID, cuisine_id: cuisineId })
        .into("recipe_cuisine");

      //2b. call the api with recipeId
      let recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${process.env.API_KEY6}&includeNutrition=true`;
      let recipeResponse = await fetch(recipeURL);
      let recipeResult = await recipeResponse.json();
      let nutrientResult = recipeResult.nutrition.nutrients;
      let nutrientJSONResult = JSON.stringify(nutrientResult);
      // console.log(nutrientResult);

      let ingredientURL = `https://api.spoonacular.com/recipes/${recipeID}/ingredientWidget.json?apiKey=${process.env.API_KEY6}`;
      let ingredientResponse = await fetch(ingredientURL);
      let ingredientResult = await ingredientResponse.json();
      let ingredientJSONResult = JSON.stringify(ingredientResult.ingredients);

      let equipmentURL = `https://api.spoonacular.com/recipes/${recipeID}/equipmentWidget.json?apiKey=${process.env.API_KEY6}`;
      let equipmentResponse = await fetch(equipmentURL);
      let equipmentResult = await equipmentResponse.json();
      let equipmentJSONResult = JSON.stringify(equipmentResult.equipment);

      let dataIwant = {
        recipe_id: recipeResult["id"],
        recipe_name: recipeResult["title"],
        recipe_instruction: recipeResult["instructions"],
        recipe_image: recipeResult["image"],
        vegetarian: recipeResult["vegetarian"],
        vegan: recipeResult["vegan"],
        glutenfree: recipeResult["glutenFree"],
        dairyfree: recipeResult["dairyFree"],
        veryhealthy: recipeResult["veryHealthy"],
        cheap: recipeResult["cheap"],
        verypopular: recipeResult["veryPopular"],
        sustainable: recipeResult["sustainable"],
        ingredients: ingredientJSONResult,
        equipment: equipmentJSONResult,
        nutrient: nutrientJSONResult,
      };

      console.log(dataIwant);

      //2c. insert the information of all the recipeId into recipe table
      db.insert({
        recipe_id: recipeResult["id"],
        recipe_name: recipeResult["title"],
        recipe_instruction: "instruction",
        recipe_image: recipeResult["image"],
        vegetarian: recipeResult["vegetarian"],
        vegan: recipeResult["vegan"],
        glutenfree: recipeResult["glutenFree"],
        dairyfree: recipeResult["dairyFree"],
        veryhealthy: recipeResult["veryHealthy"],
        cheap: recipeResult["cheap"],
        verypopular: recipeResult["veryPopular"],
        sustainable: recipeResult["sustainable"],
        ingredients: ingredientJSONResult,
        equipment: equipmentJSONResult,
        nutrient: nutrientJSONResult,
      })
        .into("recipes")
        .then(() => {
          console.log("All data are added");
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
    });
  } else {
    console.log("Rendering from db");
    //rendering from db
    //base on the recipe_id on recipe_cuisine table to render in recipes table
    let recipeIDs = await db
      .select("recipe_id")
      .from("recipe_cuisine")
      .where("cuisine_id", "=", cuisineId);
    let dbRecipes = [];
    console.log(recipeIDs);

    for (let recipe of recipeIDs) {
      let eachRecipeId = recipe.recipe_id;
      let data = await db
        .select("recipe_name", "recipe_instruction", "recipe_image")
        .from("recipes")
        .where("recipe_id", "=", eachRecipeId);
      dbRecipes.push({
        title: data[0].recipe_name,
        image: data[0].recipe_image,
      });
    }

    console.log(dbRecipes);
    res.render("display", {
      recipes: dbRecipes,
      broadType: "Cuisine",
      specificType: country,
      numberOfRecipes: dbRecipes.length,
      queryList: cuisineList,
      otherBroadType1: "Diet",
      otherBroadType1List: dietList,
      otherBroadType2: "Type",
      otherBroadType2List: typeList,
    });
  }
  //It should be render all information in grid
});

router.post("/:cuisineName", async (req, res) => {
  const cuisineName = req.params.cuisineName;
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY3}&cuisine=${cuisineName}&number=2`;
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
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY3}&cuisine=${cuisineName}&number=${numOfRecipes}`;
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

// //test route
// router.post("/cuisine", async (req, res) => {
//   const receivedCuisine = req.body.cuisineName;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY3}&cuisine=${cuisineName}&number=100`;
//   const response = await fetch(url);
//   const result = await response.json();
//   const recipes = result.results;
//   //if db dont have the recipe id, then call with api and render to user
//   //at the same time, insert that information into db
// });

module.exports = router;
