const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions")
const isLoggedIn = routeFunctions.isLoggedIn;

router.get("/summary", isLoggedIn, (req, res, next) => {
    let score = req.query.score;
    res.render("pages/summary", { message: `${score}` });
});

router.get("/postGame", (req, res, next) => {
    let score = req.query.score;
    return db.pool.query(`INSERT INTO user_scores (userId, score, targetUser, question_set) VALUES ("${req.session.currentUserId}", "${score}", "${req.session.targetPerson}", "1")`, function (err, result) {
        if (err) {
            throw err;
        } else {
            req.session.score = score
            res.send(`/summary?score=${score}`)
        } 
     });
})


module.exports = router;