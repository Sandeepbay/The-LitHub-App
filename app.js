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

app.get('/createBook', async (req,res) => {
    const book = new Book({ name: "One Night @ Call Center" , author: "Chetan Bhagat"})
    await book.save()
    res.send(book)
})

app.listen(3000 , (re,res) => {
    console.log("Listening at Port 3000")
})