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
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY5}&type=${type}&number=2`;
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
    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);
    // console.log(countryCapitalized);
    let totalRecipes;
    console.log(country.toLowerCase());

    let dbRecipes = [];
    //if database is not found , then render the api to user, and insert the information into db
    let typeData = await db
      .select("*")
      .from("types")
      .where("name", "=", country.toLowerCase());
    let typeId = typeData[0].type_id; //get Thai cuisine ID = 23
    // console.log(cuisineId); //this works

    let recipeTypeData = await db
      .select("*")
      .from("recipe_type")
      .where("type_id", "=", typeId);
    console.log(`recipeTypeData is below`);
    console.log(recipeTypeData); //find if any information in recipe_cuisine table

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
      recipes: dbRecipes, //Result from API
      broadType: "Type",
      specificType: country,
      numberOfRecipes: dbRecipes.length,
      queryList: typeList,
      otherBroadType1: "Diet",
      otherBroadType1List: dietList,
      otherBroadType2: "Cuisine",
      otherBroadType2List: cuisineList,
      totalRecipes: "",
      showingOtherBroadType: "",
      showingOtherSpecificType: "",
    });
  } catch (err) {
    next(err);
  }
});

//Range bar for numbre of recipes of type
router.post("/:typeName/number", async (req, res, next) => {
  try {
    const country = req.params.typeName;
    let numOfRecipes = parseInt(req.body.numberOfRecipes);
    console.log(numOfRecipes);
    let dbRecipes = [];

    const countryCapitalized =
      country.charAt(0).toUpperCase() + country.slice(1);

    //if database is not found , then render the api to user, and insert the information into db
    let typeData = await db
      .select("*")
      .from("types")
      .where("name", "=", country.toLowerCase());
    let typeId = typeData[0].type_id; //get Thai cuisine ID = 23

    let recipeTypeData = await db
      .select("recipe_id")
      .from("recipe_type")
      .where("type_id", "=", typeId);
    console.log("Below is the recipeTypeData");
    console.log(recipeTypeData.length);
    console.log(typeof numOfRecipes);

    if (numOfRecipes >= recipeTypeData.length) {
      console.log("request number is larger than total data in db");
      for (let i = 0; i < recipeTypeData.length; i++) {
        let eachRecipeId = recipeTypeData[i].recipe_id;
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
        broadType: "Type",
        specificType: country,
        numberOfRecipes: dbRecipes.length,
        queryList: typeList,
        otherBroadType1: "Diet",
        otherBroadType1List: dietList,
        otherBroadType2: "Cuisine",
        otherBroadType2List: cuisineList,
        totalRecipes: "",
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
      });
    } else {
      console.log("request num is less than the total data in db");
      for (let i = 0; i <= numOfRecipes; i++) {
        let eachRecipeId = recipeTypeData[i].recipe_id;
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
      res.render("display", {
        recipes: dbRecipes,
        broadType: "Type",
        specificType: country,
        numberOfRecipes: dbRecipes.length,
        queryList: typeList,
        otherBroadType1: "Diet",
        otherBroadType1List: dietList,
        otherBroadType2: "Cuisine",
        otherBroadType2List: cuisineList,
        totalRecipes: "",
        showingOtherBroadType: "",
        showingOtherSpecificType: "",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
