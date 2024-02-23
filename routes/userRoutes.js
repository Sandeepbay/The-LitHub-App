const express = require('express')
const router = express.Router()
const { storeReturnTo } = require('../middleware');
const User = require('../models/user')
const catchAsync = require('../Utility/catchAsync')
const passport = require('passport')

router.get('/register' , (req,res) => {
    res.render('users/register')
})

router.post('/register' , catchAsync(async(req,res , next) => {
    try {
        const {username , email , password} = req.body
        const user = new User({ username , email})
        const registeredUser = await User.register(user , password)
        req.login(registeredUser , err => {
            if (err) return next(err)
            req.flash('success' , 'Welcome to YelpCamp')
            res.redirect('/books') 
        })
    } 
    catch(e) {
        req.flash('error' , e.message)
        res.redirect('/register')
    }
}))

router.get('/login' , (req,res) => {
    res.render('users/login')
})

router.post('/login' , storeReturnTo ,passport.authenticate('local' , { failureFlash: true , failureRedirect: '/login'}) , async(req,res) => {
    req.flash('success' , 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/books';
    res.redirect(redirectUrl)
})

router.get('/logout' , (req,res,next) => {
    req.logout( function(err) {
        if (err) {
            return next(err)
        }
        req.flash('success' , 'GoodBye!')
        res.redirect('/books')
    })
})

module.exports = router