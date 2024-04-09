// contact me
// 89C89267B4F9D1094C7F3F3AD1420F7374FC
document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("contact-submit");
  const form = document.getElementById("contact-form");

  submit.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission

    contactMe();

    // if (isValid()) {
    //   contactMe();
    // } else {
    //   alert("Please fill in all the fields correctly.");
    // }
  });
});

function contactMe() {
  var userName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  console.log(
    document.getElementById("name").value +
      document.getElementById("email").value +
      document.getElementById("message").value
  );
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "hessnt30@vt.edu",
    Password: "89C89267B4F9D1094C7F3F3AD1420F7374FC",
    To: "hessnt30@vt.edu",
    From: email,
    Subject: "MovieFinder Contact - " + userName,
    Body: "From " + userName + "\n" + message,
  }).then((message) => alert(message));
}

function isNotEmpty(value) {
  if (value == null || typeof value == "undefined") return false;

  return value.length > 0;
}

function isEmail(email) {
  let regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(String(email).toLowerCase());
}

function isValid() {
  var userName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  return (
    isNotEmpty(userName) &&
    isNotEmpty(email) &&
    isNotEmpty(message) &&
    isEmail(email)
  );
}
