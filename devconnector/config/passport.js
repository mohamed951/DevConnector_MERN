const JwtStrategy = require('passport-jwt').Strategy;
const ExctractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const secretKey = require('./keys').secretOrKey;


const opts = {};
opts.jwtFromRequest = ExctractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
console.log(secretKey);
module.exports = passport => {
  passport.use(
     new JwtStrategy(opts,(jwt_payload,done)=>{
       User.findById(jwt_payload.id)
       .then(user=>{
         if(user){
           return done(null,user);
         }
         else return done(null,false);
       })
       .catch(err=>{console.log(err)})
     })
  )
}