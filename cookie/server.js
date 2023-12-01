const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');



const db  = mongoose.connection;
const mongoDBURL = 'mongodb+srv://doadmin:8T176LleHu5042fE@cook-e-database-506eb0f7.mongo.ondigitalocean.com/admin?tls=true&authSource=admin';
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

var BusinessSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  menu: String,
  image: String,
  phone: String,
  email: String,
  address: String,
  website: String, 
  logo: String,
});
/**var User = mongoose.model('Business', BusinessSchema); */
/**changed this since it is changing User instead of business*/
var Business = mongoose.model('Business', BusinessSchema); 



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
    //if (last + 120000 < now) {
    if (last + 20000 < now) {
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

app.use('/app/*', authenticate);
app.get('/app/*', (req, res, next) => { 
  console.log('another');
  next();
});


app.post('/account/login', (req, res) => { 
  console.log(sessions);
  let u = req.body;
  let p1 = User.find({username: u.username}).exec();
  p1.then( (results) => { 
    if (results.length == 0) {
      res.end('Coult not find account');
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
  const u = req.body;

  User.find({ username: u.username }).exec()
    .then((results) => {
      if (results.length === 0) {
        const newSalt = '' + Math.floor(Math.random() * 10000000000);
        const toHash = u.password + newSalt;
        const h = crypto.createHash('sha3-256');
        const data = h.update(toHash, 'utf-8');
        const result = data.digest('hex');

        const newUser = new User({
          username: u.username,
          hash: result,
          salt: newSalt,
          name: u.name,    // Include additional fields
          email: u.email,  // Include additional fields
          phone: u.phone   // Include additional fields
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
  username: String,
  starRating: Number,
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


app.post('/create/business', async (req, res) => {
  const { Bname, username, password, menu,
  image, phone, email, address, website, logo} = req.body;

  // Check if a user with the same username already exists
  const existingBusiness = await BusinessSchema.findOne({ Bname });
  const existingUser = await UserSchema.findOne({ username });
if(!existingUser){
  res.status(400).json({ error: 'username account does not exist' });
  
}else{
  if (existingBusiness) {
    res.status(400).json({ error: 'business already exists' });
  } else {
    try {
      const newBusiness = await BusinessSchema.create({ Bname, username, password, menu,
        image, phone, email, address, website, logo });
      res.status(201).json(BusinessSchema);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create business' });
    }
  }
}
});




const port = 80;
app.listen(port, () => { console.log('server has started'); });
app.use(express.static('public_html'))
