const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
// const env = require('./environment');

// tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: "987342847947-6aq1dtmfq909sn1kd5118e3t3f1jadrk.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },

    function(accessToken, refreshToken, profile, done){
        //find  a user
        User.findOne({email: profile.emails[0].value})
        .then(user =>{
            console.log(accessToken, refreshToken);
            console.log(profile);

            if(user){
                // if  user found set this user as req.user
                return done(null, user);
            }else{
                // if not found create the user and set is as req.user
                return User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }).then(user =>{
                    return done(null, user);
                });
            }
        })
        .catch(err =>{
            console.log('error in google stratergy-passport', err);
            return done(err);
        });
    }

));
