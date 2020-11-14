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
  res.send("Only logged in can come to /advanceSearch/cuisine route");
});

router.post("/:cuisineName", isLoggedIn, async (req, res, next) => {
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
    // console.log(`recipeCuisineData is below`);
    // console.log(recipeCuisineData); //find if any information in recipe_cuisine table

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
      if (data.length !== 0) {
        dbRecipes.push({
          id: data[0].recipe_id,
          title: data[0].recipe_name,
          image: data[0].recipe_image,
        });
      }
    }

    res.render("advanceDisplay", {
      recipes: dbRecipes, //Result from API
      broadType: "Cuisine",
      specificType: country,
      numberOfRecipes: dbRecipes.length,
      queryList: cuisineList,
      otherBroadType1: "Diet",
      otherBroadType1List: dietList,
      otherBroadType2: "Type",
      otherBroadType2List: typeList,
      totalRecipes: "",
      showingOtherBroadType: "",
      showingOtherSpecificType: "",
      afterFilter: false,
      advanceFilterName: "",
      advanceFilterValue: "",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:cuisineName/number", isLoggedIn, async (req, res, next) => {
  try {
    const country = req.params.cuisineName;
    let numOfRecipes = parseInt(req.body.numberOfRecipes);
    // console.log(numOfRecipes);
    let dbRecipes = [];

    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);

    //if database is not found , then render the api to user, and insert the information into db
    let cuisineData = await db
      .select("*")
      .from("cuisines")
      .where("name", "=", countryCapitalized);
    let cuisineId = cuisineData[0].cuisine_id; //get Thai cuisine ID = 23

    let recipeCuisineData = await db
      .select("recipe_id")
      .from("recipe_cuisine")
      .where("cuisine_id", "=", cuisineId);
    // console.log("Below is the recipeCuisineData");
    // console.log(recipeCuisineData.length);
    // console.log(typeof numOfRecipes);

    if (numOfRecipes >= recipeCuisineData.length) {
      // console.log("request number is larger than total data in db");
      for (let i = 0; i < recipeCuisineData.length; i++) {
        let eachRecipeId = recipeCuisineData[i].recipe_id;
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
      res.render("advanceDisplay", {
        recipes: dbRecipes,
        broadType: "Cuisine",
        specificType: country,
        numberOfRecipes: dbRecipes.length,
        queryList: cuisineList,
        otherBroadType1: "Diet",
        otherBroadType1List: dietList,
        otherBroadType2: "Type",
        otherBroadType2List: typeList,
        totalRecipes: "",
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
        afterFilter: false,
        advanceFilterName: "",
        advanceFilterValue: "",
      });
    } else {
      // console.log("request num is less than the total data in db");
      for (let i = 0; i <= numOfRecipes; i++) {
        let eachRecipeId = recipeCuisineData[i].recipe_id;
        // console.log(eachRecipeId);
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
      res.render("advanceDisplay", {
        recipes: dbRecipes,
        broadType: "Cuisine",
        specificType: country,
        numberOfRecipes: dbRecipes.length,
        queryList: cuisineList,
        otherBroadType1: "Diet",
        otherBroadType1List: dietList,
        otherBroadType2: "Type",
        otherBroadType2List: typeList,
        totalRecipes: "",
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
        afterFilter: false,
        advanceFilterName: "",
        advanceFilterValue: "",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
