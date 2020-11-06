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
    res.send('posting from add recipe page');
});

module.exports = router;