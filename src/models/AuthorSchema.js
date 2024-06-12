const {Schema, model} = require('mongoose');

const authorSchema = new Schema({
    name: {
        type: String,
        unique: true,
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

authorSchema.index({name: "text"});

module.exports = model('Author', authorSchema);