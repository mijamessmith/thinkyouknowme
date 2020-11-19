const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions");
const isLoggedIn = routeFunctions.isLoggedIn;

router.get("/stats", isLoggedIn, (req, res, next) => {
    res.render("pages/stats");
})


router.get("/getStats", isLoggedIn, (req, res, next) => {
    return db.pool.query(`SELECT * FROM user_scores WHERE userId = ${req.session.currentUserId}`, function (err, result) {
        if (err) {
            throw err;
        } else {
            req.session.currentUser[0].stats = result;
            res.send(req.session.currentUser[0]);
        }
    });
})


module.exports = router;