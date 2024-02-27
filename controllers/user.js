const User = require('../models/user')

module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register')
}

module.exports.createUser = async(req,res , next) => {
    try {
        const {username , email , password} = req.body
        const user = new User({ username , email})
        const registeredUser = await User.register(user , password)
        req.login(registeredUser , err => {
            if (err) return next(err)
            req.flash('success' , 'Welcome to Lithub App')
            res.redirect('/books') 
        })
    } 
    catch(e) {
        req.flash('error' , e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login')
}

module.exports.loginUser = async(req,res) => {
    req.flash('success' , 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/books';
    res.redirect(redirectUrl)
}

module.exports.logoutUser =  (req,res,next) => {
    req.logout( function(err) {
        if (err) {
            return next(err)
        }
        req.flash('success' , 'GoodBye!')
        res.redirect('/books')
    })
}