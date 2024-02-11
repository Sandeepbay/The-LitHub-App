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


app.get('/' , (req,res) => {
    res.render('home')
})

app.use('/books' , booksRoute)
app.use('/books/:id/reviews' , reviewRoute)


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