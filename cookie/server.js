const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const cm = require('./customsessions');

cm.sessions.startCleanup();


const db  = mongoose.connection;
const mongoDBURL = 'mongodb+srv://jasadelberg:HKjad473@cluster0.qr9yuh3.mongodb.net/';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });


 var UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    salt: Number,
    hash: String,
    email: String,
    phone: String,

});
var User = mongoose.model('User', UserSchema);



let sessions = {};
function addSession(username) {
  let sid = Math.floor(Math.random() * 1000000000);
  let now = Date.now();
  sessions[username] = {id: sid, time: now};
  return sid;
}

function removeSessions() {
  let now = Date.now();
  let usernames = Object.keys(sessions);
  for (let i = 0; i < usernames.length; i++) {
    let last = sessions[usernames[i]].time;
    if (last + 300000 < now) {
      delete sessions[usernames[i]];
    }
  }
  console.log(sessions);
}
setInterval(removeSessions, 2000);


const app = express();
app.use(cookieParser());    
app.use('/app/*', authenticate);
app.use(express.static('public_html'))
//app.get('/', (req, res) => { res.redirect('/home.html'); });
app.use(express.json())
//app.use(parser.text({type: '*/*'}));

function authenticate(req, res, next) {
  let c = req.cookies;
  if (c && c.login) {
    let result = cm.sessions.doesUserHaveSession(c.login.username, c.login.sid);
    if (result) {
      next();
      return;
    }
  }
  res.redirect('/home.html');
}

app.use('*', (req, res, next) => {
  let c = req.cookies;
  if (c && c.login) {
    if (cm.sessions.doesUserHaveSession(c.login.username, c.login.sid)) {
      cm.sessions.addOrUpdateSession(c.login.username);
    }
  }
  next();
});


app.post('/account/login/', (req, res) => {
  let u = req.body.username;
  let p = req.body.password;
  console.log(u);
  console.log(p);
  let p1 = User.find({username:u}).exec();
  p1.then( (results) => {
    console.log(results);
    for(let i = 0; i < results.length; i++) {

      let existingSalt = results[i].salt;
      let toHash = req.body.password + existingSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');
      
      if (newHash == results[i].hash) {
        let id = cm.sessions.addOrUpdateSession(u);
        res.cookie("login", {username: u, sid: id}, {maxAge: 60000*60*24});
        res.end('SUCCESS ' + JSON.stringify(results));
        return;
      } 
    } 
    res.end('login failed');
  });
  p1.catch( (error) => {
    res.end('login failed');
  });
});



app.get('/account/create', (req, res) => {
  let username = req.query.username;
  let password = req.query.password;
  let name = req.query.name;
  let phone = req.query.phone;
  let email = req.query.email;

  let p1 = User.find({ username: username }).exec();

  p1.then((results) => {
    if (results.length > 0) {
      res.end('That username is already taken.');
    } else {
      let newSalt = Math.floor(Math.random() * 1000000);
      let toHash = password + newSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');

      var newUser = new User({
        name: name,
        username: username,
        salt: newSalt,
        hash: newHash,
        email: email,
        phone: phone,
      });

      newUser
        .save()
        .then((doc) => {
          res.end('Created new account!');
        })
        .catch((err) => {
          console.log(err);
          res.end('Failed to create new account.');
        });
    }
  });

  p1.catch((error) => {
    res.end('Failed to create new account.');
  });
});

//Review Schema 
var ReviewSchema = new mongoose.Schema({
  username: String,
  starRating: ,
  reviewText: String,
});

var Review = mongoose.model('Review', ReviewSchema);

app.post('/add/review', async (req, res) => {
  try {
    const { username, starRating, reviewText } = req.body;
    const newReview = new Review({
      username,
      starRating,
      reviewText,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 80;
app.listen(port, () => { console.log('server has started'); });
app.use(express.static('public_html'))
