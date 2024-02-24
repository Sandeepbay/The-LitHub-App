const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../Utility/catchAsync')
const Review = require('../models/review')
const {reviewSchema } = require('../schemas')
const Book = require('../models/book')
const ExpressError = require('../Utility/ExpressError')
const {validateReview , isLoggedIn , isReviewOwner} = require('../middleware')
const review = require('../controllers/review')

router.post('/' , isLoggedIn , validateReview ,catchAsync(review.createReview))

router.delete('/:reviewId' , isLoggedIn ,isReviewOwner , catchAsync(review.deleteReview))

module.exports = router