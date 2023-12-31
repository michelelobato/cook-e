function login() {
  //This function logs in the user. Checks if the account is in the database
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
        localStorage.setItem('user', us);
        alert(text);
        window.location.href = 'Buissness.html';
      } else {
        alert('failed');
      }
    });
  }
  
  function createAccount() {
  // This functions creates an account for the user.
  // Sends name, username, password, email and phone number to database
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
  // source: https://www.geeksforgeeks.org/star-rating-using-html-css-and-javascript/
  let stars = document.getElementsByClassName("star");
  let output = document.getElementById("output");
  
  function gfg(n) {
  //calculates the number of selected star for the rating
  // source: https://www.geeksforgeeks.org/star-rating-using-html-css-and-javascript/
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
  //source: https://www.geeksforgeeks.org/star-rating-using-html-css-and-javascript/
      let i = 0;
      while (i < 5) {
          stars[i].className = "star";
          i++;
      }
  }
  
  
  function postReview() {
  //code to post a review
      let business = localStorage.getItem('business');
      let starRating = localStorage.getItem('number');
      let reviewText = document.getElementById('freeform').value;
      let username = localStorage.getItem('user'); 
      
      //Calculates the timestamp for the review
      let currentDate = new Date();
      let formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  
      let info = {
          business: business,
          starRating: starRating,
          reviewText: reviewText,
          username: username,
          createdAt: formattedDate, // Includes the formatted date and time
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
          getAllReviews(); 
           })
      .catch((error) => {
          console.error('Error:', error);
      });
  }
  function createBusiness() {
    let name = document.getElementById('BName').value;
    let username = document.getElementById('BUsername').value;
    let password = document.getElementById('BPassword').value;
    let phone = document.getElementById('BPhone').value;
    let email = document.getElementById('BEmail').value;
    let address = document.getElementById('BAddress').value;
    let website = document.getElementById('BWebsite').value;
    let restaurantTagline = document.getElementById('BTagline').value;
    let dishList1 = document.getElementById('BDishList1').value;
    let dishList2 = document.getElementById('BDishList2').value;
    let dishList3 = document.getElementById('BDishList3').value;
    let openingHours = document.getElementById('BOpeningHours').value;
  
    let Bdata = {
      name: name,
      username: username,
      password: password,
      phone: phone,
      email: email,
      address: address,
      website: website,
      restaurantTagline: restaurantTagline,
      dishList1: dishList1,
      dishList2: dishList2,
      dishList3: dishList3,
      openingHours: openingHours,
    };
  
    fetch('/business/create', {
      method: 'POST',
      body: JSON.stringify(Bdata),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.text())
    .then(text => {
      if (text.startsWith('SUCCESS')) {
        alert('Creation successful');
        window.location.href = '/index.html';
      } else {
        alert('Creation failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred during creation');
    });
  }
  
  
  
  
  
  localStorage.setItem('business', 'test'); //CHANGE< USING FOR TESTING PURPOSES
  
  function getAllReviews() {
      let business = localStorage.getItem('business');
  
      fetch(`/get/reviews/${business}`, {  // search specific business name
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
          return response.json();
      })
      .then((reviews) => {
          const postRating = document.getElementById('postRating');
          postRating.innerHTML = ''; // Clear existing reviews
          // puts newest reviews on top
          reviews.reverse();
  
          // Loop through reviews
          reviews.forEach((review) => {
              const reviewDiv = document.createElement('div');
              const starsDiv = document.createElement('div');
              starsDiv.className = 'stars';
  
              // Gets the review's starRating
              for (let i = 0; i < review.starRating; i++) {
                  const starSpan = document.createElement('span');
                  starSpan.className = 'yellow-star';
                  starSpan.innerHTML = '★';
                  starsDiv.appendChild(starSpan);
              }
              const detailsDiv = document.createElement('div');
              const usernameDisplay = review.username ? `<strong>${review.username}</strong>` : 'Anonymous';
              
              detailsDiv.innerHTML = `<p><strong>${usernameDisplay}</strong> - ${review.starRating}/5<br>${review.reviewText}<br>${formatDate(review.createdAt)}</p>`;
              reviewDiv.appendChild(starsDiv);
              reviewDiv.appendChild(detailsDiv);
              postRating.appendChild(reviewDiv);
          });
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }
  
  function formatDate(dateString) {
  // gets the formatted date
      const options = {
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true, 
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  window.onload = function() {
      getAllReviews();
  };
  
  function changeRestaurant() {
  //changes the business name on the review page
    var restaurantTitleElement = 'CHANGE';
    if (restaurantTitleElement) {
      restaurantTitleElement.innerHTML = "Reviews for " + generateRandomRestaurantName();
    } else {
      console.error("Element with id 'restaurantTitle' not found.");
    }
  }
  
  window.onload = changeRestaurant;
  
  
  window.onload = function(){
    createHomePage();
  };
  
  function createHomePage(){
    let container = document.getElementById('restaurantContainer');
    
    
    fetch('/get/businesses/', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    .then((response)=>{
      return response.json();
    })
    .then((businessList) =>{
      console.log(businessList);
    })
  };
  
  
  function createHomePage() {
    let container = document.getElementById('restaurantContainer');
  
    fetch('/get/businesses/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        return response.json();
      })
      .then((businessList) => {
        console.log(businessList);
  
        // Clear existing content in the container
        container.innerHTML = '';
  
        // Loop through the businessList and create buttons
        businessList.forEach((business) => {
          const button = document.createElement('button');
          button.innerText = business.name;
          button.addEventListener('click', () => {
            // Set the selected business in localStorage
            localStorage.setItem('business', business.name);
            // Redirect to the business page
            window.location.href = 'template.html';
          });
  
          // Append the button to the container
          container.appendChild(button);
        });
      });
  }
  
  // Call the createHomePage function when the window loads
  window.onload = function () {
    createHomePage();
  };
  
  