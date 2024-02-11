const express = require('express')
const router = express.Router()
const catchAsync = require('../Utility/catchAsync')
const Book = require('../models/book')
const { bookSchema} = require('../schemas')
const ExpressError = require('../Utility/ExpressError')


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

router.get('/', catchAsync(async (req,res) => {
    const books = await Book.find({})
    res.render('books/index' , {books})
}))

router.get('/new' , (req,res) => {
    res.render('books/new')
})

router.post('/' , validateCampground ,catchAsync(async (req,res,next) => {  
    // if(!req.body.book) throw new ExpressError('Invalid Book Data' , 400)   
    const book = new Book(req.body.book)
    await book.save()
    res.redirect(`/books/${book._id}`)
}))

router.get('/:id' , catchAsync(async (req,res) => {
    const book = await Book.findById(req.params.id).populate('reviews')
    res.render('books/show' , {book})
}))

router.get('/:id/edit' , catchAsync(async(req,res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/edit' , {book})
}))

router.put('/:id' , validateCampground ,catchAsync(async(req,res) => {
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id , {...req.body.book})
    res.redirect(`/books/${book._id}`)
}))

router.delete('/:id' , catchAsync(async(req,res) => {
    const {id} = req.params
    await Book.findByIdAndDelete(id)
    res.redirect('/books')
}))

module.exports = router