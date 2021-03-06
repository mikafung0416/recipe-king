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
  res.send("Only logged in can come to /advanceSearch/diet route");
});

router.post("/:dietName", isLoggedIn, async (req, res, next) => {
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
    // console.log(`recipeDietData is below`);
    // console.log(recipeDietData); //find if any information in recipe_cuisine table

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
    // console.log(`dbRecipes is below`);
    // console.log(dbRecipes);

    res.render("advanceDisplay", {
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
      afterFilter: false,
      advanceFilterName: "",
      advanceFilterValue: "",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:dietName/number", isLoggedIn, async (req, res, next) => {
  try {
    const country = req.params.dietName;
    let numOfRecipes = parseInt(req.body.numberOfRecipes);
    // console.log(numOfRecipes);
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
    // console.log("Below is the recipeDietData");
    // console.log(recipeDietData.length);
    // console.log(typeof numOfRecipes);

    if (numOfRecipes >= recipeDietData.length) {
      // console.log("request number is larger than total data in db");
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
      res.render("advanceDisplay", {
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
        afterFilter: false,
        advanceFilterName: "",
        advanceFilterValue: "",
      });
    } else {
      // console.log("request num is less than the total data in db");
      for (let i = 0; i <= numOfRecipes; i++) {
        let eachRecipeId = recipeDietData[i].recipe_id;
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
