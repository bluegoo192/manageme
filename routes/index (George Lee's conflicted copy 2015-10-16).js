var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res){
  res.render('helloworld', {title:'Hello, World!'});
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
  var userEmail = req.body.useremail;

  var collection = db.get('usercollection');

  collection.insert({
    "username" : userName,
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

  var collection = db.get('taskcollection');

  collection.insert({
    "name" : taskName,
    "time" : taskTime
  }, function (err, doc){
    if(err){
      res.send("fukin error m8");
    }
    else{
      res.redirect("tasklist");
      }
  });
});

module.exports = router;
