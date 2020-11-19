const attempts = document.querySelector("#attempts")
const average = document.querySelector("#average")
const high = document.querySelector("#high")
const low = document.querySelector("#low")
const userName = document.querySelector("h1");

var stats;
var user;

$(document).ready(() => {
    let ajaxReq; 
    ajaxReq = $.ajax({
        url: "/getStats", 
        type: 'GET',
        datatype: "json",
        data: "" 
    });

    ajaxReq.done(function (data) {
     
        if (data) {
            console.log(data)
            user = data;
            stats = data.stats;
            //sets user name in the jumbotron
            userName.textContent = data.firstName + " " + data.lastName;
            //adjust on page stats
            attempts.textContent = stats.length;

            let totalScore = 0;
            
            let scoreArr = []
            for (let s = 0; s < stats.length; s++) {
                totalScore += stats[s].score;
                scoreArr.push(stats[s].score);
            }
         
            let averageScore = totalScore / stats.length;
                
            average.textContent = averageScore;
            
            let highScore = Math.max(...scoreArr);

            high.textContent = highScore;
       
            let lowScore = Math.min(...scoreArr);

            low.textContent = lowScore;
        }
    });
})