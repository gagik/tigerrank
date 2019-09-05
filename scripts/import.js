// A simple script to fill up a database of names through a JSON file
// formatted as follows: {name: "Full Name", netid: "netidhere"};

// File to import information from
const FILENAME = "randomData.json";

// MongoDB Information
const config = require('./configHelper.js');
const MONGO_URI = config.MONGO.uri;
const MONGO_DB = config.MONGO.db;

const fs = require("fs");
const userFile = fs.readFileSync(FILENAME);
const users = JSON.parse(userFile);

const mongo = require('mongodb').MongoClient;

mongo.connect(MONGO_URI, function(err, db) {
	dbo = db.db(MONGO_DB);

	for(var i = 0; i < users.length; i++) {
		dbo.collection("names").insertOne({name:users[i]["name"], id:users[i]["netid"], rank:i+1, complaints: 0});
	}
});