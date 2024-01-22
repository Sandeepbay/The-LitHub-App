const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    title: String,
    author: String,
    price: Number,
    description: String
})

module.exports = new mongoose.model('Book' , bookSchema)