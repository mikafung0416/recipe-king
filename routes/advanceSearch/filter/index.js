const passport = require("passport");
const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../../queryList/cuisineList");
const dietList = require("../../../queryList/dietList");
const typeList = require("../../../queryList/typeList");
const db = require("../../../database");
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/sign-in");
}

router.get("/", isLoggedIn, (req, res) => {
  res.send("Only logged in can come to /advanceSearch/filter route");
});

router.post("/:otherBroadType1/:otherBroadType2", isLoggedIn, async (req, res) => {
  let type1 = req.params.otherBroadType1; //eg.Cuisine
  let type2 = req.params.otherBroadType2; //eg. Diet
  let { broadType, specificType } = req.body; //eg. broadType = Type
  console.log(type1, type2, broadType, specificType);
  let broadList;
  let type1List;
  let type2List;
  let showingOtherBroadType; //the filter broad catergroy user click
  let showingOtherSpecificType; //the filter speific catergroy user click

  let checkboxes = []; //select all filtering parts

  let type1CheckBox = [];
  let type2CheckBox = [];

  let type1Querys = ""; //type1Querys = 'Chinese,Japanese,Thai';
  let type2Querys = ""; //type2Querys = 'Vegan,vegetarian';

  //take away the checkboxes which are clicked
  for (let item in req.body) {
    if (req.body[item] === "on") {
      checkboxes.push(item);
    }
  }

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].split(`-${type1}`).length === 1) {
      type2CheckBox.push(checkboxes[i].split(`-${type2}`)[0]);
    } else {
      type1CheckBox.push(checkboxes[i].split(`-${type1}`)[0]);
    }
  }

  let stype1 = type1.charAt(0).toLowerCase() + type1.slice(1); //get small letter of "cuisine"
  let stype2 = type2.charAt(0).toLowerCase() + type2.slice(1); //get small letter of "type"
  let sbroadType = broadType.charAt(0).toLowerCase() + broadType.slice(1);
  let sspecificType =
    specificType.charAt(0).toLowerCase() + specificType.slice(1);

  console.log(broadType, type1, type2);
  console.log(type1CheckBox);
  console.log(type2CheckBox);

  broadList =
    sbroadType === "cuisine"
      ? cuisineList
      : sbroadType === "diet"
      ? dietList
      : typeList;
  type1List =
    stype1 === "cuisine"
      ? cuisineList
      : stype1 === "diet"
      ? dietList
      : typeList;
  type2List =
    stype2 === "cuisine"
      ? cuisineList
      : stype2 === "diet"
      ? dietList
      : typeList;
  //1. search db to see if have, if have, then render from db to user

  //2a if dont have, then search from api, then render from api to user
  if (type1CheckBox.length === 0) {
    type1Querys = "";
  } else {
    for (let i = 0; i < type1CheckBox.length; i++) {
      type1Querys += type1CheckBox[i];
      if (i !== type1CheckBox.length - 1) {
        //the last one will not add , type1Querys = 'Chinese,Japanese,Thai';
        type1Querys += ",";
      }
    }
    showingOtherBroadType = type1; //Diet
    showingOtherSpecificType = type1Querys; // Vegan
  }

  if (type2CheckBox.length === 0) {
    type2Querys = "";
  } else {
    for (let i = 0; i < type2CheckBox.length; i++) {
      type2Querys += type2CheckBox[i];
      if (i !== type2CheckBox.length - 1) {
        //the last one will not add ,
        type2Querys += ",";
      }
    }
    showingOtherBroadType = type2;
    showingOtherSpecificType = type2Querys;
  }
  console.log(type1Querys);
  console.log(type2Querys);

  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY5}&${sbroadType}=${sspecificType}&${stype1}=${type1Querys}&${stype2}=${type2Querys}&number=2`;
  console.log(url);
  let response = await fetch(url);
  let result = await response.json();
  let recipes = result.results;
  totalRecipes = result.totalResults;

  console.log("Filtering Results from API");
  console.log(recipes);

  //2b At the same time, insert the missing recipes to "recipes" table, recipesIDs to "reicpe-cuisine/diet/type" table
  // - if recipes table dont have these recipes ID, then add these recipes ID into recipes
  // - find cuisine_id, diet_id, type_id, and added into recipes table
  for (let recipe of recipes) {
    let eachRecipeId = recipe.id;
    let data = await db
      .select("recipe_id")
      .from("recipes")
      .where("recipe_id", "=", eachRecipeId);
    console.log(data);
    if (data.length === 0) {
      let recipeURL = `https://api.spoonacular.com/recipes/${eachRecipeId}/information?apiKey=${process.env.API_KEY5}&includeNutrition=true`;
      console.log(recipeURL);
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
      console.log(`instructionSteps`);
      console.log(instructionSteps);
      let instructionJSONresult = JSON.stringify(instructionSteps);

      let ingredientURL = `https://api.spoonacular.com/recipes/${eachRecipeId}/ingredientWidget.json?apiKey=${process.env.API_KEY5}`;
      let ingredientResponse = await fetch(ingredientURL);
      let ingredientResult = await ingredientResponse.json();
      let ingredientJSONResult = JSON.stringify(ingredientResult.ingredients);

      let equipmentURL = `https://api.spoonacular.com/recipes/${eachRecipeId}/equipmentWidget.json?apiKey=${process.env.API_KEY5}`;
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

      console.log(`dataIwant is below`);
      console.log(dataIwant);

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
        });
    }
    //2. insert the missing api into db
    //2a. get every recipe id
  }

  res.render("advanceDisplay", {
    recipes: recipes, //Result from API
    broadType: broadType,
    specificType: specificType,
    numberOfRecipes: recipes.length,
    queryList: broadList,
    otherBroadType1: type1,
    otherBroadType1List: type1List,
    otherBroadType2: type2,
    otherBroadType2List: type2List,
    totalRecipes: totalRecipes,
    showingOtherBroadType: showingOtherBroadType,
    showingOtherSpecificType: showingOtherSpecificType,
  });
});

module.exports = router;
