const passport = require('passport');
const express = require("express");
const router = express.Router();
const db = require("../../database");

const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/sign-in');
}
router.get('/', isLoggedIn, (req, res) => {
    res.render("addRecipe", {
        cuisineList: cuisineList,
        dietList: dietList,
        typeList: typeList
    });
});


router.post('/', isLoggedIn, (req, res) => {
    // recipe ID in alphabets
    let recipeId = '';
    let ascii = [];
    for (let i = 97; i < 123; i++) {
        ascii.push(i);
    };
    for (let i = 0; i < 6; i++) {
        recipeId += String.fromCharCode(ascii[Math.floor(Math.random()*26)]); // input to db
    }
    // recipe ID in int
    // let recipeId = Math.floor((Math.random()*10000000));

    let userId = req.session.passport.user; // input to db
    let recipeName = req.body.dishName; // input to db
    let instruction = req.body.instruction; // input to db
    // image
    let time = req.body.time; // input to db
    let servings = req.body.servings; // input to db
    let cuisine = JSON.stringify([req.body.cuisine]); // input to db
    let type = JSON.stringify([req.body.type]); // input to db
    let diet = req.body.diet === 'null' ? null : JSON.stringify([req.body.diet]); // input to db
    // ingredients
    let ingredientArr = req.body.ingredient;
    let ingredientObj = {};
    let ingredientArrtoJson = [];
    for (let i = 0; i < ingredientArr.length; i++) {
        ingredientObj[i] = ingredientArr[i];
    }
    ingredientArrtoJson.push(ingredientObj);
    let ingredientJson = JSON.stringify(ingredientArrtoJson); // input to db
    // equipment
    let equipmentArr = req.body.equipment;
    let equipmentObj = {};
    let equipmentArrtoJson = [];
    for (let i = 0; i < equipmentArr.length; i++) {
        equipmentObj[i] = equipmentArr[i];
    }
    equipmentArrtoJson.push(equipmentObj);
    let equipmentJson = JSON.stringify(equipmentArrtoJson); // input to db
    
    db.insert({
        recipe_id: recipeId,
        user_id: userId,
        recipe_name: recipeName,
        recipe_instruction: instruction,
        recipe_image: null,
        recipe_cooking_time: time,
        servings: servings,
        cuisines: cuisine,
        dishTypes: type,
        diets: diet,
        ingredients: ingredientJson,
        equipment: equipmentJson
    })
    .into('recipes')
    .then(() => {
        res.send('posting from add recipe page');
    })
});

// router.get('/img64', (req, res) => {
//     res.send(req.body);

// })

module.exports = router;