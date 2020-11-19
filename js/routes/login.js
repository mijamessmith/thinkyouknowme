const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions");
const isLoggedIn = routeFunctions.isLoggedIn;
const alreadyLoggedIn = routeFunctions.alreadyLoggedIn

router.get("/login", (req, res, next) => {
    var message = req.message;
    res.render("pages/login", { title: "login" });
});


router.post("/logUserIn", alreadyLoggedIn, async (req, res, next) => {
    var message;
    console.log(`Sent in a post using email: ${req.body.email} and password: ${req.body.password}.`)
    try {
            if (!req.body.email || !req.body.password) { // I want this to change the h5 in on the page to read the message
                message = "Please enter an email and password";
                console.log(`Missing email and/or password`)
                res.status(400).render("pages/login", { message: message }) //should we be returing?
            } else
            db.pool.query(`SELECT * FROM user_data WHERE email = "${req.body.email}" AND password = "${req.body.password}"`, (error, results) => {
                if (error) {
                    console.log(error);
                } else if (results.length === 0) {
                    message = { message: "The email or password is incorrect" }
                    console.log(message);
                    res.status(401).render("pages/login", message)
                } else if (results.length > 0) {
                    var message = { message: `Logged in under ${req.body.email}` }
                    req.session.currentUser = results;
                    req.session.currentUserId = results[0].userId;
                    console.log(req.session.currentUser, req.session.currentUserId)
                    res.render("pages/home", message);
                }
            })
        } catch (error) {
            console.log(error)
        }
})

router.post("/register", (req, res, next) => {
    var newUser = req.body.query
    //save email for return query 
    var newUserEmail = req.body.email;
    return db.pool.query(`INSERT INTO user_data (firstName, lastName, email, password) 
    VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.password}")`, (err, result) => {
            if (err) throw err;
            //maybe query again to set this info into the session?
            else return db.pool.query(`SELECT * from user_data WHERE email = "${newUserEmail}"`,
                (err, result) => {
                    if (err) throw err;
                    if (result.length) {
                        req.session.userData = result[0];
                        res.render("pages/welcome");
                    }
                });
    });

});

module.exports = router;

