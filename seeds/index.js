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
            owner: '65d8b250749cfa198c19730a',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate vel necessitatibus sed sint quibusdam, ad numquam laborum dolorem quia provident aliquam id modi dolores rem! Natus hic accusantium quo! Animi.Excepturi facere numquam ab tenetur. Officiis sit, magni iusto vero temporibus neque quam voluptates nesciunt, eius vel odio recusandae mollitia unde. Minus ratione officiis quas nostrum laudantium sunt, cumque nulla.',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/du7dfoknu/image/upload/v1708972762/LitHub/w8e8bxsnivlsmwduwuwi.jpg',
                  filename: 'LitHub/w8e8bxsnivlsmwduwuwi',
                },
                {
                  url: 'https://res.cloudinary.com/du7dfoknu/image/upload/v1708972765/LitHub/jzrtwfbx57cjwbo3jhli.jpg',
                  filename: 'LitHub/jzrtwfbx57cjwbo3jhli',
                },
                {
                  url: 'https://res.cloudinary.com/du7dfoknu/image/upload/v1708972770/LitHub/zjeobvf52frsdny2qjjk.jpg',
                  filename: 'LitHub/zjeobvf52frsdny2qjjk',
                },
                {
                  url: 'https://res.cloudinary.com/du7dfoknu/image/upload/v1708972771/LitHub/jmsu6dbxj4dvc75obvf4.jpg',
                  filename: 'LitHub/jmsu6dbxj4dvc75obvf4',
                }
            ],
        })
        await newBook.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})