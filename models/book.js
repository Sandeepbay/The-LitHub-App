const mongoose = require('mongoose')
const Review = require("./review")
const Schema = mongoose.Schema


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload' , '/upload/w_300')
})

const bookSchema = new Schema({
    title: String,
    author: String,
    price: Number,
    description: String,
    images: [ImageSchema],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

bookSchema.post('findOneAndDelete' , async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = new mongoose.model('Book', bookSchema);