const express = require("express");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");
// const { route } = require("../diet");

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  //getting the id from the hidden input
  let id = req.body.idName;

  //getting the recipe from the database
  let recipeDetails = await db
    .select("*")
    .from("recipes")
    .where("recipe_id", "=", id);
  console.log(recipeDetails);

  //finding paths in db to render to page
  let recipeName = recipeDetails[0].recipe_name;
  let recipeImage = recipeDetails[0].recipe_image;
  let recipeCookingTime = recipeDetails[0].recipe_cooking_time;
  let dishTypes = recipeDetails[0].dishTypes;
  let cuisines = recipeDetails[0].cuisines;
  let ingredients = recipeDetails[0].ingredients;
  let equipment = recipeDetails[0].equipment;
  //   console.log(equipment)

  let ingredientMetric = [];
  for (let i = 0; i < ingredients.length; i++) {
    let ingredientM = ingredients[i].amount.metric.value;
    ingredientMetric.push(ingredientM);
  }
  // console.log(ingredientMetric)

  res.render("recipeDisplay", {
    recipeName: recipeName,
    recipeImage: recipeImage,
    recipeCookingTime: recipeCookingTime,
    dishTypes: dishTypes,
    cuisines: cuisines,
    ingredients: ingredients,
    metric: ingredientMetric,
    equipment: equipment,
  });
});

module.exports = router;
