const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions")
const isLoggedIn = routeFunctions.isLoggedIn;

router.get("/welcome", (req, res, next) => {
    res.render("pages/welcome", { title: "welcome" });
});

router.post("/welcomeData", (req, res, next) => {
    return db.pool.query(`INSERT INTO user_data (address1, city, state, zipcode, country, sex, birthdate) 
    VALUES ("${req.body.streetAddress}", "${req.body.city}", "${req.body.state}", "${req.body.zipcode}",
    "${req.body.country}", "${req.body.sex}", "${req.body.birthdate}")`, (err, result) => {
        if (err) throw err;
        else res.render("pages/pregame");
    });
});

module.exports = router;