const Book = require('../models/book')
const Review = require('../models/review')

module.exports.createReview = async(req,res) => {
    const book = await Book.findById(req.params.id)
    const review = new Review(req.body.review)
    review.owner = req.user._id
    book.reviews.push(review)
    await book.save()
    await review.save()
    req.flash('success' , "Successfully created a Review")
    res.redirect(`/books/${book._id}`)
}

module.exports.deleteReview = async(req,res) => {
    const { id , reviewId } = req.params
    await Book.findByIdAndUpdate(id , { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success' , "Successfully Deleted a Review")
    res.redirect(`/books/${id}`)
}