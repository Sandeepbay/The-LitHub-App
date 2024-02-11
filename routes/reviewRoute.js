const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../Utility/catchAsync')
const Review = require('../models/review')
const {reviewSchema } = require('../schemas')
const Book = require('../models/book')
const ExpressError = require('../Utility/ExpressError')

const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg , 400)
    }
    else {
        next()
    }
}

router.post('/' , validateReview ,catchAsync(async(req,res) => {
    const book = await Book.findById(req.params.id)
    const review = new Review(req.body.review)
    book.reviews.push(review)
    await book.save()
    await review.save()
    req.flash('success' , "Successfully created a Review")
    res.redirect(`/books/${book._id}`)
}))

router.delete('/:reviewId' , catchAsync(async(req,res) => {
    const { id , reviewId } = req.params
    await Book.findByIdAndUpdate(id , { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success' , "Successfully Deleted a Review")
    res.redirect(`/books/${id}`)
}))


module.exports = router