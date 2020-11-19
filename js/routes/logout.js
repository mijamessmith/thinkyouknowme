const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions")
const isLoggedIn = routeFunctions.isLoggedIn;

router.get("/logout", isLoggedIn, (req, res, next) => {

    req.session.destroy(); //Kill Session
    console.log(req.session)
    res.render("pages/logout", { title: "logout" });
});

module.exports = router;