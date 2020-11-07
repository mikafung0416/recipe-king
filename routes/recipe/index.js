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
  let vegetarian = recipeDetails[0].vegetarian;
  let vegan = recipeDetails[0].vegan;
  let glutenFree = recipeDetails[0].glutenFree;
  let dairyFree = recipeDetails[0].dairyFree;
  let veryHealthy = recipeDetails[0].veryHealthy;
  let cheap = recipeDetails[0].cheap;
  let veryPopular = recipeDetails[0].veryPopular;
  let sustainable = recipeDetails[0].sustainable;
  let instructions = recipeDetails[0].recipe_instruction;
  console.log("instructions is below");
  console.log(instructions);

  //pushing the ingredient details into the same objects
  let ingredientDetails = [...ingredients];
  let ingredientMetricValue = [];
  let ingredientMetricUnit = [];
  for (let i = 0; i < ingredients.length; i++) {
    let ingredientV = ingredients[i].amount.metric.value;
    let ingredientU = ingredients[i].amount.metric.unit;
    ingredientMetricValue.push(ingredientV);
    ingredientMetricUnit.push(ingredientU);
    ingredientDetails[i].value = ingredientMetricValue[i];
    ingredientDetails[i].unit = ingredientMetricUnit[i];

    let cap =
      ingredientDetails[i].name.charAt(0).toUpperCase() +
      ingredientDetails[i].name.slice(1);
    ingredientDetails[i].name = cap;
  }
  // console.log(instructions);

  //render to page
  res.render("recipeDisplay", {
    recipeName,
    recipeImage,
    recipeCookingTime,
    dishTypes,
    cuisines,
    ingredients,
    equipment,
    vegetarian,
    vegan,
    glutenFree,
    dairyFree,
    veryHealthy,
    cheap,
    veryPopular,
    sustainable,
    instructions,
  });
});

module.exports = router;