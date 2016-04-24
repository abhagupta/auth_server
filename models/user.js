const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


//defining the model
const userSchema = new Schema({
  email: {type:String, unique:true, lowercase:true},
  password: String
});

userSchema.pre('save', function(next){
  const user = this; // getting access to user model. user instance has user model
  bcrypt.genSalt(10, function(err, salt){

    if(err) {return next(err);}

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){return next(err)}
      user.password = hash;
      next();

    });

  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){  // bcrypt does comparison and returns siMatch
    if(err) {return callback(err);}
    callback(null, isMatch);//when matched
  });
}


//create model class

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
