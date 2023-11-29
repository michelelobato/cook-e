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


