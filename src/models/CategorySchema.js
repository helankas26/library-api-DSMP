import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const categorySchema = new Schema({
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            default: undefined
        }
    ]
});

module.exports = model('Category', categorySchema);