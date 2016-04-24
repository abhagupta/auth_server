const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({sub:user.id, iat:timestamp}, config.secret);
}


exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  // find the user
  User.findOne({email:email}, function(err, existingUser){
    if(err) {return next(err);}

    if(!email ||!password){
      return res.status(422).send({error:'You must provide email and password'});
    }

    //if user exists, throw an error
    if(existingUser){
      return res.status(422).send({error: 'Email is in use'});
    }

    //if not found then cretae a user
    const user = new User({
      email:email,
      password: password
    });
    user.save(function(err){
      if(err) {return next(err);}
      //Respond to user that user was created
      res.json({token:tokenForUser(user)});
    });

  });
}

  exports.signin = function(req, res, next){
    //User has already got email and password authd.
    // We just need to give them a token
    res.send({token: tokenForUser(req.user)})
  }
