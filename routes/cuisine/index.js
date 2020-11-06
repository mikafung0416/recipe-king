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
router.post("/", async (req, res, next) => {});

router.post("/:cuisineName", async (req, res, next) => {
  try {
    const country = req.params.cuisineName;
    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);
    // console.log(countryCapitalized);
    let totalRecipes;

    let dbRecipes = [];
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
    console.log(recipeCuisineData); //find if any information in recipe_cuisine table

    console.log(
      "I just take the total recipes from api, so it may still render by db"
    );
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY6}&cuisine=${country}&number=2`;
    let response = await fetch(url);
    let result = await response.json();
    let recipes = result.results;
    let numOfRecipes = result.number;
    totalRecipes = result.totalResults;
    console.log("Results from API");
    console.log(recipes);

    if (recipeCuisineData.length === 0) {
      //1. call the api
      console.log("Calling from API");
      // let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY6}&cuisine=${country}&number=2`;
      // let response = await fetch(url);
      // let result = await response.json();
      // let recipes = result.results;
      // let numOfRecipes = result.number;
      // totalRecipes = result.totalResults;
      // console.log("Results from API");
      // console.log(recipes);

      //2a. For each recipe ID from API
      //2b. Call the api by recipe ID
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
          glutenFree: recipeResult["glutenFree"],
          dairyFree: recipeResult["dairyFree"],
          veryHealthy: recipeResult["veryHealthy"],
          cheap: recipeResult["cheap"],
          veryPopular: recipeResult["veryPopular"],
          sustainable: recipeResult["sustainable"],
          ingredients: ingredientJSONResult,
          equipment: equipmentJSONResult,
          nutrient: nutrientJSONResult,
        };

        // console.log(dataIwant);

        //2c. insert the information of all the recipeId into recipe table
        db.insert({
          recipe_id: recipeResult["id"],
          recipe_name: recipeResult["title"],
          recipe_instruction: "instruction",
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
        })
          .into("recipes")
          .then(() => {
            console.log("All data are added");
            res.render("display", {
              recipes: recipes, //Result from API
              broadType: "Cuisine",
              specificType: country,
              numberOfRecipes: numOfRecipes,
              queryList: cuisineList,
              otherBroadType1: "Diet",
              otherBroadType1List: dietList,
              otherBroadType2: "Type",
              otherBroadType2List: typeList,
              totalRecipes: totalRecipes,
              showingOtherBroadType: "",
              showingOtherSpecificType: "",
            });
          });
      });
    } else {
      console.log("Rendering from db");
      //rendering from db
      //base on the recipe_id on recipe_cuisine table to render in recipes table
      // console.log("recipeCuisineData is below"); //Result from recipe_cuisine table
      // console.log(recipeCuisineData);

      // console.log(`recipeCuisineData is below`);
      // console.log(recipeCuisineData);

      for (let recipe of recipeCuisineData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        // console.log(`data is below`);
        // console.log(data);
        dbRecipes.push({
          id: data[0].recipe_id,
          title: data[0].recipe_name,
          image: data[0].recipe_image,
        });
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
        totalRecipes: totalRecipes,
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
      });
    }
  } catch (err) {
    next(err);
  }
});

