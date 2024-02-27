const express = require('express')
const router = express.Router()
const catchAsync = require('../Utility/catchAsync')
const Book = require('../models/book')
const { bookSchema} = require('../schemas')
const ExpressError = require('../Utility/ExpressError')
const {isLoggedIn , validateBook , isOwner} = require('../middleware')
const book = require('../controllers/book')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

router.get('/', catchAsync(book.index))

router.get('/new' ,isLoggedIn , book.renderNewForm)

router.post('/' , isLoggedIn , upload.array('image') , validateBook ,catchAsync(book.createBook))


router.get('/:id' , catchAsync(book.showBook))

router.get('/:id/edit' , isLoggedIn , isOwner ,catchAsync(book.renderEditForm))

router.put('/:id' , isLoggedIn , isOwner , upload.array('image') , validateBook ,catchAsync(book.editBook))

router.delete('/:id' , isLoggedIn, isOwner ,catchAsync(book.deleteBook))

module.exports = router