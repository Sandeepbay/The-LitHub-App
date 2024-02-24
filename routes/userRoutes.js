const express = require('express')
const router = express.Router()
const { storeReturnTo } = require('../middleware');
const User = require('../models/user')
const catchAsync = require('../Utility/catchAsync')
const passport = require('passport')
const user = require('../controllers/user')

router.get('/register' , user.renderRegisterForm )

router.post('/register' , catchAsync(user.createUser))

router.get('/login' , user.renderLoginForm)

router.post('/login' , storeReturnTo , passport.authenticate('local' , { failureFlash: true , failureRedirect: '/login'}) , user.loginUser)

router.get('/logout' , user.logoutUser)

module.exports = router