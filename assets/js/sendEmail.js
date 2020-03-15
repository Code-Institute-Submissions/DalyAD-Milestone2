//function to send emails through emailJS
//template used from CI tutorials
function sendMail(contactForm) {
    emailjs.send("gmail", "milestone2", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "feedback": contactForm.feedback.value
    })
        .then(
            function (response) {
                console.log("SUCCESS", response);
            },
            function (error) {
                console.log("FAILED", error);
            }
        );
    return false;
}

//alerts user that form has been sent when button is clicked
document.getElementById('formButton').onclick = function () {
    alert("Thanks for getting in touch!");
};

