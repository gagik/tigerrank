// Based on https://github.com/Ngalstyan4/princeton-cas/

const passport = require('passport');
const CustomStrategy = require('passport-custom');
const https = require('https');

const CAS = require("./configHelper.js").CAS;

passport.use("cas",new CustomStrategy(
  function(req, done) {
		if(!CAS.enabled)
			return done(null, {id:CAS.demoUser});
  	if (!req.query.ticket)
			return done(null,false, {message:"Invalid pass."});
			
  	https.get(CAS.validate + `?ticket=${req.query.ticket}&service=${CAS.url}`,
  		(res,d)=>
  		{
  			let body = "";
  			res.setEncoding("utf8");
  			res.on('data',(d) => {body+=d})
  			res.on('end', ()=>{
  				let answer = body.split('\n');
  				if (answer[0] == 'no')
  					return done(null,false, {message:"Invalid ticket."});
  				return done(null,{id:answer[1]});
  			})}
  		).on('error',console.log);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    cb(null, {user:"deserialize",id:"sample"});
});

module.exports = {
	passport,
	authenticate:passport.authenticate("cas",{ failureRedirect: CAS.login + '?service=' + CAS.url}),
	logout:  function(req, res){
    req.logout();
    res.redirect(CAS.logout + '?service=' + CAS.url);
  }
}