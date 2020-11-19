const express = require("express");
const router = express.Router();
const db = require("../controller/db");

module.exports.isLoggedIn = function (req, res, next) {
    if (req.session.currentUser) {
        next();
    } else res.redirect("/login")
}

module.exports.alreadyLoggedIn = function (req, res, next) {
    if (req.session.currentUser) {
        res.redirect("/home")
    } else next()
}

/*module.exports.hasPlayedRound = function (req, res, next) {
    if (req.session.quiz.complete) {
        next()
    } else res.redirect("/home");
}*/ //this doesn't work since we're not getting access to .complete in the backend at an appropriate time