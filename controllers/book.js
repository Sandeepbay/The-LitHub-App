const Book = require('../models/book')
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req,res) => {
    const books = await Book.find({})
    res.render('books/index' , {books})
}

module.exports.renderNewForm = (req,res) => {
    res.render('books/new')
}

module.exports.createBook = async (req,res,next) => {  
    const book = new Book(req.body.book)
    book.images = req.files.map(f => ({ url: f.path , filename: f.filename }))
    book.owner = req.user._id
    await book.save()
    req.flash('success' , "Successfully Created a Book")
    res.redirect(`/books/${book._id}`)
}

module.exports.showBook = async (req,res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('owner')
    if(!book) {
        req.flash('error' , 'Cannot find that book')
        return res.redirect('/books')
    }
    res.render('books/show' , {book})
}

module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params
    const book = await Book.findById(id)
    if(!book) {
        req.flash('error' , 'Cannot find that book')
        return res.redirect('/books')
    }
    res.render('books/edit' , {book})
}

module.exports.editBook = async(req,res) => {
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id , {...req.body.book})
    const imgs = req.files.map(f => ({ url: f.path , filename: f.filename }))
    book.images.push(...imgs)
    await book.save()
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await book.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } } )
    }
    req.flash('success' , "Successfully Updated a Book")
    res.redirect(`/books/${book._id}`)
}

module.exports.deleteBook = async(req,res) => {
    const {id} = req.params
    await Book.findByIdAndDelete(id)
    req.flash('success' , "Successfully Deleted a Book")
    res.redirect('/books')
}