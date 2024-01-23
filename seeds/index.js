const mongoose = require('mongoose')
const Book = require('../models/book')
const books = require('./books')

mongoose.connect('mongodb://localhost:27017/the-lithub')

const db = mongoose.connection
db.on('error' , console.error.bind(console , 'Connection error:'))
db.once('open' , () => {
    console.log("Database Connected")
})

const seedDB = async () => {
    await Book.deleteMany({})
    for (let book of books) {
        const newBook = new Book({
            title: book.title,
            author: book.author
        })
        await newBook.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})