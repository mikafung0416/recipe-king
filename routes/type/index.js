const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("selectType");
});

router.post("/", async (req, res) => {
  const type = req.body.typeName;
  console.log(type);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&type=${type}&number=2`;
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
    otherBroadType1: "Cuisine",
    otherBroadType1List: cuisineList,
    otherBroadType2: "Diet",
    otherBroadType2List: dietList,
  });
});

router.post("/:typeName", async (req, res, next) => {
  try {
    const country = req.params.typeName;

    let totalRecipes;

    let dbRecipes = [];
    //if database is not found , then render the api to user, and insert the information into db
    let typeData = await db
      .select("*")
      .from("types")
      .where("name", "=", country.toLowerCase());

    let typeId = typeData[0].type_id; //get Thai cuisine ID = 23

    let recipeTypeData = await db
      .select("*")
      .from("recipe_type")
      .where("type_id", "=", typeId);
    console.log(recipeTypeData); //find if any information in recipe_cuisine table

    console.log(
      "I just take the total recipes from api, so it may still render by db"
    );
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY7}&type=${country}&number=50`;
    let response = await fetch(url);
    let result = await response.json();
    let recipes = result.results;
    let numOfRecipes = result.number;
    totalRecipes = result.totalResults;
    console.log("Results from API");
    console.log(result);

    if (recipeTypeData.length === 0) {
      //1. call the api
      console.log("Calling from API");
      //2a. For each recipe ID from API
      //2b. Call the api by recipe ID
      recipes.forEach(async (recipe) => {
        let recipeID = recipe.id;

        await db
          .insert({ recipe_id: recipeID, type_id: typeId })
          .into("recipe_type");

        //2b. call the api with recipeId
        let recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${process.env.API_KEY1}&includeNutrition=true`;
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
        for (let i = 0; i < instructionAnal[0].steps.length; i++) {
          // let steps = instructionAnal[0].steps[i].step
          let data = instructionAnal[0].steps[i].step;
          instructionSteps.push(data);
        }
        // console.log(`instructionSteps`);
        // console.log(instructionSteps);
        let instructionJSONresult = JSON.stringify(instructionSteps);

        let ingredientURL = `https://api.spoonacular.com/recipes/${recipeID}/ingredientWidget.json?apiKey=${process.env.API_KEY1}`;
        let ingredientResponse = await fetch(ingredientURL);
        let ingredientResult = await ingredientResponse.json();
        let ingredientJSONResult = JSON.stringify(ingredientResult.ingredients);

        let equipmentURL = `https://api.spoonacular.com/recipes/${recipeID}/equipmentWidget.json?apiKey=${process.env.API_KEY1}`;
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

        // console.log(`dataIwant is below`);
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
              recipes: recipes, //Result from API
              broadType: "Type",
              specificType: country,
              numberOfRecipes: numOfRecipes,
              queryList: typeList,
              otherBroadType1: "Cuisine",
              otherBroadType1List: cuisineList,
              otherBroadType2: "Diet",
              otherBroadType2List: dietList,
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

      for (let recipe of recipeTypeData) {
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
        recipes: recipes, //Result from API
        broadType: "Type",
        specificType: country,
        numberOfRecipes: numOfRecipes,
        queryList: typeList,
        otherBroadType1: "Cuisine",
        otherBroadType1List: cuisineList,
        otherBroadType2: "Diet",
        otherBroadType2List: dietList,
        totalRecipes: totalRecipes,
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
      });
    }
  } catch (err) {
    next(err);
  }
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
    specificType: type,
    numberOfRecipes: numOfRecipes,
    queryList: typeList,
    otherBroadType1: "Cuisine",
    otherBroadType1List: cuisineList,
    otherBroadType2: "Diet",
    otherBroadType2List: dietList,
  });
});

module.exports = router;
