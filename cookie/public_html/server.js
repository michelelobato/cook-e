// Name- Sameeka Maroli
// Task: Getting the database schema set up, responding to various types of queries, adding new users and items, etc. Also have to write a very simple client (mostly for testing purposes).

const mongo = require("mongoose");
const express = require("express");
const parser = require("body-parser");

var ItemSchema = new mongo.Schema(  {
	id: String,
	title: String,
  	description: String,
  	image: String,
  	price: Number,
  	stat: String
});

var Item = mongo.model("Item",ItemSchema);


var UserSchema = new mongo.Schema(  {
	username: String,
  	password: String,
  	listings: [String],
  	purchases: [String],
});

var User = mongo.model("User",UserSchema);

const mongoServerURL='mongodb://127.0.0.1:27017/pa9';

mongo.connect(mongoServerURL, {useNewUrlParser:true});	

mongo.connection.once('open',_ => {
	console.log('Database connected', mongoServerURL);
});
mongo.connection.once('error', er => {
	console.log('Connection error', er);
});

const server=express();
server.use(express.static("public_html"));
server.use(parser.json());

// Start the server on port 80
server.listen(80, () => {
    console.log(`Server running at http://localhost/`);
  });

// To handle get requests for info about users or items
server.get("/get/:var/", (req, res) =>{
	var requestedResource=req.params.var;
	switch (requestedResource) {
		case "items":
			Item.find({}).exec().then(results =>{
				res.send(results);
			});
		  break;
		case "users":
			User.find({}).exec().then(results =>{
				res.send(results);
				});
		  break;
		default:
		  res.status(404).send("Resource not found");
	  }
});


// To handle the GET requests that searches for the ursers or the items
server.get("/search/:var/:KEYWORD", (req, res) =>{
	var requestedResource=req.params.var;
	var searchQuery= req.params.KEYWORD;
	var items=[];

	switch (requestedResource) {
		case "items":
			Item.find({}).exec().then(results =>{
				for (var i in results){
					if (results[i].description.includes(searchQuery)){
						items.push(results[i]);
						}
					}
					res.send(items);
				});
		  break;
		case "users":
			User.find({}).exec().then(results =>{
				for (var i in results){
					if (results[i].username.includes(searchQuery)){
						items.push(results[i]);
						}
					}
					res.send(items);
				});
		  break;
		default:
		  res.status(404).send("Resource not found");
		  return;
			}
	
});

// To handle the get requests that manage the listings
server.get("/get/:var/:USERNAME", (req, res) =>{
	var variable=req.params.var;
	var username= req.params.USERNAME;
	User.find({}).exec().then(results =>{
		for (var i in results){
			if (username==results[i].username){
				if(variable=="purchases"){
					res.send(results[i].purchases);
				}
				else if (variable=="listings"){
					res.send(results[i].listings);
				}
			}
		}
	});
});

// To handle the POST request that adds the User
server.post("/add/user/", (req, res) =>{
	console.log(req.body);
	var temp= new User({username:req.body.username, password:req.body.password, listings:[], purchases:[]});
	temp.save()
    res.send();
});

// To handle the POST requests that add an Item
server.post("/add/item/:USERNAME", (req, res) =>{
	console.log(req.body);
	var username= req.params.USERNAME;
	var temp= new Item({title:req.body.title, description:req.body.description, image:req.body.image, price:req.body.price, stat: req.body.stat});
	temp.save()
	User.find({}).exec().then(results =>{
		for (var i in results){
			if (username==results[i].username){
				results[i].listings.push(temp._id);
				results[i].save()
			}
		}
	})

	.catch( (error) => {
        console.log('THERE WAS A PROBLEM');
        console.log(error);
	});	
    res.send();
});


