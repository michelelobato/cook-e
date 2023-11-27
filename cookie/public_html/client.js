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
        username: String,
        passwordHash: String,
      });
var User = mongoose.model('User', UserSchema );





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
    
<<<<<<< HEAD
});

=======
});
>>>>>>> 9328caa (updates)
