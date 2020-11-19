//declare quiz data after document.ready
var score = 0; 

//grab necessary nodes
const targetUserNameSpan = document.querySelector("#targetUserName");
const nextQ = document.querySelector("#nextQ");
const reset = document.querySelector("#reset");
const displayQuestionNumber = document.querySelector("#questionNumber");
const questionNum = document.querySelector("#questionNumber");
const questionDisplay = document.querySelector("#question");
//grab the spans in each div btn
const btn1 = document.querySelector("#quiz-answer-1")
const btn2 = document.querySelector("#quiz-answer-2")
const btn3 = document.querySelector("#quiz-answer-3")
const btn4 = document.querySelector("#quiz-answer-4")
const btns = document.querySelectorAll("div.square");
const display = document.querySelector(".panel-body")


//grab guess span
const guess = document.querySelector("#guess")

//initialize questionNumber
var questionNumber = 1;

//initialize question array
var questionArray = []
var currentQuestion;

// set question options
var questionOptions; //to be set to db set later

//declare score
var score = 0;

//declare correct answer
var correctAns;

//declare var for if the user has guessed yet
var hasGuessed = false;

var targetUser

//get targetUserData

const getTargetUserData = (data) => {
    if (data.targetUserData) {
        return data.targetUserData
    } else return null
}

const displayTargetUser = (data) => {
    targetUserNameSpan.textContent = data.firstName + " " + data.lastName;
}

//function for creating text content for each question
const displayQuestionOptions = function (data, questionNumber) {
    //get a random num array
    var arr = [];
    while (arr.length < 4) {
        var r = Math.floor(Math.random() * 4);
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    //combine a list of answers from data
    let options = []
    for (let i = 0; i < data.incorrectAnswers.length; i++) {
        options.push(data.incorrectAnswers[i].incorrectAnswer)
    }
    //push on correct answer
    options.push(data.correctAnswer[0][`q${questionNumber}`]); //just changed this
    //assign correctAns to the question correct answer
    correctAns = data.correctAnswer[0][`q${questionNumber}`]

    for (i = 0; i < btns.length; i++) {
        btns[i].textContent = options[arr[i]]
    }
}

function loadQuestionDisplay(questions, questionNumber) {
    questionDisplay.textContent = questions[questionNumber - 1]
}


$(document).ready(() => {

    let ajaxReq; 
    ajaxReq = $.ajax({
        url: "/getFirstQuestionOptions",
        type: 'GET',
        datatype: "json",
        data: "" 
    });

    ajaxReq.done(function (data) {
 
        if (data) {
            console.log(data)
            quizData = data;
            for (let i = 0; i < 10; i++) {
                questionArray.push(quizData.questions[i].question)
            }
            console.log("got questions", questionArray)
            targetUser = getTargetUserData(data);
            //set targetUser info on page
            displayTargetUser(targetUser);
            loadQuestionDisplay(questionArray, questionNumber);
            displayQuestionOptions(quizData, questionNumber);
        }
    });
})


nextQ.addEventListener("click", () => {
    let ajaxReq;
    if (hasGuessed === true) {
        if (questionNumber < 10) {
            questionNumber++
            //request for next set of questions      
            ajaxReq = $.ajax({
                url: "/nextQuestion",
                type: 'GET',
                datatype: "json",
                data: "" 
            });

            ajaxReq.done(function (data) {
                if (data) {
                    console.log(data)
                    quizData = data; //update quizData
                    hasGuessed = false; //reset for next q
                    guess.textContent = "Click an option";
                    guess.classList.add("default")
                    displayQuestionOptions(quizData, questionNumber);
                    loadQuestionDisplay(questionArray, questionNumber);
                    displayQuestionNumber.textContent = questionNumber;
                    display.classList.remove('displayCorrect');
                    display.classList.remove('displayIncorrect');
                    display.classList.add('panel-body');
                }
            });
        } else if (questionNumber >= 10) {
            console.log("we've entered the next stage")
            ajaxReq = $.ajax({
                url: "/postGame?score=" + score,
                type: 'GET',
                datatype: "json",
                data: ""
            });

            ajaxReq.done(function (data) {
                let received = data.includes("/summary")
                if (received) {
                    window.location.replace(`http://localhost:3000${data}`); //sending a new addresss to load
                }
            });
        }
    } else {
        guess.textContent = "Take a guess before moving on"
        guess.classList.add("default") 
    }
})



//event for optional reset button

//reset.addEventListener("click", () => {

//    //reset questionNum and hasGuessed
//    questionNumber = 0;
//    hasGuessed = false;

//    let ajaxReq;
//    ajaxReq = $.ajax({
//        url: "/getFirstQuestionOptions", //name of the route
//        type: 'GET',
//        datatype: "json",
//        data: "" //we're not sending
//    });

//    ajaxReq.done(function (data) {

//        if (data) {
//            console.log(data)
//            quizData = data;
//            guess.textContent = "Select an option"
//            guess.classList.add("default");
//            displayQuestionOptions(quizData, questionNumber);

//        }
//    });
//})


const generateRandomNumber = function (num) {
    return Math.floor(Math.random() * num)
}


function checkAnswer(text) {
    if (text == correctAns) {
        score++;
        guess.textContent = "Correct"
        guess.classList.add("correct");
        display.classList.remove("panel-body")
        display.classList.add("displayCorrect");
    } else {
        guess.textContent = "Incorrect";
        guess.classList.add("incorrect");
        display.classList.remove("panel-body")
        display.classList.add("displayIncorrect");
    }
}


//answering a question events
for (let btn of btns) {
    btn.addEventListener("click", () => {
        if (hasGuessed === false) {
            hasGuessed = true;
            let text = btn.textContent;
            console.log(text)
            checkAnswer(text)
        }
    })
}
