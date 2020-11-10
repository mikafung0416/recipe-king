const express = require("express");
const db = require("../../database");

const router = express.Router();
router.use(express.json());

// adding in user added recipe rendering, for easier merging hopefully

router.post("/", async (req, res) => {
  //getting the id from the hidden input
  let id = req.body.idName;
  // let id = 'wcykio'; // wcykio || 644826
  // let regex = /^[a-z]+$/;
  //getting the recipe from the database
  let recipeDetails = await db
    .select("*")
    .from("recipes")
    .where("recipe_id", "=", id);

  //finding paths in db to render to page
  let recipeID = recipeDetails[0].recipe_id;
  let recipeName = recipeDetails[0].recipe_name;
  let recipeImage = recipeDetails[0].recipe_image;
  let recipeCookingTime = recipeDetails[0].recipe_cooking_time;
  let dishTypes = recipeDetails[0].dishTypes;
  let cuisines = recipeDetails[0].cuisines;
  let ingredients = recipeDetails[0].ingredients;
  let equipment = recipeDetails[0].equipment;
  let instructions = recipeDetails[0].recipe_instruction;
  let vegetarian = recipeDetails[0].vegetarian;
  let vegan = recipeDetails[0].vegan;
  let glutenFree = recipeDetails[0].glutenFree;
  let dairyFree = recipeDetails[0].dairyFree;
  let veryHealthy = recipeDetails[0].veryHealthy;
  let cheap = recipeDetails[0].cheap;
  let veryPopular = recipeDetails[0].veryPopular;
  let sustainable = recipeDetails[0].sustainable;

  if (id.toString().length === 8) {
    // user added recipe rendering
    console.log('this is an user added recipe');
    res.render("recipeDisplayUser", {
      recipeID,
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
  } else {
    //finding paths in db to render to page
    let nutrition = recipeDetails[0].nutrient;
    // console.log("instructions is below");
    // console.log(instructions);

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
    console.log('this is an api recipe');

    //render to page
    res.render("recipeDisplay", {
      recipeID,
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
      nutrition,
    });
  }
});

module.exports = router;
