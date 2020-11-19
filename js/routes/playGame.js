const express = require("express");
const router = express.Router();
const db = require("../controller/db")
const routeFunctions = require("./routeFunctions")
const isLoggedIn = routeFunctions.isLoggedIn;

router.get("/playGame", isLoggedIn, (req, res, next) => {
    res.render("pages/playGame", { title: "playGame" });
});

router.post("/questionaire", isLoggedIn, (req, res, next) => {
    
    return db.pool.query(`INSERT INTO quiz_data (firstName, lastName, email, password) 
    VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.password}")`, (err, result) => {
        if (err) throw err;
        else res.render("pages/postgame");
    });
});


router.get("/getFirstQuestionOptions", (req, res, next) => {
    //testing profile - remove if necessary
    if (!req.session.targetPerson) {
        req.session.targetPerson = 2
    }

    //check if quiz exists in session
    if (!req.session.quiz) {
        req.session.quiz = {};
        req.session.quiz.questionNum = 0;
    } else req.session.quiz.questionNum = 0; //everytime we need to reset
    //increment question number
    req.session.quiz.questionNum++
    //modified from creating an object to send to passing data into req.session.quiz
    return db.pool.query(`SELECT * FROM incorrect_answers WHERE questionNum = ${req.session.quiz.questionNum}`, (err, result) => {
        if (err) {
            throw err;
        } else
            req.session.quiz.incorrectAnswers = result; //should this be changed to req.session.incorrectAnswers?
        return db.pool.query(`SELECT * FROM questions WHERE question_set = 1`, (err, result) => {
            if (err) {
                throw err;
            } else req.session.quiz.questions = result;
            console.log(req.session.quiz) 
            return db.pool.query(`SELECT * FROM questionaire WHERE userId = ${req.session.targetPerson}`, (err, result) => {
                if (err) {
                    throw err;
                } else req.session.quiz.correctAnswer = result;
                console.log(req.session.quiz) 
                res.send(req.session.quiz)
            })
        })
    })
});

//get questions after the first question
router.get("/nextQuestion", (req, res, next) => {
    //check to see if the questions have reached 11
    if (req.session.quiz.questionNum >= 11) {
        res.redirect("pages/summary");
    } else
    req.session.quiz.questionNum++; //do before we get next current question
    console.log(req.session.quiz.questionNum) //check current question

        //modified from creating an object to send to passing data into req.session.quiz
        return db.pool.query(`SELECT * FROM incorrect_answers WHERE questionNum = ${req.session.quiz.questionNum}`, (err, result) => {
            if (err) {
                throw err;
            }
            req.session.quiz.incorrectAnswers = result;
            console.log(req.session.quiz) 
            res.send(req.session.quiz);
        });
});


module.exports = router;
