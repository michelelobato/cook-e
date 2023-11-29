function login() {
  
  let us = document.getElementById('login_username').value;
  let pw = document.getElementById('login_password').value;

  let data = { username: us, password: pw };
  let p = fetch('/account/login/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });
  //handles response
  p.then((response) => {
    return response.text();
  }).then((text) => {
    console.log(text);
    if (text.startsWith('SUCCESS')) {
      alert(text);
      window.location.href = '/home.html';
      localStorage.setItem("user", us); 
    } else {
      alert('failed');
    }
  });
}


function createAccount() {
  // This function allows the user to create an account
 
  // Get values from input fields
  let name = document.getElementById('name').value;
  let username = document.getElementById('signup_username').value;
  let password = document.getElementById('signup_password').value;
  let phone = document.getElementById('phone').value;
  let email = document.getElementById('email').value;

  // Construct the URL with parameters
  let url = '/account/create?' +
    'name=' + encodeURIComponent(name) +
    '&username=' + encodeURIComponent(username) +
    '&password=' + encodeURIComponent(password) +
    '&phone=' + encodeURIComponent(phone) +
    '&email=' + encodeURIComponent(email);

  // Send the request
  let p = fetch(url);

  // Process the response
  p.then((response) => {
    return response.text();
  }).then((text) => {
    alert(text);
  });
}

function createBusiness(){


}
//Code to get the number of checked stars
let stars = document.getElementsByClassName("star");
let output = document.getElementById("output");

function gfg(n) {
    remove();
    for (let i = 0; i < n; i++) {
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    output.innerText = "Rating is: " + n + "/5";
    localStorage.setItem("number", n);
}

function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}


//Code to post a review
function postReview() {
    let starRating = localStorage.getItem("number");
    let reviewText = document.getElementById('freeform').value;
    let username = localStorage.getItem("user"); //change (used for testing purposes)

    let info = {
        starRating: starRating,
        reviewText: reviewText,
        username: username,
    };

    fetch('/add/review', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
        return response.json();
    })
    .then((text) => {
        console.log(text);
        // window.location.href = 'home.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function createHomepage(){
  

}



/*
TODO Function
add new users
*/


/*
TODO Function
Login users
*/


/*
TODO Function
create restaurant 
*/

/*
TODO Function
build hompage using homepage schema
*/

/*
TODO Function

*/
/*
TODO Function

*/


