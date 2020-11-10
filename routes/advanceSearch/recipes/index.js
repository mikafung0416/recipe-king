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
  res.send("Only logged in can come to /advanceSearch/type route");
});

// router.post("/", isLoggedIn, async (req, res) => {
//   //getting the id from the hidden input
//   let id = req.body.idName;

//   //getting the recipe from the database
//   let recipeDetails = await db
//     .select("*")
//     .from("recipes")
//     .where("recipe_id", "=", id);
//   console.log(recipeDetails);

//   //finding paths in db to render to page
//   let recipeName = recipeDetails[0].recipe_name;
//   let recipeImage = recipeDetails[0].recipe_image;
//   let recipeCookingTime = recipeDetails[0].recipe_cooking_time;
//   let dishTypes = recipeDetails[0].dishTypes;
//   let cuisines = recipeDetails[0].cuisines;
//   let ingredients = recipeDetails[0].ingredients;
//   let equipment = recipeDetails[0].equipment;
//   let vegetarian = recipeDetails[0].vegetarian;
//   let vegan = recipeDetails[0].vegan;
//   let glutenFree = recipeDetails[0].glutenFree;
//   let dairyFree = recipeDetails[0].dairyFree;
//   let veryHealthy = recipeDetails[0].veryHealthy;
//   let cheap = recipeDetails[0].cheap;
//   let veryPopular = recipeDetails[0].veryPopular;
//   let sustainable = recipeDetails[0].sustainable;
//   let instructions = recipeDetails[0].recipe_instruction;
//   let nutrition = recipeDetails[0].nutrient;
//   console.log("instructions is below");
//   console.log(instructions);

//   //pushing the ingredient details into the same objects
//   let ingredientDetails = [...ingredients];
//   let ingredientMetricValue = [];
//   let ingredientMetricUnit = [];
//   for (let i = 0; i < ingredients.length; i++) {
//     let ingredientV = ingredients[i].amount.metric.value;
//     let ingredientU = ingredients[i].amount.metric.unit;
//     ingredientMetricValue.push(ingredientV);
//     ingredientMetricUnit.push(ingredientU);
//     ingredientDetails[i].value = ingredientMetricValue[i];
//     ingredientDetails[i].unit = ingredientMetricUnit[i];

//     let cap =
//       ingredientDetails[i].name.charAt(0).toUpperCase() +
//       ingredientDetails[i].name.slice(1);
//     ingredientDetails[i].name = cap;
//   }
//   // console.log(instructions);

//   //render to page
//   res.render("advanceRecipeDisplay", {
//     recipeName,
//     recipeImage,
//     recipeCookingTime,
//     dishTypes,
//     cuisines,
//     ingredients,
//     equipment,
//     vegetarian,
//     vegan,
//     glutenFree,
//     dairyFree,
//     veryHealthy,
//     cheap,
//     veryPopular,
//     sustainable,
//     instructions,
//     nutrition,
//   });
// });

// here
router.post("/", isLoggedIn, async (req, res) => {
  //getting user data for comments
  let userId = req.session.passport.user;
  // console.log(userId)

  let userDetails = await db
    .select("id", "username")
    .from("users")
    .where("id", "=", userId);
  // console.log(userDetails)

  let userID = userDetails[0].id;
  let username = userDetails[0].username;
  // console.log(username);

  //getting the id from the hidden input
  let id = req.body.idName;
  // let id = 'wcykio'; // wcykio || 644826
  // let regex = /^[a-z]+$/;
  //getting the recipe from the database
  let recipeDetails = await db
    .select("*")
    .from("recipes")
    .where("recipe_id", "=", id);

  // this is to check if user has signed in: undefined means not signed in
  // to decide whether or not to render nutrition info, nav bar and favourite function
  // let userId = req.body;
  // console.log(userId);

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
  let user_id = recipeDetails[0].user_id;
  // console.log(recipeDetails)

  if (id.toString().length === 8) {
    // user added recipe rendering- since we use letters for user added recipes we can check for them

    let getUsername = await db
    .select('username')
    .from ('users')
    .where('id', '=', user_id);
    
    let madeByUsername = getUsername[0].username;

    res.render("advanceRecipeDisplayUser", {
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
      userID,
      username,
      madeByUsername
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
    // console.log(instructions);

    //render to page
    res.render("advanceRecipeDisplay", {
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
      userID,
      username,
    });
  }
});



module.exports = router;

