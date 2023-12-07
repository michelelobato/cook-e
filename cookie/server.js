//Group Members: Jasmine Adelberg, Dylan Crites, Michele Lobato, Sameeka Maroli
//CSC 337: Final Project
//This document is the server.js for our cook-e website

const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises; 


const db  = mongoose.connection;
// const mongoDBURL =  'mongodb+srv://admin:ffucSFRiLP8txvNX@cluster0.l2iybs5.mongodb.net/?retryWrites=true&w=majority';
const mongoDBURL = 'mongodb+srv://jasadelberg:HKjad473@cluster0.qr9yuh3.mongodb.net/';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

//User schema
 var UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    salt: Number,
    hash: String,
    email: String,
    phone: String,

});
var User = mongoose.model('User', UserSchema);

//Business schema

var BusinessSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  phone: String,
  email: String,
  address: String,
  website: String,
  restaurantTagline: String,
  dishList1: String,
  dishList2: String,
  dishList3: String,
  openingHours: String,
});

var Business = mongoose.model('Business', BusinessSchema);



//Source from class slides
let sessions = {};
function addSession(username) {
  let sid = Math.floor(Math.random() * 1000000000);
  let now = Date.now();
  sessions[username] = {id: sid, time: now};
  return sid;
}

//Source from class slides
function removeSessions() {
  let now = Date.now();
  let usernames = Object.keys(sessions);
  for (let i = 0; i < usernames.length; i++) {
    let last = sessions[usernames[i]].time;
    // Keep users logged in for five minutes (300,000 milliseconds)
    if (last + 300000 < now) {
      delete sessions[usernames[i]];
    }
  }
  console.log(sessions);
}
setInterval(removeSessions, 2000);


const app = express();
app.use(cookieParser());    
//app.get('/', (req, res) => { res.redirect('/app/index.html'); });
app.use(express.json())
//app.use(parser.text({type: '*/*'}));

//Source from class slides
function authenticate(req, res, next) {
  let c = req.cookies;
  console.log('auth request:');
  console.log(req.cookies);
  if (c != undefined) {
    if (sessions[c.login.username] != undefined && 
      sessions[c.login.username].id == c.login.sessionID) {
      next();
    } else {
      res.redirect('index.html');
    }
  }  else {
    res.redirect('index.html');
  }
}

//Source from class slides
app.use('/app/*', authenticate);
app.get('/app/*', (req, res, next) => { 
  console.log('another');
  next();
});


app.post('/account/login', (req, res) => { 
//Logs in a user using salt and hash instead of password
//Source from class slides
  console.log(sessions);
  let u = req.body;
  let p1 = User.find({username: u.username}).exec();
  p1.then( (results) => { 
    if (results.length == 0) {
      res.end('Could not find account');
    } else {
      let currentUser = results[0];
      let toHash = u.password + currentUser.salt;
      let h = crypto.createHash('sha3-256');
      let data = h.update(toHash, 'utf-8');
      let result = data.digest('hex');
      
      console.log(toHash);
      console.log('HASH WE JUST MADE:');
      console.log(result);
      console.log('THE ORIGINAL HASH:');
      console.log(currentUser.hash);

      if (result == currentUser.hash) {
          let sid = addSession(u.username);  
          res.cookie("login", 
            {username: u.username, sessionID: sid}, 
            {maxAge: 60000 * 2 });
          res.end('SUCCESS');
      } else {
          res.end('FAILED TO LOG IN');
      }
    }
  });
});

app.post('/account/create', (req, res) => {
//creates an account for the user
  const u = req.body;

  User.find({ username: u.username }).exec()
    .then((results) => {
      if (results.length === 0) {
      //Salting and Hashing: Source from class slides
        const newSalt = '' + Math.floor(Math.random() * 10000000000);
        const toHash = u.password + newSalt;
        const h = crypto.createHash('sha3-256');
        const data = h.update(toHash, 'utf-8');
        const result = data.digest('hex');

        const newUser = new User({
          username: u.username,
          hash: result,
          salt: newSalt,
          name: u.name,    
          email: u.email,  
          phone: u.phone
        });

        newUser.save()
          .then(() => {
            res.end('USER CREATED');
          })
          .catch(() => {
            res.end('DATABASE SAVE ISSUE');
          });
      } else {
        res.end('USERNAME ALREADY TAKEN');
      }
    });
});

