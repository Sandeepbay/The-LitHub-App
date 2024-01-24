const express = require('express')
const mongoose = require('mongoose')
const methodOveride = require('method-override')
const ejsMate = require('ejs-mate')
const app = express()
const path = require('path')
const Book = require('./models/book')

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

app.get('/books', async (req,res) => {
    const books = await Book.find({})
    res.render('books/index' , {books})
})

app.get('/books/new' , (req,res) => {
    res.render('books/new')
})

app.post('/books' , async(req,res) => {
    const book = new Book(req.body.book)
    await book.save()
    res.redirect(`/books/${book._id}`)
})

app.get('/books/:id' , async (req,res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/show' , {book})
})

app.get('/books/:id/edit' , async(req,res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/edit' , {book})
})

app.put('/books/:id' , async(req,res) => {
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id , {...req.body.book})
    res.redirect(`/books/${book._id}`)
})

app.delete('/books/:id' , async(req,res) => {
    const {id} = req.params
    await Book.findByIdAndDelete(id)
    res.redirect('/books')
})

app.listen(3000 , () => {
    console.log("Listening at Port 3000")
})