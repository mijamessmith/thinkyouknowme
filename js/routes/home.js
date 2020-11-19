const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions")
const isLoggedIn = routeFunctions.isLoggedIn;


router.get("/home", isLoggedIn, (req, res, next) => {
    res.render("pages/home", { title: "home" });
});


router.get("/home/:id", (req, res) => {
    //find if id exists
    const found = users.some(user => user.id === parseInt(req.params.id));
    if (!found) {
        res.status(400).json({ msg: `id ${req.params.id} not found` });
    }
    res.json(users.filter(member => member.id === parseInt)(req.params.id));
})

router.get("/getPerson", (req, res) => {
    console.log(req.query.email); 
    return db.pool.query(`SELECT * FROM user_data WHERE email = "${req.query.email}"`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            var targetPerson = result[0].userId;
            req.session.targetPerson = targetPerson;

            //create a place for all userData of targeted email
            if (req.session.quiz) {
                req.session.quiz.targetUserData = result[0];
            } else req.session.quiz = {};
            req.session.quiz.targetUserData = result[0];
            console.log(req.session.quiz.targetUserData);
            res.send("/playGame");
        } else
            res.send("Not a registered email");
    })
})

module.exports = router;