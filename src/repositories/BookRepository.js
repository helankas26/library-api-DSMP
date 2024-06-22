const mongoose = require('mongoose');

const Book = require('../models/BookSchema');
const Author = require('../models/AuthorSchema');
const Category = require('../models/CategorySchema');

const findAllBooks = async () => {
    try {
        return await Book.find();
    } catch (error) {
        throw error;
    }
}

const findAllBooksWithPagination = async (page, size) => {
    try {
        const totalCount = await Book.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const books = await Book.find({}).skip(skip).limit(size);
        const to = skip + books.length;

        return {books, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllBooksBySearchWithPagination = async (searchText, page, size) => {
    try {
        const totalCount = await Book.find({$text: {$search: searchText}}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const books = await Book.find({$text: {$search: searchText}}).skip(skip).limit(size);
        const to = skip + books.length;

        return {books, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const createBook = async (bookData) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const book = new Book({
            title: bookData.title,
            edition: bookData.edition,
            cover: bookData.cover,
            description: bookData.description,
            noOfCopies: bookData.noOfCopies,
            availableCount: bookData.noOfCopies
        });

        const savedBook = await book.save({session: session});
        if (!savedBook) {
            throw new Error("Could not save book. Try again!");
        }

        try {
            const category = await Category.findById(bookData.category).session(session);
            category.books.push(savedBook._id);
            await category.save();
        } catch (error) {
            throw new Error('Category not found. Could not save book. Try again!');
        }

        for (const authorId of bookData.authors) {
            try {
                const author = await Author.findById(authorId).session(session);
                author.books.push(savedBook._id);
                await author.save();
            } catch (error) {
                throw new Error('An Author not found. Could not save book. Try again!');
            }
        }

        // Alternative way to update each specified author's books array
        /*await Author.updateMany(
            { _id: { $in: bookData.authors } },
            { $addToSet: { books: savedBook._id } },
            { session }
        );*/

        await session.commitTransaction();
        return savedBook;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const findBookById = async (params) => {
    try {
        return await Book.findById(params.id)
            .populate({path: 'authors', select: ['name', '-books']})
            .populate({path: 'category', select: ['categoryName', '-books']});

        // Alternative way to achieve above without Populate Virtuals
        /*const book = await Book.findById(params.id);
        if (!book) {
            throw new Error('Book not found');
        }
        const authors = await Author.find({books: params.id}).select(['_id', 'name']);
        const category = await Category.find({books: params.id}).select(['_id', 'categoryName']);

        return {...book.toObject(), authors, category};*/
    } catch (error) {
        throw error;
    }
}

const updateBook = async (params, bookData) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const book = await Book.findById(params.id).session(session);
        if (!book) {
            throw new Error("Book not found. Try again!");
        }
        const copies = bookData.noOfCopies - book.noOfCopies;
        bookData.availableCount = book.availableCount + copies;

        const updatedBook = await Book.findByIdAndUpdate(params.id, bookData, {
            new: true,
            runValidators: true,
            session: session
        })
            .populate({path: 'authors', select: ['name', '-books']})
            .populate({path: 'category', select: ['categoryName', '-books']});

        const {authors, category} = updatedBook;

        try {
            if (category._id !== bookData.category) {
                await Category.findByIdAndUpdate(category._id, {$pull: {books: params.id}}, {runValidators: true}).session(session);
                await Category.findByIdAndUpdate(bookData.category, {$addToSet: {books: params.id}}, {runValidators: true}).session(session);
            }
        } catch (error) {
            throw new Error('Category not found. Could not update book. Try again!');
        }

        const currentAuthors = authors.map(author => author._id);
        const authorsToRemove = currentAuthors.filter(id => !bookData.authors.includes(id));
        const authorsToAdd = bookData.authors.filter(id => !currentAuthors.includes(id));

        await Author.updateMany(
            {_id: {$in: authorsToRemove}},
            {$pull: {books: params.id}},
            {session}
        );

        for (const authorId of authorsToAdd) {
            try {
                await Author.findByIdAndUpdate(authorId, {$addToSet: {books: params.id}}, {runValidators: true}).session(session);
            } catch (error) {
                throw new Error('An Author not found. Could not save book. Try again!');
            }
        }

        await session.commitTransaction();
        return updatedBook;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const deleteBook = async (params) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tempBook = await Book.findById(params.id)
            .populate({path: 'authors', select: ['name', '-books']})
            .populate({path: 'category', select: ['categoryName', '-books']}).session(session);

        const {authors, category} = tempBook;
        await Category.findByIdAndUpdate(category._id, {$pull: {books: params.id}}, {runValidators: true}).session(session);

        const authorIds = authors.map(author => author._id);
        await Author.updateMany(
            {_id: {$in: authorIds}},
            {$pull: {books: params.id}},
            {session}
        );

        const book = await Book.findByIdAndDelete(params.id).session(session);
        
        await session.commitTransaction();
        return book;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

module.exports = {
    findAllBooks,
    findAllBooksWithPagination,
    findAllBooksBySearchWithPagination,
    createBook,
    findBookById,
    updateBook,
    deleteBook
}