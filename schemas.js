const Joi = require('joi')

module.exports.bookSchema = Joi.object({
    book: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        price: Joi.number().min(0).required(),
        // image: Joi.string(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})