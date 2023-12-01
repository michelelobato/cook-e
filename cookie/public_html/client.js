function login() {
  let us = document.getElementById('login_username').value;
  let pw = document.getElementById('login_password').value;
  let data = {username: us, password: pw};
  let p = fetch( '/account/login/', {
    method: 'POST', 
    body: JSON.stringify(data),
    headers: {"Content-Type": "application/json"}
  });
  p.then((response) => {
    return response.text();
  }).then((text) => {
    console.log(text);
    if (text.startsWith('SUCCESS')) {
      alert(text);
      window.location.href = 'index.html';
    } else {
      alert('failed');
    }
  });
}

function createAccount() {
  let name = document.getElementById('name').value;
  let us = document.getElementById('signup_username').value;
  let pw = document.getElementById('signup_password').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;

  let data = {
    username: us,
    password: encodeURIComponent(pw),
    name: name,
    email: email,
    phone: phone
  };
  let p = fetch('/account/create', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });

  p.then((response) => {
    return response.text();
  }).then((text) => {
    alert(text);
  });
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


function createBusiness(){
  
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
      window.location.href = '/Buissness.html';
    } else {
      alert('failed');
    }
  });

  let name = document.getElementById('BName').value;
  let username = document.getElementById('BUsername').value;
  let password = document.getElementById('BPassword').value;
  let menu = document.getElementById('"Bmenu').value;
  let image = document.getElementById('BImages').value;
  let phone = document.getElementById('BPhone').value;
  let email = document.getElementById('BEmail').value;
  let address = document.getElementById('BAddress').value;
  let website = document.getElementById('BWebsite').value;
  let logo = document.getElementById('BLogo').value;

  let Bdata = { BName: name, username: username, password: password,
       menu: menu, image: image, phone: phone, email: email, address: address,
      website: website, logo: logo };
        
  fetch('/create/business', {
      method: 'POST',
      body: JSON.stringify(Bdata),
      headers: { "Content-Type": "application/json" }
  })
  .then(response => {
      return response.text();
  })
  .then(text => {
      if (text.startsWith('SUCCESS')) {
          alert('creation successful');
          window.location.href = '/home.html';
      } else {
          alert('login failed');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('An error occurred during login');
  });
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


