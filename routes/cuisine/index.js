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
  console.log(recipeCuisineData); //find the recipeID

  if (recipeCuisineData.length === 0) {
    //1. call the api
    console.log("Calling from API");
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${country}&number=2`;
    let response = await fetch(url);
    let result = await response.json();
    let recipes = result.results;
    let numOfRecipes = result.number;
    // console.log(recipes);

    //2. insert the api stuff into db
    //2a. get every recipe id
    recipes.forEach(async (recipe) => {
      let recipeID = recipe.id;

      await db
        .insert({ recipe_id: recipeID, cuisine_id: cuisineId })
        .into("recipe_cuisine");

      //2b. call the api with recipeId
      let recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${process.env.API_KEY2}&includeNutrition=true`;
      let recipeResponse = await fetch(recipeURL);
      let recipeResult = await recipeResponse.json();
      let cuisineResult = recipeResult.cuisines;
      let dishResult = recipeResult.dishTypes;
      let dietResult = recipeResult.diets;
      let nutrientResult = recipeResult.nutrition.nutrients;
      let nutrientJSONResult = JSON.stringify(nutrientResult);
      let cuisineJSONResult = JSON.stringify(cuisineResult);
      let dishJSONResult = JSON.stringify(dishResult);
      let dietJSONResult = JSON.stringify(dietResult);
      // console.log(nutrientResult);

      let ingredientURL = `https://api.spoonacular.com/recipes/${recipeID}/ingredientWidget.json?apiKey=${process.env.API_KEY2}`;
      let ingredientResponse = await fetch(ingredientURL);
      let ingredientResult = await ingredientResponse.json();
      let ingredientJSONResult = JSON.stringify(ingredientResult.ingredients);

      let equipmentURL = `https://api.spoonacular.com/recipes/${recipeID}/equipmentWidget.json?apiKey=${process.env.API_KEY2}`;
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
        recipe_cooking_time: recipeResult["readyInMinutes"],
        servings: recipeResult["servings"],
        cuisines: cuisineJSONResult,
        dishTypes: dishJSONResult,
        diets: dietJSONResult
      };

      // console.log(dataIwant);

      //2c. insert the information of all the recipeId into recipe table
      db.insert({
        recipe_id: recipeResult["id"],
        recipe_name: recipeResult["title"],
        recipe_instruction: recipeResult["instructions"],
        recipe_image: recipeResult["image"],
        vegetarian: recipeResult["vegetarian"],
        vegan: recipeResult["vegan"],
        glutenFree: recipeResult["glutenFree"],
        dairyFree: recipeResult["dairyFree"],
        veryHealthy: recipeResult["veryHealthy"],
        cheap: recipeResult["cheap"],
        veryPopular: recipeResult["veryPopular"],
        sustainable: recipeResult["sustainable"],
        ingredients: ingredientJSONResult,
        equipment: equipmentJSONResult,
        nutrient: nutrientJSONResult,
        recipe_cooking_time: recipeResult["readyInMinutes"],
        servings: recipeResult["servings"],
        cuisines: cuisineJSONResult,
        dishTypes: dishJSONResult,
        diets: dietJSONResult
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
    // console.log("recipeCuisineData is below");
    // console.log(recipeCuisineData);
    let recipeIDs = await db
      .select("recipe_id")
      .from("recipe_cuisine")
      .where("cuisine_id", "=", cuisineId);
    let dbRecipes = [];
    // console.log(`recipeIDs is below`);
    // console.log(recipeIDs);

    for (let recipe of recipeIDs) {
      let eachRecipeId = recipe.recipe_id;
      let data = await db
        .select(
          'recipe_id',
          "recipe_name",
          "recipe_instruction",
          "recipe_image",
          "ingredients",
          "equipment",
          "nutrient"
        )
        .from("recipes")
        .where("recipe_id", "=", eachRecipeId);
      // console.log(data);
      dbRecipes.push({
        title: data[0].recipe_name,
        image: data[0].recipe_image,
        id: data[0].recipe_id
      });
      // console.log(data[0].ingredients);
      // console.log(data[0].equipment);
      // console.log(data[0].nutrient);
    }
    // console.log("dbRecipes is below");
    // console.log(dbRecipes);
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
  const country = req.params.cuisineName;

  const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

  // console.log(countryCapitalized);

  //if database is not found , then render the api to user, and insert the information into db
  let cuisineData = await db
    .select("*")
    .from("cuisines")
    .where("name", "=", countryCapitalized);
  let cuisineId = cuisineData[0].cuisine_id; //get Thai cuisine ID = 23
  // console.log(cuisineId); //this works

  let recipeCuisineData = await db
    .select("*")
    .from("recipe_cuisine")
    .where("cuisine_id", "=", cuisineId);
  // console.log(`recipeCuisineData is below`);
  // console.log(recipeCuisineData);

  if (recipeCuisineData.length === 0) {
    //1. call the api
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${country}&number=2`;
    let response = await fetch(url);
    let result = await response.json();
    let recipes = result.results;
    let numOfRecipes = result.number;
    // console.log(`recipes calling from API is below`);
    // console.log(recipes);

    //2. insert the api stuff into db
    //2a. get every recipe id
    recipes.forEach(async (recipe) => {
      let recipeID = recipe.id;

      await db
        .insert({ recipe_id: recipeID, cuisine_id: cuisineId })
        .into("recipe_cuisine");

      //2b. call the api with recipeId
      let recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${process.env.API_KEY2}&includeNutrition=true`;
      let recipeResponse = await fetch(recipeURL);
      let recipeResult = await recipeResponse.json();
      let cuisineResult = recipeResult.cuisines;
      let dishResult = recipeResult.dishTypes;
      let dietResult = recipeResult.diets;
      let nutrientResult = recipeResult.nutrition.nutrients;
      let nutrientJSONResult = JSON.stringify(nutrientResult);
      let cuisineJSONResult = JSON.stringify(cuisineResult);
      let dishJSONResult = JSON.stringify(dishResult);
      let dietJSONResult = JSON.stringify(dietResult);
      let instructionAnal = recipeResult.analyzedInstructions;
      let instructionSteps = [];
      
      for(let i = 0; i < instructionAnal[0].steps.length; i++){
        // let steps = instructionAnal[0].steps[i].step
        let data = instructionAnal[0].steps[i].step;
        instructionSteps.push(data)
      }
      // console.log(instructionSteps);
      let instructionJSONresult = JSON.stringify(instructionSteps);
      // console.log(cuisineResult);
      // console.log(dishResult);
      // console.log(dietResult);
      // console.log(instructionJSONresult);

      let ingredientURL = `https://api.spoonacular.com/recipes/${recipeID}/ingredientWidget.json?apiKey=${process.env.API_KEY2}`;
      let ingredientResponse = await fetch(ingredientURL);
      let ingredientResult = await ingredientResponse.json();
      let ingredientJSONResult = JSON.stringify(ingredientResult.ingredients);

      let equipmentURL = `https://api.spoonacular.com/recipes/${recipeID}/equipmentWidget.json?apiKey=${process.env.API_KEY2}`;
      let equipmentResponse = await fetch(equipmentURL);
      let equipmentResult = await equipmentResponse.json();
      let equipmentJSONResult = JSON.stringify(equipmentResult.equipment);

      let dataIwant = {
        recipe_id: recipeResult["id"],
        recipe_name: recipeResult["title"],
        recipe_instruction: instructionJSONresult,
        recipe_image: recipeResult["image"],
        vegetarian: recipeResult["vegetarian"],
        vegan: recipeResult["vegan"],
        glutenFree: recipeResult["glutenFree"],
        dairyFree: recipeResult["dairyFree"],
        veryHealthy: recipeResult["veryHealthy"],
        cheap: recipeResult["cheap"],
        veryPopular: recipeResult["veryPopular"],
        sustainable: recipeResult["sustainable"],
        ingredients: ingredientJSONResult,
        equipment: equipmentJSONResult,
        nutrient: nutrientJSONResult,
        recipe_cooking_time: recipeResult["readyInMinutes"],
        servings: recipeResult["servings"],
        cuisines: cuisineJSONResult,
        dishTypes: dishJSONResult,
        diets: dietJSONResult,
      };

      // console.log('dataIwant')
      // console.log(dataIwant);

      //2c. insert the information of all the recipeId into recipe table
      db.insert({
        recipe_id: recipeResult["id"],
        recipe_name: recipeResult["title"],
        recipe_instruction: instructionJSONresult,
        recipe_image: recipeResult["image"],
        vegetarian: recipeResult["vegetarian"],
        vegan: recipeResult["vegan"],
        glutenFree: recipeResult["glutenFree"],
        dairyFree: recipeResult["dairyFree"],
        veryHealthy: recipeResult["veryHealthy"],
        cheap: recipeResult["cheap"],
        veryPopular: recipeResult["veryPopular"],
        sustainable: recipeResult["sustainable"],
        ingredients: ingredientJSONResult,
        equipment: equipmentJSONResult,
        nutrient: nutrientJSONResult,
        recipe_cooking_time: recipeResult["readyInMinutes"],
        servings: recipeResult["servings"],
        cuisines: cuisineJSONResult,
        dishTypes: dishJSONResult,
        diets: dietJSONResult,
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
        .select(
          'recipe_id',
          "recipe_name",
          "recipe_instruction",
          "recipe_image",
          "ingredients",
          "equipment",
          "nutrient"
        )
        .from("recipes")
        .where("recipe_id", "=", eachRecipeId);
      dbRecipes.push({
        title: data[0].recipe_name,
        image: data[0].recipe_image,
        id: data[0].recipe_id
      });
      // console.log(data[0].ingredients);
      // console.log(data[0].equipment);
      // console.log(data[0].nutrient);
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
});

//Range bar for numbre of recipes of cuisine
router.post("/:cuisineName/number", async (req, res) => {
  const country = req.params.cuisineName;
  const numOfRecipes = req.body.numberOfRecipes;

  const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

  // console.log(countryCapitalized);

  //if database is not found , then render the api to user, and insert the information into db
  let cuisineData = await db
    .select("*")
    .from("cuisines")
    .where("name", "=", countryCapitalized);
  let cuisineId = cuisineData[0].cuisine_id; //get Thai cuisine ID = 23
  // console.log(cuisineId); //this works

  //1. if user requests 15 recipes with that cuisineID, find "recipe_cuisine" table with that cuisineID, to see how many recipesID return
  //2. if returnData.length < number of recipes requested by user, then call api of 15 recipes
  //3. for each recipe id, check if db already have that recipe id, if have, then dont add that duplicated recipe id

  let recipeCuisineData = await db
    .select("*")
    .from("recipe_cuisine")
    .where("cuisine_id", "=", cuisineId);
  console.log("Below is the recipeCuisineData");
  console.log(recipeCuisineData);
  console.log(`numOfRecipes = ${numOfRecipes}`);

  if (recipeCuisineData.length < numOfRecipes) {
    //1. call the api
    console.log("Calling from API");
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${country}&number=${numOfRecipes}`;
    let response = await fetch(url);
    let result = await response.json();
    let recipes = result.results;
    console.log(recipes);
    // should remove duplicated recipesID

    //2. insert the api stuff into db
    //2a. get every recipe id
    recipes.forEach(async (recipe) => {
      let recipeID = recipe.id;

      await db
        .insert({ recipe_id: recipeID, cuisine_id: cuisineId })
        .into("recipe_cuisine");

      //2b. call the api with recipeId
      let recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${process.env.API_KEY2}&includeNutrition=true`;
      let recipeResponse = await fetch(recipeURL);
      let recipeResult = await recipeResponse.json();
      let cuisineResult = recipeResult.cuisines;
      let dishResult = recipeResult.dishTypes;
      let dietResult = recipeResult.diets;
      let nutrientResult = recipeResult.nutrition.nutrients;
      let nutrientJSONResult = JSON.stringify(nutrientResult);
      let cuisineJSONResult = JSON.stringify(cuisineResult);
      let dishJSONResult = JSON.stringify(dishResult);
      let dietJSONResult = JSON.stringify(dietResult);
      // console.log(cuisineResult);
      // console.log(dishResult);
      // console.log(dietResult);

      let ingredientURL = `https://api.spoonacular.com/recipes/${recipeID}/ingredientWidget.json?apiKey=${process.env.API_KEY2}`;
      let ingredientResponse = await fetch(ingredientURL);
      let ingredientResult = await ingredientResponse.json();
      let ingredientJSONResult = JSON.stringify(ingredientResult.ingredients);

      let equipmentURL = `https://api.spoonacular.com/recipes/${recipeID}/equipmentWidget.json?apiKey=${process.env.API_KEY2}`;
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
        recipe_instruction: recipeResult,
      };

      console.log(dataIwant);

      //2c. insert the information of all the recipeId into recipe table
      db.insert({
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
        .select(
          "recipe_name",
          "recipe_instruction",
          "recipe_image",
          "ingredients",
          "equipment",
          "nutrient"
        )
        .from("recipes")
        .where("recipe_id", "=", eachRecipeId);
      dbRecipes.push({
        title: data[0].recipe_name,
        image: data[0].recipe_image,
      });
      // console.log(data[0].ingredients);
      // console.log(data[0].equipment);
      // console.log(data[0].nutrient);
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
});

module.exports = router;
