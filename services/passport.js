const passport = require('passport');
const User = require('../models/user');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local'); // this  Strategy is used to authenticate with usernae and password

//create a local Strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
   //Verify this username and password. call done with verified
   // otherwise return user other wiser call done with false
   User.findOne({email:email}, function(err, user){
     if(err){return done(err);}
     if(!user) {return done (null, false);}

     //compare passwords here after encoding the submitted password.
     user.comparePassword(password, function(err, isMatch){
       if(err){return done(err);}
       if(!isMatch){
         return done(null, false); //did not match
       }
       return done(null, true);
     })


   })
})

const jwtOptions = {
  jwtFromRequest : ExtractJwt.fromHeader('authorization'),
  secretOrKey : config.secret

};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //see if the user ID in payload exists in our dtaabase
  //if it does,  call 'done' for that user
  //if it does not, call done without the user object
  User.findById(payload.sub, function (err, user){
    if(err) {return done(err, false);} // no we did not find the user
    if(user){
      done(null, user); // when passport calls the done callback, it assigns the user object to req.
    }else{
      done(null, false); // no error but we couldnt find the user
    }
  })
})

//tell passport to use jwt Strategy
passport.use(jwtLogin);
passport.use(localLogin);
