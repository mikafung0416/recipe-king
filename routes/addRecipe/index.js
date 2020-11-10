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


router.post('/', isLoggedIn, async (req, res) => {
    // recipe ID in alphabets
    // let recipeId = '';
    // let ascii = [];
    // for (let i = 97; i < 123; i++) {
    //     ascii.push(i);
    // };
    // for (let i = 0; i < 6; i++) {
    //     recipeId += String.fromCharCode(ascii[Math.floor(Math.random()*26)]); // input to db
    // }
    // recipe ID in int
    let recipeId = Math.floor((Math.random()*100000000));

    let userId = req.session.passport.user; // input to db
    console.log(req.session);
    let recipeName = req.body.dishName; // input to db
    // instructions
    let instruction = req.body.instruction; // input to db
    if (Array.isArray(instruction) === false) {
        instruction = [instruction];
    }
    let instructionJson = JSON.stringify(instruction);
    
    let img = req.body.photo; // input to db
    let time = req.body.time; // input to db
    let servings = req.body.servings; // input to db
    let cuisine = JSON.stringify([req.body.cuisine]); // input to db
    let type = JSON.stringify([req.body.type]); // input to db
    let diet = req.body.diet === 'null' ? null : JSON.stringify([req.body.diet]); // input to db
    
    // ingredients
    let ingredientArr = req.body.ingredient;
    let ingredientArrtoJson = [];
    if (Array.isArray(ingredientArr) === false) {
        let ingredientObj = {};
        ingredientObj['name'] = ingredientArr;
        ingredientArrtoJson.push(ingredientObj);
    } else {
        for (let i = 0; i < ingredientArr.length; i++) {
            let ingredientObj = {};
            ingredientObj['name'] = ingredientArr[i];
            ingredientArrtoJson.push(ingredientObj);
        }        
    }
    let ingredientJson = JSON.stringify(ingredientArrtoJson); // input to db
    
    // equipment
    let equipmentArr = req.body.equipment;
    let equipmentArrtoJson = [];
    if (Array.isArray(equipmentArr) === false) {
        let equipmentObj = {};
        equipmentObj['name'] = equipmentArr;
        equipmentArrtoJson.push(equipmentObj); 
    } else {
        for (let i = 0; i < equipmentArr.length; i++) {
            let equipmentObj = {};
            equipmentObj['name'] = equipmentArr[i];
            equipmentArrtoJson.push(equipmentObj);
        }
    }
    let equipmentJson = JSON.stringify(equipmentArrtoJson); // input to db

    // insert to recipe_cuisine table
    let cuisineId = await db.select('cuisine_id').from('cuisines').where('name', '=', req.body.cuisine);
    await db.insert({
        recipe_id: recipeId,
        cuisine_id: cuisineId[0].cuisine_id
    }).into("recipe_cuisine");

    // insert to recipe_type table
    let typeId = await db.select('type_id').from('types').where('name', '=', req.body.type.toLowerCase());
    await db.insert({
        recipe_id: recipeId,
        type_id: typeId[0].type_id
    }).into("recipe_type");    

    // insert to recipe_diet table
    if (req.body.diet !== 'null') {
        let dietId = await db.select('diet_id').from('diets').where('name', '=', req.body.diet);
        await db.insert({
            recipe_id: recipeId,
            diet_id: dietId[0].diet_id
        }).into("recipe_diet");    
    }


    db.insert({
        recipe_id: recipeId,
        user_id: userId,
        recipe_name: recipeName,
        recipe_instruction: instructionJson,
        recipe_image: img,
        recipe_cooking_time: time,
        servings: servings,
        cuisines: cuisine,
        dishTypes: type,
        diets: diet,
        ingredients: ingredientJson,
        equipment: equipmentJson
    })
    .into('recipes')
    .then(async () => {
        let userId = req.session.passport.user;
    
        // get username
        let usernameArr = await db.select('username').from("users").where("id", "=", userId);
        let username = usernameArr[0]['username'];
        
        // get email address
        let emailArr = await db.select('email').from("users").where("id", "=", userId);
        let email = emailArr[0]['email'];
        
        // get fav cuisine
        let favCuiArr = await db.select('fav_cuisine').from("users").where("id", "=", userId);
        let favCui = favCuiArr[0]['fav_cuisine'];
        
        // get diet
        let dietArr = await db.select('user_diet').from("users").where("id", "=", userId);
        let diet = dietArr[0]['user_diet'];
    
        // get user added recipe
        let userRecipeArr = await db.select('recipe_id', 'recipe_name', 'recipe_image').from('recipes').where("user_id", "=", userId);
        
        // get user fav recipe
        let favByUserArr = await db.select('recipe_id').from('recipe_user').where("user_id", "=", userId); // [{id: 123}, {id: 456}]
        let favArr = [];
        let favItem;
        for (let i = 0; i < favByUserArr.length; i++) {
            favItem = await db.select('recipe_id', 'recipe_name', 'recipe_image').from('recipes').where("recipe_id", "=", favByUserArr[i].recipe_id);
            favArr.push(favItem);
        }
        // console.log(favArr);
    
    
        res.render('profileSuccess',{
            username: username,
            email: email,
            recipeArr: userRecipeArr,
            favCui: favCui,
            diet: diet,
            favArr: favArr
        });
        res.render('profileSuccess');
    })
});


module.exports = router;