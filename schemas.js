const Joi = require('joi')

module.exports.bookSchema = Joi.object({
    book: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string(),
        description: Joi.string().required()
    }).required()
})