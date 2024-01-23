const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const Book = require('./models/book')

mongoose.connect('mongodb://localhost:27017/the-lithub')

const db = mongoose.connection
db.on('error' , console.error.bind(console , 'Connection error:'))
db.once('open' , () => {
    console.log("Database Connected")
})

app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname, 'views'))

app.get('/' , (req,res) => {
    res.render('home')
})

app.get('/books', async (req,res) => {
    const books = await Book.find({})
    res.render('books/index' , {books})
})

app.get('/books/:id' , async (req,res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/show' , {book})
})

app.listen(3000 , (re,res) => {
    console.log("Listening at Port 3000")
})