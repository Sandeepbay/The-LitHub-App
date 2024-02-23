const express = require('express')
const mongoose = require('mongoose')
const methodOveride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./Utility/catchAsync')
const ExpressError = require('./Utility/ExpressError')
const { bookSchema , reviewSchema } = require('./schemas')
const app = express()
const path = require('path')
const Book = require('./models/book')
const Review = require('./models/review')
const booksRoute = require('./routes/booksRoute')
const reviewRoute = require('./routes/reviewRoute')
const userRoute = require('./routes/userRoutes')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const strategyLocal = require('passport-local')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/the-lithub')

const db = mongoose.connection
db.on('error' , console.error.bind(console , 'Connection error:'))
db.once('open' , () => {
    console.log("Database Connected")
})

app.engine('ejs' , ejsMate)

app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOveride('_method'))
app.use(express.static(path.join(__dirname , 'public')))

const sessionConfig = {
    secret: 'thishsouldbeagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 4 * 7,
        maxAge: 1000 * 60 * 60 * 4 * 7
    }
}
app.use(session(sessionConfig))



app.use(passport.initialize())
app.use(passport.session())
passport.use(new strategyLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())
app.use((req,res,next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// app.get('/fakeUser' , async(req,res) => {
//     const user = new User({email: 'sandeepbay@gmail.com' , username: 'Sandeepbay'})
//     const newUser = await User.register(user , 'chicken')
//     res.send(newUser)
// })

app.get('/' , (req,res) => {
    res.render('home')
})

app.use('/books' , booksRoute)
app.use('/books/:id/reviews' , reviewRoute)
app.use('/' , userRoute)


app.all('*' , (req,res,next) => {
    next(new ExpressError('Page Not Found' , 404))
})

app.use((err,req,res,next) => {
    const { statusCode = 500 } = err
    if(!err.message) err.message = "You have encountered an Error"
    res.status(statusCode).render('error' , { err })
})

app.listen(3000 , () => {
    console.log("Listening at Port 3000")
})