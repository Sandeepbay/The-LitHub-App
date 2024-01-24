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
    price = Math.floor(Math.random() * 20) + 10
    for (let book of books) {
        const newBook = new Book({
            title: book.title,
            author: book.author,
            image: `https://loremflickr.com/300/300/books?random=5`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate vel necessitatibus sed sint quibusdam, ad numquam laborum dolorem quia provident aliquam id modi dolores rem! Natus hic accusantium quo! Animi.Excepturi facere numquam ab tenetur. Officiis sit, magni iusto vero temporibus neque quam voluptates nesciunt, eius vel odio recusandae mollitia unde. Minus ratione officiis quas nostrum laudantium sunt, cumque nulla.',
            price,
        })
        await newBook.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})