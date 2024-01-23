const {Schema, model} = require('mongoose');

const authorSchema = new Schema({
    name: {
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

module.exports = model('Author', authorSchema);