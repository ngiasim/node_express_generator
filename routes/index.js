var express = require('express');
var router = express.Router();

var model   = require('../app/models/index');
var jwt    = require('jsonwebtoken');
var bodyParser  = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/authenticate', function(req, res) {
	model.User.findOne({
	  where: {email: req.body.email}
	}).then(user => {
	    if (!user) {
	      res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {
	      // check if password matches
	      if (user.password != req.body.password) {
	        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	      } else {
	        // if user is found and password is right
	        // create a token with only our given payload
	    // we don't want to pass in the entire user since that has the password
	    const payload = {
	      admin: user.id 
	    };
	        var token = jwt.sign(payload, 'ilovengi', {
	          expiresIn: 25 // expires in 25 seconds
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	})

});

router.post('/register', function(req, res) {
    var userData = req.body;
    model.User.findAll({
        where: {
            email: userData.email
        }
    }).then(function(user){
        if(user.length > 0){
          res.json({
		      success: false,
		      message: 'Email already exists!'
		    });
        }else{
        	model.User.create({ 
        		firstName: userData.firstName, 
        		lastName: userData.lastName, 
        		email: userData.email,
        		password: userData.password,
        		active: 1
        	}).then(user_obj => {
			  	res.json({
			      success: true,
			      message: 'Registered Successfully!',
			      user_obj: user_obj
			    });
			})
        }
    });
});

module.exports = router;
