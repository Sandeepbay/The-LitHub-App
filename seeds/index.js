const mongoose = require('mongoose')
const Book = require('../models/book')
const books = require('./books')

mongoose.connect('mongodb://localhost:27017/the-lithub')

const db = mongoose.connection
db.on('error' , console.error.bind(console , 'Connection error:'))
db.once('open' , () => {
    console.log("Database Connectedd")
})

const seedDB = async () => {
    await Book.deleteMany({})
    // continue from here
}

seedDB()