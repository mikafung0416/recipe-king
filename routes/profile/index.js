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

router.get('/', isLoggedIn, async (req, res) => {
    // get userID
    let userId = req.session.passport.user;
    // get username
    let usernameArr = await db.select('username').from("users").where("id", "=", userId);
    let username = usernameArr[0]['username'];
    // get email address
    let emailArr = await db.select('email').from("users").where("id", "=", userId);
    let email = emailArr[0]['email'];
    // get user added recipe
    let userRecipeArr = await db.select('recipe_name', 'recipe_image').from('recipes').where("user_id", "=", userId);
    // get user fav recipe
    let favByUserArr = await db.select('recipe_id').from('recipe_user').where("user_id", "=", userId); // [{id: 123}, {id: 456}]
    let favIdArr = [];
    favByUserArr.forEach(id => {
        favIdArr.push(id.recipe_id);
    })
    let favFinal = [];
    favIdArr.forEach(id => {
        let item = db.select('recipe_name', 'recipe_image').from('recipes').where("recipe_id", "=", id);
        let obj = {};
        // obj.recipe_name = item
    })

    res.render('profile',{
        username: username,
        email: email,
        recipeArr: userRecipeArr
    });
});

module.exports = router;