//Review Schema 
var ReviewSchema = new mongoose.Schema({
  business: String,
  username: String,
  starRating: Number,
  reviewText: String,
  createdAt: { type: Date, default: Date.now },
});
var Review = mongoose.model('Review', ReviewSchema);

app.post('/add/review', async (req, res) => {
//adds a review that the user creates
  try {
    const { business, username, starRating, reviewText, createdAt } = req.body;
    const newReview = new Review({
      business,
      username,
      starRating,
      reviewText,
      createdAt,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/business/create', async (req, res) => {

  // Creates an account for the user
  try {
    const { name, username, password } = req.body;

    const newBusiness = new Business({
      name: name,
      username: username,
      password: password
    });
  
    console.log(newBusiness);
    
    await newBusiness.save()

          .then(() => {
            res.end('SUCCESS');
          })
          .catch(() => {
            res.end('DATABASE SAVE ISSUE');
          });
        }catch(error){
console.error(error);
res.status(500).json({error: 'server error'});
        }
        });

app.get('/get/reviews/:business', async (req, res) => {
//gets all the business's reviews
    try {
        const business = req.params.business;
        const reviews = await Review.find({ business: business }).exec();
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/get/businesses/', async (req, res) => {
  try {
    const businessList = await Business.find().exec();
    res.status(200).json(businessList);
  }catch(error) {
    console.error(error);
    res.status(500).json({error: 'Unable to find restaurants'});
  }
  
});


app.use(express.static("public_html"))
app.use('/img', express.static(__dirname + '/img'));

// creating the dynamic website that takes information fromthe business form and creates a webpage in the given template

app.get('/api/data', (req, res) => {
    dataCollection.find({}).toArray()
        .then(results => {
            res.json(results);
        })
        .catch(error => console.error(error));
});
app.get('/Buissness.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Buissness.html'));
});
app.get('/BStyle.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'BStyle.css')); // Adjust the file name/path as necessary
});

app.post('/submit-form', async (req, res) => {
    const formData = req.body; 
    dataCollection.insertOne(formData)
        .then(result => {
            console.log('Form Data Saved');
        })
        .catch(error => console.error(error));

    // Generate a new HTML page using the form data
    const templatePath = path.join(__dirname, 'template.html');
    let templateHTML = await fs.readFile(templatePath, 'utf8');
    console.log(formData)
    
    app.get('/yelp.css', (req, res) => {
        res.sendFile(path.join(__dirname, 'yelp.css')); // Adjust the file name/path as necessary
    });

    templateHTML = templateHTML.replace('<h1 id="restaurantName"></h1>', `<h1 id="restaurantName">${formData.BName}</h1>`);
    templateHTML = templateHTML.replace('<h2 id="restaurantTagline"></h2>', `<h2 id="restaurantTagline">${formData.BrestaurantTagline}</h2>`);
    templateHTML = templateHTML.replace('{{LocationArea}}', formData.BLocation);
    templateHTML = templateHTML.replace('{{restaurantAddress}}', formData.BAddress);
    templateHTML = templateHTML.replace('{{openingHours}}', formData.BopeningHours);
    templateHTML = templateHTML.replace('{{website}}', formData.BWebsite);

    //templateHTML = templateHTML.replace('<p id="openingHours">Open: {{openingHours}}</p>', `<p id="openingHours">Open :${formData.BopeningHours}</p>`);
    templateHTML = templateHTML.replace('{{GoogleMapsURL}}', formData.BGoogleMapsURL);
    templateHTML = templateHTML.replace('{{OrderLink}}', formData.BOrderLink);
    templateHTML = templateHTML.replace('{{Pop1}}', formData.BdishesList1)
    templateHTML = templateHTML.replace('{{Pop2}}', formData.BdishesList2)
    templateHTML = templateHTML.replace('{{Pop3}}', formData.BdishesList3)

    res.send(templateHTML);
});

const port = 80;
app.listen(port, () => { console.log('server has started'); });
app.use(express.static('public_html'))
