const express = require('express');
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth2');
const passport = require("passport");
const { handleUserSignup, handleUserLogin, handleSignupByGoogle } = require('../Controllers/UserController')
const { body } = require('express-validator');

passport.use(new GoogleStrategy({
    clientID: "88701807115-l14flim3lg8ptm2cp5p17ed184qm8dat.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/user/auth/google/callback",
}, (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    // console.log(user);
    done(null, user)
})

passport.deserializeUser((user, done) => {
    console.log(user); 
    done(null, user)
})

router.post('/signup',
    body('name', 'Name Cannot be empty').notEmpty(),
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'password Cannot be empty').notEmpty(), handleUserSignup);

router.post('/login',
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'password Cannot be empty').notEmpty(), handleUserLogin);

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    handleSignupByGoogle
);
module.exports = router;