const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("selectDiet");
});

router.post("/", async (req, res) => {
  const diet = req.body.dietName;
  console.log(diet);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY5}&diet=${diet}&number=2`;
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
    otherBroadType1: "Cuisine",
    otherBroadType1List: cuisineList,
    otherBroadType2: "Type",
    otherBroadType2List: typeList,
  });
});

router.post("/:dietName", async (req, res, next) => {
  try {
    const country = req.params.dietName;
    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);
    // console.log(countryCapitalized);
    let totalRecipes;

    let dbRecipes = [];
    //if database is not found , then render the api to user, and insert the information into db
    let dietData = await db
      .select("*")
      .from("diets")
      .where("name", "=", countryCapitalized);
    let dietId = dietData[0].diet_id; //get Thai cuisine ID = 23
    // console.log(cuisineId); //this works

    let recipeDietData = await db
      .select("*")
      .from("recipe_diet")
      .where("diet_id", "=", dietId);
    console.log(`recipeDietData is below`);
    console.log(recipeDietData); //find if any information in recipe_cuisine table

    for (let recipe of recipeDietData) {
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
      console.log(`data is below`);
      console.log(data);
      if (data.length !== 0) {
        dbRecipes.push({
          id: data[0].recipe_id,
          title: data[0].recipe_name,
          image: data[0].recipe_image,
        });
      }
    }
    console.log(`dbRecipes is below`);
    console.log(dbRecipes);

    res.render("display", {
      recipes: dbRecipes, //Result from API
      broadType: "Diet",
      specificType: country,
      numberOfRecipes: dbRecipes.length,
      queryList: dietList,
      otherBroadType1: "Cuisine",
      otherBroadType1List: cuisineList,
      otherBroadType2: "Type",
      otherBroadType2List: typeList,
      totalRecipes: "",
      showingOtherBroadType: "",
      showingOtherSpecificType: "",
      afterFilter: false
    });
  } catch (err) {
    next(err);
  }
});

//Range bar for numbre of recipes of diet
router.post("/:dietName/number", async (req, res, next) => {
  try {
    const country = req.params.dietName;
    let numOfRecipes = parseInt(req.body.numberOfRecipes);
    console.log(numOfRecipes);
    let dbRecipes = [];

    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);

    //if database is not found , then render the api to user, and insert the information into db
    let dietData = await db
      .select("*")
      .from("diets")
      .where("name", "=", countryCapitalized);
    let dietId = dietData[0].diet_id; //get Thai cuisine ID = 23

    let recipeDietData = await db
      .select("recipe_id")
      .from("recipe_diet")
      .where("diet_id", "=", dietId);
    console.log("Below is the recipeDietData");
    console.log(recipeDietData);
    console.log(recipeDietData.length);
    console.log(typeof numOfRecipes);

    if (numOfRecipes >= recipeDietData.length) {
      for (let i = 0; i < recipeDietData.length; i++) {
        let eachRecipeId = recipeDietData[i].recipe_id;
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
        if (data.length !== 0) {
          dbRecipes.push({
            id: data[0].recipe_id,
            title: data[0].recipe_name,
            image: data[0].recipe_image,
          });
        }
      }
      res.render("display", {
        recipes: dbRecipes,
        broadType: "Diet",
        specificType: country,
        numberOfRecipes: dbRecipes.length,
        queryList: dietList,
        otherBroadType1: "Cuisine",
        otherBroadType1List: cuisineList,
        otherBroadType2: "Type",
        otherBroadType2List: typeList,
        totalRecipes: "",
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
        afterFilter: false
      });
    } else {
      console.log("request num is less than the total data in db");
      for (let i = 0; i <= numOfRecipes; i++) {
        let eachRecipeId = recipeDietData[i].recipe_id;
        console.log(eachRecipeId);
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
        console.log(`data is below`);
        console.log(data);
        if (data.length !== 0) {
          dbRecipes.push({
            id: data[0].recipe_id,
            title: data[0].recipe_name,
            image: data[0].recipe_image,
          });
        }
      }
      res.render("display", {
        recipes: dbRecipes,
        broadType: "Diet",
        specificType: country,
        numberOfRecipes: dbRecipes.length,
        queryList: dietList,
        otherBroadType1: "Cuisine",
        otherBroadType1List: cuisineList,
        otherBroadType2: "Type",
        otherBroadType2List: typeList,
        totalRecipes: "",
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
        afterFilter: false
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
