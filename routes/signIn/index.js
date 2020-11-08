const passport = require('passport');
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('signIn');
});

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/error'
}));

module.exports = router;