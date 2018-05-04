var express = require('express');
var router = express.Router();
var model   = require('../app/models/index');
var jwt    = require('jsonwebtoken');
var bodyParser  = require('body-parser');

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'ilovengi', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/all', function(req, res) {
  	model.User.findAndCountAll({
        where: {},
        limit: 10
    })
    .then(result => {
      	res.json(result);
    });
});

module.exports = router;
