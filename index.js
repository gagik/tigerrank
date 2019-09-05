const express = require('express')
const fs = require("fs");
const app = express()
const port = process.env.PORT || 8080;
const session = require('express-session')({
    secret: "insertsecrethere",
    resave: true,
    saveUninitialized: true
});
const bodyParser = require("body-parser");
const sharedsession = require("express-socket.io-session");
const mongo = require('mongodb').MongoClient;
var dbo;

const Auth = require('./helpers/auth.js');
const rank = require('./helpers/rankHelper.js');
const config = require('./helpers/configHelper.js');

// ===== Basic Configuration =====
const DEMO_MODE = config.info.demo;

// CAS and Website Information
const SERVICE_URL = config.CAS.url;
const CAS_LOGIN_URL = config.CAS.login;
// MongoDB Information
const MONGO_URI = config.MONGO.uri;
const MONGO_DB = config.MONGO.db;

// Initialize Passport and restore authentication state, if any, from the session.
app.use(session);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(Auth.passport.initialize());
app.use(Auth.passport.session());

// Number of users for limiting how low can one go.
// Note: at the moment this number  is overridden during startup
var NUMBER_OF_USERS = 100000;

mongo.connect(MONGO_URI, function(err, db) {
		if (err) console.log(err);
		dbo = db.db(MONGO_DB);

		const students = dbo.collection("names");

		students.find({}, {'fields':{name: 1, id: 1, _id:0}}).toArray().then(
			function(result) {
				NUMBER_OF_USERS = result.length;
			})
		});

// template engine
app.set('view engine', 'ejs');

// make the public folder accessible on the system
app.use(express.static('public'));

app.get('/rankings',
  Auth.passport.authenticate("cas", {failureRedirect: CAS_LOGIN_URL + "?service=" + SERVICE_URL + '/rankings'}), 
	function(req, res) {
		mongo.connect(MONGO_URI, function(err, db) {
			if (err) console.log(err);
		dbo = db.db(MONGO_DB);

		const students = dbo.collection("names");

		var id = req.user.id;
	  	req.session.userid = id;

		students.find({}, {'fields':{name: 1, id: 1, _id:0}}).sort({rank: 1}).toArray().then(
			function(result) {
				res.render("rankings", {names:result, id:id, info: config.info});
			})
		});
  });

const server = app
  .listen(port, () => console.log(`Listening on ${ port }`));
const io  = require('socket.io')(server);

io.use(sharedsession(session)).on('connection', function (socket) {
  var user = socket.handshake.session.userid;

  if(user == undefined)
  	return;

  console.log(user + " connected.");
  socket.on('complaint', function (complaintMsg) {
			getUser({id: user}, function(student) {
				if(student.complaints >= 4) {
					if(DEMO_MODE)
						console.log(complaintMsg);

					console.log(user + " tried but reached limit.");
					socket.emit("toomuch");
					return;
				}

				if(!!complaintMsg && complaintMsg.length > 2) {
					mongo.connect(MONGO_URI, function(err, db) {
						if (err) console.log(err);

						dbo = db.db(MONGO_DB);
						dbo.collection("complaints").insertOne({message: user + ": " + complaintMsg});
						console.log(user + "(#" + student.rank + "-> #" + (student.rank + 250) + ") complained: " + complaintMsg);
					});
				}
				if(student.complaints == null)
					student.complaints = 1;
				else
					student.complaints++;

				dbo.collection("names").updateOne(
								{id: student.id},
								{$set: {complaints: student.complaints}},
								{ upsert: true });

				rank.swap(student.rank, student.rank + 250, NUMBER_OF_USERS);
  	});
  });
});


app.get('/',
  function(req, res) {
    res.render("login", {info: config.info});
  });


function getUser(netid, callback) {
	dbo.collection("names").findOne(netid, function(err, arr) {
		if(err)	console.log(err);
		callback(arr);
	});
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

app.get('/logout', Auth.logout);
app.use('/assets', express.static('public'))