//Range bar for numbre of recipes of cuisine
router.post("/:cuisineName/number", async (req, res, next) => {
  try {
    const country = req.params.cuisineName;
    let numOfRecipes = req.body.numberOfRecipes;
    let totalRecipes = req.body.totalRecipes;
    let dbRecipes = [];

    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);

    //if database is not found , then render the api to user, and insert the information into db
    let cuisineData = await db
      .select("*")
      .from("cuisines")
      .where("name", "=", countryCapitalized);
    let cuisineId = cuisineData[0].cuisine_id; //get Thai cuisine ID = 23

    //1. if user requests 15 recipes with that cuisineID, find "recipe_cuisine" table with that cuisineID, to see how many recipesID return
    //2. if returnData.length < number of recipes requested by user, then call api of 15 recipes
    //3. for each recipe id, check if db already have that recipe id, if have, then dont add that duplicated recipe id

    let recipeCuisineData = await db
      .select("recipe_id")
      .from("recipe_cuisine")
      .where("cuisine_id", "=", cuisineId);
    console.log("Below is the recipeCuisineData");
    console.log(recipeCuisineData);

    if (recipeCuisineData.length < numOfRecipes) {
      //1. call the api basing on the number that user request
      console.log("Calling from API");
      if (numOfRecipes > totalRecipes) {
        numOfRecipes = totalRecipes;
      }
      let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY6}&cuisine=${country}&number=${numOfRecipes}`;
      let response = await fetch(url);
      let result = await response.json();
      let recipes = result.results;
      // console.log(recipes);

      //recipeCuisineData is the remaining recipes inside DB, need to find the recipeID, assuming already have data inside db

      for (let recipe of recipeCuisineData) {
        let eachRecipeId = recipe.recipe_id;
        //there is no information in recipes table yet
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        // console.log(`data is below`);
        // console.log(data);
        dbRecipes.push({
          id: data[0].recipe_id || "Can not find",
          title: data[0].recipe_name || "Can not find",
          image: data[0].recipe_image || "Can not find",
        });
      }

      //recipes = [recipes that db dont have]
      // console.log(`noDuplicateRecipes is below`);
      for (let i = 0; i < recipeCuisineData.length; i++) {
        let eachRecipeCuisineId = recipeCuisineData[i].recipe_id;
        if (recipes.findIndex((obj) => obj.id === eachRecipeCuisineId) !== -1) {
          recipes.splice(
            recipes.findIndex((i) => i.id === eachRecipeCuisineId),
            1
          );
        }
      }

      dbRecipes.push(...recipes);
      // console.log(`dbRecipes is below`);
      // console.log(dbRecipes);

      //2. insert the missing api into db
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

        //2c. insert the information of all the recipeId into recipe table
        db.insert({
          recipe_id: recipeResult["id"],
          recipe_name: recipeResult["title"],
          recipe_instruction: "instruction",
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
        })
          .into("recipes")
          .then(() => {
            console.log("All data are added");
            res.render("display", {
              recipes: dbRecipes,
              broadType: "Cuisine",
              specificType: country,
              numberOfRecipes: numOfRecipes,
              queryList: cuisineList,
              otherBroadType1: "Diet",
              otherBroadType1List: dietList,
              otherBroadType2: "Type",
              otherBroadType2List: typeList,
              totalRecipes: totalRecipes,
              showingOtherBroadType: "",
              showingOtherSpecificType: "",
            });
          });
      });
    } else {
      console.log("Rendering from db");
      //rendering from db
      //if user request 10 recipes, than db have 15 recipes, db will render first 10 recipes

      //base on the recipe_id on recipe_cuisine table to render in recipes table
      let recipeIDs = await db
        .select("recipe_id")
        .from("recipe_cuisine")
        .where("cuisine_id", "=", cuisineId);
      console.log("recipesIDs taking from db");
      console.log(recipeIDs);

      // for (let i = 0; i < numOfRecipes; i++) {
      //   let eachRecipeId = recipeIDs[i].recipe_id;
      //   let data = await db
      //     .select(
      //       "recipe_id",
      //       "recipe_name",
      //       "recipe_instruction",
      //       "recipe_image",
      //       "ingredients",
      //       "equipment",
      //       "nutrient"
      //     )
      //     .from("recipes")
      //     .where("recipe_id", "=", eachRecipeId);
      //   // console.log(`data is below`);
      //   // console.log(data);
      //   dbRecipes.push({
      //     id: data[0].recipe_id,
      //     title: data[0].recipe_name,
      //     image: data[0].recipe_image,
      //   });
      // }

      for (let recipe of recipeIDs) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        // console.log(`data is below`);
        // console.log(data);
        dbRecipes.push({
          id: data[0].recipe_id,
          title: data[0].recipe_name,
          image: data[0].recipe_image,
        });
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
        totalRecipes: totalRecipes,
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
