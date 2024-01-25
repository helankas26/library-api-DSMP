const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    categoryName: {
        type: String,
        unique: true,
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