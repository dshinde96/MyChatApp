const express = require('express');
const router = express.Router();
const {handleUserSignup,handleUserLogin}=require('../Controllers/UserController')
const { body } = require('express-validator');

router.post('/signup',
    body('name', 'Name Cannot be empty').notEmpty(),
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'password Cannot be empty').notEmpty(), handleUserSignup);

router.post('/login',
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'password Cannot be empty').notEmpty(), handleUserLogin);


module.exports = router;