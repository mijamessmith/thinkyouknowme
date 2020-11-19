const express = require("express");
const router = express.Router();
const db = require("../controller/db");
const routeFunctions = require("./routeFunctions")
const isLoggedIn = routeFunctions.isLoggedIn;

router.get("/pregame", isLoggedIn, (req, res, next) => {
    res.render("pages/pregame", { title: "pregame" });
});

router.post("/questionaire", (req, res, next) => {
    //find location of userId
    var user
    if (req.session.currentUserId) {
        user = req.session.currentUserId
    } else if (req.session.userData.userId) {
        user = req.session.userData.userId
    }
   
    return db.pool.query(`INSERT INTO questionaire (userId, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) 
    VALUES ("${user}", "${req.body.q1}", "${req.body.q2}", "${req.body.q3}", "${req.body.q4}", "${req.body.q5}",
            "${req.body.q6}", "${req.body.q7}", "${req.body.q8}", "${req.body.q9}", "${req.body.q10}")`,
        (err, result) => {
            if (err) throw err;
            else res.render("pages/home");
        });
});

module.exports = router;
