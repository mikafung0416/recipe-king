const passport = require('passport');
const express = require("express");
const router = express.Router();

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
    console.log(req.body.recipeImg); // file name
    console.log(req.session);
    // recipe id with alphabets only
    let userId = req.session.passport.user;
    let recipeName = req.body.dishName;
    // instructions
    // image
    let time = req.body.time;
    let servings = req.body.servings;
    let cuisine = JSON.stringify([req.body.cuisine]);
    let type = JSON.stringify([req.body.type]);
    let diet = req.body.diet === 'null' ? null : JSON.stringify([req.body.diet]);
    // ingredients
    // equipment






    res.send('posting from add recipe page');
});

module.exports = router;