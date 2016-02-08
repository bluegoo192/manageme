var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport) {

  router.get('/', function(req, res) {
      // Display the Login page with any flash message, if any
  		if (req.isAuthenticated()) {
  			res.redirect('/tasklist');
  		} else {
  			res.render('index', { title: 'SmartTi.me', message: req.flash('message') });
  		}
  	});

  /*router.get('/helloworld', function(req, res){
    res.render('helloworld', {title:'Hello, World!'});
  });*/

  //final login GET
  router.get('/login', function(req, res) {
    res.render('login', {title: 'Log in or sign up', message: req.flash('message')});
  });

  //final login POST
  router.post('/signin', passport.authenticate('login', {
      successRedirect: '/tasklist',
      failureRedirect: '/login',
      failureFlash : true
  }), function(req, res) { console.log('tried to log in 1'); });

  //final registration POST
  router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/tasklist',
      failureRedirect: '/login',
      failureFlash : true
    }));

	router.get('/tasklist', isAuthenticated, function(req, res) {
	    var db = req.db;
	    var collection = db.get('taskcollection');
	    collection.find({},{},function(e,docs){
	       if (docs.length > 0){
	        var earliest = 25;
	        var latest = 0;
	        sunday = [];
	        monday = [];
	        tuesday = [];
	        wednesday = [];
	        thursday = [];
	        friday = [];
	        saturday = [];
	        for(var i = 0; i < docs.length; i ++){
	          switch(docs[i].day){
	            case "Sunday":
	              sunday.push(docs[i]);
	              break;
	            case 'Monday':
	              monday.push(docs[i]);
	              break;
	            case 'Tuesday':
	              tuesday.push(docs[i]);
	              break;
	            case 'Wednesday':
	              wednesday.push(docs[i]);
	              break;
	            case 'Thursday':
	              thursday.push(docs[i]);
	              break;
	            case 'Friday':
	              friday.push(docs[i]);
	              break;
	            case 'Saturday':
	              saturday.push(docs[i]);
	              break;

	          }
	          var hour = parseInt(docs[i].start.split(':')[0])
	          if(hour < earliest){
	            earliest = hour;
	          }
	          if(hour >= latest){
	            latest = hour + 1;
	          }
	        }
	        byDay = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
	        for(var i = 0; i < byDay.length; i++){
	          byDay[i].sort(function(a, b) {
	              return parseFloat(a.start.split(':')[0]) - parseFloat(b.start.split(':')[0]);
	            });
	          }
	      }
	      else {
	        byDay = []
	      }
	        res.render('tasklist', {
	            "tasklist" : docs,
	            "earliestHour" : earliest,
	            "latestHour" : latest,
	            "totalHours" : latest-earliest,
	            "byDay": byDay
	        });
	    });
	});

	router.get('/newtask', function(req, res) {
	    res.render('newtask', { title: 'Add New Task' });
	});

	router.post('/addtask', function(req, res){
	  var db = req.db;

	  var taskName = req.body.taskName;
	  var taskTime = req.body.taskTime;
	  var taskStart = req.body.taskStart;
	  var taskDay = req.body.taskDay;

	  var collection = db.get('taskcollection');

	  collection.insert({
	    "name" : taskName,
	    "time" : taskTime,
	    "start" : taskStart,
	    "day" : taskDay
	  }, function (err, doc){
	    if(err){
	      res.send("fukin error m8");
	    }
	    else{
	      res.redirect("tasklist");
	      }
	  });
	});

	router.post('/tasklist', isAuthenticated, function(req, res) {
		res.render('tasklist', { user: req.user });
	});



  router.get('/userlist', function(req, res) {
      var db = req.db;
      var collection = db.get('usercollection');
      collection.find({},{},function(e,docs){
          res.render('userlist', {
              "userlist" : docs
          });
      });
  });

  router.get('/tasklist', function(req, res) {
      var db = req.db;
      var collection = db.get('taskcollection');
      collection.find({},{},function(e,docs){
          res.render('tasklist', {
              "tasklist" : docs
          });
      });
  });

  router.get('/newuser', function(req, res) {
      res.render('newuser', { title: 'Add New User' });
  });

  router.post('/adduser', function(req, res){
    var db = req.db;

    var userName = req.body.username;
    var userPassword = req.body.userpassword;
    var userEmail = req.body.useremail;

    var collection = db.get('usercollection');

    collection.insert({
      "username" : userName,
      "password" : userPassword,
      "email" : userEmail
    }, function (err, doc){
      if(err){
        res.send("fukin error m8");
      }
      else{
        res.redirect("userlist");
        }
    });
  });

  router.get('/newtask', function(req, res) {
      res.render('newtask', { title: 'Add New Task' });
  });

	router.post('/addtask', function(req, res){
	  var db = req.db;

	  var taskName = req.body.taskName;
	  var taskTime = req.body.taskTime;
	  var taskStart = req.body.taskStart;
	  var taskDay = req.body.taskDay;

	  var collection = db.get('taskcollection');

	  collection.insert({
	    "name" : taskName,
	    "time" : taskTime,
	    "start" : taskStart,
	    "day" : taskDay
	  }, function (err, doc){
	    if(err){
	      res.send("fukin error m8");
	    }
	    else{
	      res.redirect("tasklist");
	      }
	  });
	});


	router.get('/averages', isAuthenticated, function(req, res){
	  var db = req.db;
	  var collection = db.get('taskcollection');
	  collection.find({},{},function(e,docs){
	    function allNames(){
	       var names=[];
	       for(var i = 0; i < docs.length; i++){
	         if(names.indexOf(docs[i].name) <= -1){
	           names.push(docs[i].name);
	          }
	       }
	       return names;
	     }
	  res.render('averages', {
	    "tasklist" : docs,
	    "allNames": allNames()
	    });
	  });
	});
  /* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  return router;

}
