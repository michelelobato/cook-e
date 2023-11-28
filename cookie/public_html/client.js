const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');

//TODO fix this connection string
const connection_string = 'mongodb://127.0.0.1/temporary';

mongoose.connect(connection_string);
mongoose.connection.on('error', () => {
  console.log('There was a problem connecting to mongoDB');
});

var UserSchema = new mongoose.Schema({
        fullname: String,
        username: String,
        passwordHash: String,
        phoneNumber: [{type: String, number: String}],
        emails: [{email: String, order: Number}]
        
      });
var User = mongoose.model('User', UserSchema );

var restaurantSchema = new mongoose.Schema({
        restaurantName: String,
        /*adminUserNames: [String],*/
        userName: [String],
        /*passwordHash: String */
        menu: String,
        imgNames: [{fileName: String, order: Number}],
        hours: [{day: String, open: String, close: String}],
        phoneNumber: [{type: String, number: String}],
        emails: [{email: String, order: Number}],
        address: String,
        website: String
});
var Restaurant = mongoose.model('Restaurant', restaurantSchema);

var homePageSchema = new mongoose.Schema({
        content: ({
                currentPage: Number,
                currentRestaurants: (String)
        }),
        restaurants: String,
})




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




document.addEventListener('DOMContentLoaded', function() {
   
        //press login button
        document.getElementById('loginButton').addEventListener('click', function(e) {
            e.preventDefault();
                    
                    window.location.href = 'login.html';
            
        });
        document.getElementById('signUpButton').addEventListener('click', function(e) {
            e.preventDefault();
                 
                    window.location.href = 'signup.html';
            
        });
        document.getElementById('helpButton').addEventListener('click', function(e) {
            e.preventDefault();
                 
                    window.location.href = 'signup.html';
            
        });
   document.getElementById('newRestaurantButton').addEventListener('click', function(e) {
            e.preventDefault();
                 
                    window.location.href = 'Buissness.html';
            
        });

});
