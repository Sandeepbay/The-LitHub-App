const express = require('express')
const router = express.Router()
const catchAsync = require('../Utility/catchAsync')
const Book = require('../models/book')
const { bookSchema} = require('../schemas')
const ExpressError = require('../Utility/ExpressError')
const {isLoggedIn , validateCampground , isOwner} = require('../middleware')

router.get('/', catchAsync(async (req,res) => {
    const books = await Book.find({})
    res.render('books/index' , {books})
}))

router.get('/new' ,isLoggedIn , (req,res) => {
    res.render('books/new')
})

router.post('/' , isLoggedIn ,validateCampground ,catchAsync(async (req,res,next) => {  
    // if(!req.body.book) throw new ExpressError('Invalid Book Data' , 400)   
    const book = new Book(req.body.book)
    book.owner = req.user._id
    await book.save()
    req.flash('success' , "Successfully Created a Book")
    res.redirect(`/books/${book._id}`)
}))

router.get('/:id' , catchAsync(async (req,res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('owner')
    if(!book) {
        req.flash('error' , 'Cannot find that book')
        return res.redirect('/books')
    }
    res.render('books/show' , {book})
}))

router.get('/:id/edit' , isLoggedIn , isOwner ,catchAsync(async(req,res) => {
    const {id} = req.params
    const book = await Book.findById(id)
    if(!book) {
        req.flash('error' , 'Cannot find that book')
        return res.redirect('/books')
    }
    res.render('books/edit' , {book})
}))

router.put('/:id' , isLoggedIn , isOwner ,validateCampground ,catchAsync(async(req,res) => {
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id , {...req.body.book})
    req.flash('success' , "Successfully Updated a Book")
    res.redirect(`/books/${book._id}`)
}))

router.delete('/:id' , isLoggedIn, isOwner ,catchAsync(async(req,res) => {
    const {id} = req.params
    await Book.findByIdAndDelete(id)
    req.flash('success' , "Successfully Deleted a Book")
    res.redirect('/books')
}))

module.exports = router