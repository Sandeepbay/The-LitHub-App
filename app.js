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

const validateCampground = (req,res,next) => {
    const { error } = bookSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg , 400)
    }
    else {
        next()
    }
}

const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg , 400)
    }
    else {
        next()
    }
}

app.get('/' , (req,res) => {
    res.render('home')
})

app.get('/books', catchAsync(async (req,res) => {
    const books = await Book.find({})
    res.render('books/index' , {books})
}))

app.get('/books/new' , (req,res) => {
    res.render('books/new')
})

app.post('/books' , validateCampground ,catchAsync(async (req,res,next) => {  
    // if(!req.body.book) throw new ExpressError('Invalid Book Data' , 400)   
    const book = new Book(req.body.book)
    await book.save()
    res.redirect(`/books/${book._id}`)
}))

app.get('/books/:id' , catchAsync(async (req,res) => {
    const book = await Book.findById(req.params.id).populate('reviews')
    res.render('books/show' , {book})
}))

app.get('/books/:id/edit' , catchAsync(async(req,res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/edit' , {book})
}))

app.put('/books/:id' , validateCampground ,catchAsync(async(req,res) => {
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id , {...req.body.book})
    res.redirect(`/books/${book._id}`)
}))

app.delete('/books/:id' , catchAsync(async(req,res) => {
    const {id} = req.params
    await Book.findByIdAndDelete(id)
    res.redirect('/books')
}))

app.post('/books/:id/reviews' , validateReview ,catchAsync(async(req,res) => {
    const book = await Book.findById(req.params.id)
    const review = new Review(req.body.review)
    book.reviews.push(review)
    await book.save()
    await review.save()
    res.redirect(`/books/${book._id}`)
}))

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