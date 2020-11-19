const readyPlay = document.querySelector("#readyPlay");
const messagePlay = document.querySelector(".messagePlay")
const inviteBtn = document.querySelector(".invite-btn");
const inviteMessage = document.querySelector(".inviteMessage");


const checkValidEmailAddress = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

readyPlay.addEventListener("click", function (event) {
    event.preventDefault()
    console.log("Home Button has been clicked")
    var searchedEmail = document.querySelector("#emailToSearch").value

    var validEmail = checkValidEmailAddress(searchedEmail);
    if (validEmail) {

        let ajaxReq;
        ajaxReq = $.ajax({
            url: '/getPerson?email=' + searchedEmail,
            type: 'GET',
            datatype: "json",
            data: ""
        });

        ajaxReq.done(function (data) {
            if (data == "/playGame") {
                window.location.replace(`http://localhost:3000${data}`); //sending a new addresss to load
            }
        });
    } else messagePlay.textContent = "Not a valid email address"
});

inviteBtn.addEventListener("click", () => {
    event.preventDefault();
    var inviteEmailAddress = document.querySelector(".invite-field").value
    let isValidEmail = checkValidEmailAddress(inviteEmailAddress);
    if (isValidEmail) {
        $(".inviteMessage").empty();
        var email = inviteEmailAddress;
        var subject = "You're wanted!"
        var emailBody = `Dear ${inviteEmailAddress}, you have an invitation to play against a friend on
        "Think You Know Me?" Click the link below to accept their challenge.
         https://thinkyouknowme.com`;
        document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBody

    } else {
        inviteMessage.textContent = "Enter a valid email address"
    }
})